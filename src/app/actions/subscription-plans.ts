"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getSubscriptionPlans() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActivePlans() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPlanById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function saveSubscriptionPlan(plan: any) {
  const supabase = createAdminClient();
  const { id, ...planData } = plan;

  if (id) {
    const { error } = await supabase
      .from("subscription_plans")
      .update(planData)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("subscription_plans")
      .insert([planData]);
    if (error) throw error;
  }

  revalidatePath("/admin/finanzas/planes");
}

export async function deleteSubscriptionPlan(id: string) {
  const supabase = createAdminClient();

  // Verificar si hay suscripciones activas vinculadas
  // Nota: Esto depende de si tenemos una relación directa o por nombre.
  // En el webhook usamos upsert con plan_name, pero las suscripciones deberían estar vinculadas a planes idealmente.
  // Por ahora, verificamos en la tabla suscripciones si existe algun registro con ese plan_name (suponiendo que name es unico).
  
  const { data: plan } = await supabase.from("subscription_plans").select("name").eq("id", id).single();
  
  if (plan) {
    const { count, error: checkError } = await supabase
      .from("subscriptions")
      .select("*", { count: 'exact', head: true })
      .eq("plan_name", plan.name);
      
    if (checkError) throw checkError;
    
    if (count && count > 0) {
      throw new Error("No se puede eliminar el plan porque tiene suscripciones asociadas.");
    }
  }

  const { error } = await supabase
    .from("subscription_plans")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/finanzas/planes");
}

export async function togglePlanStatus(id: string, currentStatus: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscription_plans")
    .update({ is_active: !currentStatus })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/finanzas/planes");
}
