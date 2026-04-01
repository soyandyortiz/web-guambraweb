"use server";

import { createClient } from "@/lib/supabase/server";
import { CartItem } from "@/components/providers/CartProvider";

// Servidor auxiliar utilizando Admin Role para crear perfiles desde el registro
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function saveCustomerData(
  userId: string | null,
  email: string,
  fullName: string,
  tipo_documento: string,
  numero_documento: string,
  nombre_facturacion: string,
  telefono: string,
  province: string,
  city: string,
  address: string,
) {
  if (!email || email.trim() === "") {
    return { success: false, message: "El correo electrónico es obligatorio." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "El formato del correo electrónico no es válido.",
    };
  }

  if (!numero_documento || numero_documento.trim() === "") {
    return {
      success: false,
      message: "El Número de Documento es obligatorio.",
    };
  }

  let resolvedUserId = userId;

  // Si no tenemos userId (checkout de invitado), intentamos buscar si el email ya pertenece a un perfil
  // Esto evita "duplicar clientes por email"
  if (!resolvedUserId && email) {
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      resolvedUserId = existingProfile.id;
    }
  }

  // Solo aseguramos que existe en la tabla profiles si hay un userId validado proporcionado desde el checkout autenticado.
  // Observación: si lo sacamos de la base de datos (arriba), el perfil ya existe, pero igual el upsert actualiza sus datos.
  if (resolvedUserId) {
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: resolvedUserId,
        email: email,
        full_name: fullName,
        role: "client",
      },
      { onConflict: "id" },
    );

    if (profileError) {
      console.error("Error updating/creating profile:", profileError);
      return {
        success: false,
        message: "Hubo un error al sincronizar el perfil.",
      };
    }
  }

  let finalCustomer = null;

  // 1. Buscar por email como identificador principal
  if (email && email.trim() !== "") {
    const { data: existingEmailCustomer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (existingEmailCustomer) {
      finalCustomer = existingEmailCustomer;
    }
  }

  // 2. Buscar por profile_id si hay usuario y no se encontró por email
  if (!finalCustomer && resolvedUserId) {
    const { data: existingProfileCustomer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("profile_id", resolvedUserId)
      .limit(1)
      .maybeSingle();

    if (existingProfileCustomer) {
      finalCustomer = existingProfileCustomer;
    }
  }

  // 3. Buscar por numero_documento para evitar duplicar
  if (!finalCustomer) {
    const { data: existingTaxCustomer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("numero_documento", numero_documento)
      .limit(1)
      .maybeSingle();

    if (existingTaxCustomer) {
      finalCustomer = existingTaxCustomer;
    }
  }

  // 3. Crear o Actualizar
  if (!finalCustomer) {
    const { data: newCustomer, error: customerError } = await supabaseAdmin
      .from("customers")
      .insert({
        profile_id: resolvedUserId,
        email: email,
        company_name: nombre_facturacion,
        tax_id: numero_documento,
        phone: telefono,
        address: address,
        tipo_documento: tipo_documento,
        numero_documento: numero_documento,
        nombre_facturacion: nombre_facturacion,
        telefono: telefono,
        province: province,
        city: city,
        country: "Ecuador",
        is_company: tipo_documento === "RUC",
      })
      .select()
      .single();

    if (customerError || !newCustomer) {
      console.error("Error creating customer:", customerError);
      return {
        success: false,
        message: `Error al crear cliente: ${customerError?.message || "Error desconocido"}`,
      };
    }

    finalCustomer = newCustomer;
  } else {
    // Si ya existe, actualizamos sus datos de facturación y dirección
    const { data: updatedCustomer, error: updateError } = await supabaseAdmin
      .from("customers")
      .update({
        email: email,
        nombre_facturacion: nombre_facturacion,
        tipo_documento: tipo_documento,
        numero_documento: numero_documento,
        telefono: telefono,
        province: province,
        city: city,
        address: address,
        company_name: nombre_facturacion,
        tax_id: numero_documento,
        phone: telefono,
      })
      .eq("id", finalCustomer.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating customer:", updateError);
      return {
        success: false,
        message: `Error al actualizar cliente: ${updateError?.message || "Error desconocido"}`,
      };
    }
    finalCustomer = updatedCustomer;
  }

  return { success: true, customer: finalCustomer };
}

export async function validateCoupon(code: string) {
  if (!code || code.trim() === "") {
    return { success: false, message: "Por favor ingresa un código de cupón." };
  }

  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.trim())
    .eq("is_active", true)
    .maybeSingle();

  if (error || !coupon) {
    return { success: false, message: "Cupón inválido o inactivo." };
  }

  // Verificar fecha de expiración
  if (coupon.valid_until) {
    const expirationDate = new Date(coupon.valid_until);
    if (expirationDate < new Date()) {
      return { success: false, message: "El cupón ha expirado." };
    }
  }

  return {
    success: true,
    message: `Cupón aplicado: -${coupon.discount_percent}%`,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discount_percent: coupon.discount_percent,
    },
  };
}

export async function processCheckout(
  cartItems: CartItem[],
  customerId: string,
  subtotal: number,
  totalAmount: number,
  couponId?: string,
  discountAmount: number = 0,
  orderType: "product" | "subscription" = "product",
  projectId?: string,
  metadata: any = {},
  manualPaymentMethod: string = "transferencia_bancaria",
  termsAccepted: boolean = false,
) {
   // El checkout permite invitados, por lo que no verificamos si el usuario esta autenticado
   // insertando directamente la orden vía Admin (para consistencia y evitar RLS)

   // 1. Insertar en tabla `orders`
   const { data: order, error: orderError } = await (supabaseAdmin as any)
     .from("orders")
     .insert({
       customer_id: customerId,
       coupon_id: couponId || null,
       subtotal: subtotal,
       total_amount: totalAmount,
       status: "pendiente_pago",
       discount_amount: discountAmount,
       payment_id: null, 
       order_type: orderType,
       project_id: projectId || null,
       metadata: metadata,
       metodo_pago_manual: manualPaymentMethod,
       terms_accepted: termsAccepted,
       terms_accepted_at: termsAccepted ? new Date().toISOString() : null,
     })
     .select()
     .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return {
      success: false,
      message: `Error al generar pedido: ${orderError?.message || "Error desconocido"}`,
    };
  }

  // 2. Insertar items del pedido (solo si es tipo producto)
  if (orderType === "product") {
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return {
        success: false,
        message: `Error al registrar los items del pedido: ${itemsError.message}`,
      };
    }
  }

  return {
    success: true,
    message: "Pedido generado.",
    orderId: order.id,
    reference: order.id,
    amount: totalAmount,
  };
}
