import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * Activa una suscripción basándose en una orden pagada.
 * Crea el proyecto si no existe y registra la suscripción.
 */
export async function activateSubscriptionFromOrder(orderId: string, paymentId?: string) {
  // 1. Obtener la orden con detalles
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*, customers(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Orden no encontrada: ${orderError?.message}`);
  }

  const isProduct = order.order_type === "product";
  const isSubscription = order.order_type === "subscription";

  if (!isProduct && !isSubscription) {
    return { success: true, message: "Tipo de orden no procesable para suscripción." };
  }

  const customerId = order.customer_id;
  let projectId = order.project_id;
  const metadata = (order as any).metadata;
  const customer = (order as any).customers as any;
  
  const customerName = customer?.company_name || customer?.nombre_facturacion || "Cliente";
  
  // 🎯 Lógica interna para tu sistema
  // Producto → incluye 6 meses gratis
  // Plan → se activa cuando termina el período gratuito
  // Sin plan → sistema sin supervisión
  
  let planName = metadata?.plan_name || (isProduct ? "Cortesía (6 Meses Gratuito)" : "Plan de Suscripción");
  let monthlyFee = metadata?.monthly_fee || 0;
  let intervalMonths = metadata?.interval_months || (isProduct ? 6 : 1);

  const now = new Date();
  
  // 2. Vincular o crear proyecto
  if (!projectId && customerId) {
    const { data: existingProjects } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (existingProjects && existingProjects.length > 0) {
      projectId = existingProjects[0].id;
    } else {
      const { data: newProject, error: projErr } = await supabaseAdmin
        .from("projects")
        .insert({
          name: isProduct ? `Proyecto - ${customerName}` : `${planName} - ${customerName}`,
          customer_id: customerId,
          status: "live" as any, 
          start_date: now.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (projErr) throw projErr;
      if (newProject) projectId = newProject.id;
    }
    
    // Vincular orden al proyecto
    await supabaseAdmin.from("orders").update({ project_id: projectId }).eq("id", order.id);
  }

  if (customerId && projectId) {
    // 3. Obtener suscripción actual para calcular fechas
    const { data: currentSub } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("customer_id", customerId)
      .eq("project_id", projectId)
      .maybeSingle();

    let startDate = now;
    let nextBillingDate = new Date(now);

    // Caso A: Compra de Producto (Damos 6 meses gratis independientemente de lo que haya)
    if (isProduct) {
      // Si ya tiene algo, simplemente extendemos 6 meses desde el final actual o desde hoy
      const baseDate = (currentSub?.next_billing_date && new Date(currentSub.next_billing_date) > now) 
        ? new Date(currentSub.next_billing_date) 
        : now;
      
      nextBillingDate = new Date(baseDate);
      nextBillingDate.setMonth(baseDate.getMonth() + 6);
      
      // Mantener nombre si ya es un plan pagado, si no, poner el de cortesía
      if (!currentSub || currentSub.status === 'gratis' || currentSub.status === 'expired') {
        planName = "Cortesía (6 Meses Gratuito)";
      } else {
        planName = currentSub.plan_name; // Mantenemos el nombre del plan actual pero extendemos el tiempo
      }
    } 
    // Caso B: Compra de Plan (Se activa cuando termina el periodo gratuito o actual)
    else {
      const baseDate = (currentSub?.next_billing_date && new Date(currentSub.next_billing_date) > now)
        ? new Date(currentSub.next_billing_date)
        : now;
      
      nextBillingDate = new Date(baseDate);
      nextBillingDate.setMonth(baseDate.getMonth() + intervalMonths);
    }

    const billingCycle = intervalMonths >= 12 ? "yearly" : "monthly";

    const { error: subError } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          customer_id: customerId,
          project_id: projectId,
          plan_name: planName,
          monthly_fee: monthlyFee,
          status: isProduct && (!currentSub || currentSub.status === 'gratis') ? "gratis" : "active",
          is_active: true,
          billing_cycle: billingCycle as any,
          current_period_start: now.toISOString(),
          current_period_end: nextBillingDate.toISOString(),
          next_billing_date: nextBillingDate.toISOString().split("T")[0],
          is_auto_renew: !isProduct,
          last_payment_id: paymentId || order.payment_id,
          updated_at: now.toISOString(),
        },
        { onConflict: "customer_id,project_id" }
      );

    if (subError) throw subError;

    // Asegurar que el proyecto no esté en 'unsupervised' si se acaba de activar algo
    await supabaseAdmin
      .from("projects")
      .update({ status: 'live' as any })
      .eq("id", projectId)
      .eq("status", 'unsupervised' as any);
  }

  return { success: true };
}
