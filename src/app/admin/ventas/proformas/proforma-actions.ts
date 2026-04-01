"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

const IVA_RATE = 0; // 0% Ecuador (RIMPE Emprendedores)

export interface ProformaItem {
  product_id: string;
  quantity: number;
  precio_unitario: number;
}

export interface QuickCustomerData {
  nombre_facturacion: string;
  email: string;
  numero_documento: string;
  tipo_documento: string;
  telefono: string;
  province?: string;
  city?: string;
  address?: string;
}

/**
 * Crea un cliente rápido si no existe uno con el mismo email o número de documento.
 */
export async function quickCreateCustomer(data: QuickCustomerData) {
  const supabase = await createClient();

  // 1. Verificar si ya existe por email o documento
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .or(`email.eq.${data.email},numero_documento.eq.${data.numero_documento}`)
    .maybeSingle();

  if (existingCustomer) {
    return { success: true, customerId: existingCustomer.id };
  }

  // 2. Insertar nuevo cliente
  const { data: newCustomer, error } = await supabase
    .from("customers")
    .insert({
      email: data.email,
      nombre_facturacion: data.nombre_facturacion,
      numero_documento: data.numero_documento,
      tipo_documento: data.tipo_documento,
      telefono: data.telefono,
      province: data.province || "Chimborazo",
      city: data.city || "Riobamba",
      address: data.address || "",
      country: "Ecuador",
      is_company: data.tipo_documento === "RUC",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating quick customer:", error);
    return { success: false, error: "No se pudo crear el cliente rápido." };
  }

  return { success: true, customerId: newCustomer.id };
}

/**
 * Procesa y guarda una proforma con sus ítems.
 */
export async function saveProforma(
  customerId: string,
  items: ProformaItem[],
  options?: {
    customProformaNumber?: string;
    descuento_valor?: number;
    descuento_tipo?: 'fixed' | 'percentage';
    dias_validez?: number;
  }
) {
  const supabase = await createClient();

  // 1. Validaciones básicas
  if (!items || items.length === 0) {
    return { success: false, error: "La proforma debe incluir al menos un ítem." };
  }

  // 2. Cálculos Financieros
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.precio_unitario), 0);
  
  if (subtotal <= 0) {
    return { success: false, error: "El subtotal debe ser mayor a 0." };
  }

  // Descuento
  const desc_valor = options?.descuento_valor || 0;
  const desc_tipo = options?.descuento_tipo || 'fixed';
  let desc_total = 0;

  if (desc_tipo === 'percentage') {
    desc_total = subtotal * (desc_valor / 100);
  } else {
    desc_total = desc_valor;
  }

  const subtotalConDescuento = Math.max(0, subtotal - desc_total);
  const impuesto = subtotalConDescuento * IVA_RATE;
  const total = subtotalConDescuento + impuesto;

  // Validez
  const diasValidez = options?.dias_validez || 15;
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + diasValidez);

  // 3. Generar número de proforma si no se provee
  let finalProformaNumber = options?.customProformaNumber;
  if (!finalProformaNumber) {
    const { count } = await supabase
      .from("proformas")
      .select("*", { count: "exact", head: true });
    
    finalProformaNumber = `PRO-${String((count || 0) + 1).padStart(5, "0")}`;
  }

  // 4. Insertar la Proforma
  const { data: proforma, error: proformaError } = await supabase
    .from("proformas")
    .insert({
      customer_id: customerId,
      numero_proforma: finalProformaNumber,
      subtotal: subtotal,
      descuento_valor: desc_valor,
      descuento_tipo: desc_tipo,
      descuento_total: desc_total,
      impuesto: impuesto,
      total: total,
      fecha: new Date().toISOString(),
      dias_validez: diasValidez,
      fecha_vencimiento: fechaVencimiento.toISOString(),
    })
    .select("id")
    .single();

  if (proformaError) {
    console.error("Error creating proforma header:", proformaError);
    return { success: false, error: `Error al guardar la cabecera: ${proformaError.message}` };
  }

  // 5. Insertar Detalles de Proforma
  const detallesToInsert = items.map((item) => ({
    proforma_id: proforma.id,
    product_id: item.product_id,
    cantidad: item.quantity,
    precio_unitario: item.precio_unitario,
    subtotal: item.quantity * item.precio_unitario,
  }));

  const { error: detallesError } = await supabase
    .from("proforma_detalles")
    .insert(detallesToInsert);

  if (detallesError) {
    console.error("Error creating proforma details:", detallesError);
    return { success: false, error: `Error al guardar los ítems: ${detallesError.message}` };
  }

  revalidatePath("/admin/ventas/proformas");
  
  return { 
    success: true, 
    proformaId: proforma.id,
    numero: finalProformaNumber,
    total: total
  };
}

/**
 * Fetches full proforma data including customer and items for PDF generation.
 */
export async function getFullProformaData(proformaId: string) {
  const supabase = await createClient();

  const { data: proforma, error } = await supabase
    .from("proformas")
    .select(`
      *,
      customers (
        nombre_facturacion,
        company_name,
        tax_id,
        numero_documento,
        email,
        address
      ),
      proforma_detalles (
        cantidad,
        precio_unitario,
        products (
          name
        )
      )
    `)
    .eq("id", proformaId)
    .single();

  if (error || !proforma) {
    console.error("Error fetching full proforma data:", error);
    return null;
  }

  // Map to common structure used by ProformaCentrada
  return {
    type: "PROFORMA" as const,
    number: proforma.numero_proforma,
    date: new Date(proforma.fecha || proforma.created_at).toLocaleDateString("es-EC", { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }),
    expiryDate: proforma.fecha_vencimiento ? new Date(proforma.fecha_vencimiento).toLocaleDateString("es-EC", { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }) : null,
    validityDays: proforma.dias_validez,
    clientData: {
      name: proforma.customers?.nombre_facturacion || proforma.customers?.company_name || "Cliente",
      taxId: proforma.customers?.tax_id || proforma.customers?.numero_documento || "N/A",
      email: proforma.customers?.email || "",
      address: proforma.customers?.address || ""
    },
    items: (proforma.proforma_detalles || []).map((d: any) => ({
      description: d.products?.name || "Producto/Servicio",
      quantity: d.cantidad,
      unitPrice: d.precio_unitario
    })),
    customSubtotal: proforma.subtotal,
    discount: proforma.descuento_total,
    customTax: proforma.impuesto,
    customTotal: proforma.total
  };
}
