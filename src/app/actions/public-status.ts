"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getSubscriptionStatus(identifier: string) {
  const supabase = createAdminClient();
  const cleanId = identifier.trim();

  // 1. Buscar por ID de Pedido (UUID), Cédula/RUC o Email
  // Primero intentamos buscar al cliente por identificación o email
  const { data: customer, error: customerError } = await (supabase as any)
    .from("customers")
    .select("id, company_name, email, numero_documento")
    .or(`numero_documento.eq.${cleanId},email.eq.${cleanId}`)
    .maybeSingle();

  let customerId = customer?.id;
  let orderReference = null;

  // Si no se encontró por cliente, intentamos por Referencia de Pedido (ID de la orden)
  if (!customerId) {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("customer_id, id")
      .eq("id", cleanId)
      .maybeSingle();
    
    if (order) {
      customerId = order.customer_id;
      orderReference = order.id;
    }
  }

  if (!customerId) {
    return { 
      success: false, 
      message: "No encontramos ninguna suscripción vinculada a esa identificación, correo o número de pedido." 
    };
  }

  // 2. Obtener las suscripciones del cliente encontrado
  const { data: subscriptions, error: subError } = await supabase
    .from("subscriptions")
    .select(`
      *,
      projects (
        name,
        status,
        repo_url
      )
    `)
    .eq("customer_id", customerId)
    .order('updated_at', { ascending: false });

  if (subError || !subscriptions || subscriptions.length === 0) {
    return { 
      success: false, 
      message: "El cliente existe, pero no tiene suscripciones activas o previas registradas." 
    };
  }

  return {
    success: true,
    customer: {
      name: customer?.company_name || "Cliente",
      email: customer?.email
    },
    subscriptions: subscriptions.map(sub => ({
      id: sub.id,
      plan_name: sub.plan_name,
      status: sub.status,
      is_active: sub.is_active,
      next_billing_date: sub.next_billing_date,
      monthly_fee: sub.monthly_fee,
      billing_cycle: sub.billing_cycle,
      project_name: (sub.projects as any)?.name,
      project_status: (sub.projects as any)?.status
    }))
  };
}
