"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function checkProjectAccess(projectId: string) {
  const supabase = createAdminClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) {
    console.error("Error al consultar la suscripción:", error);
    // En caso de error de DB, permitimos acceso por defecto (o podrías bloquearlo según política)
    return { status: "active", allowAccess: true, isLimited: false };
  }

  // Si no hay suscripción, asumimos acceso normal por ahora (o podrías manejarlo como 'pending')
  if (!subscription) {
    return { status: "active", allowAccess: true, isLimited: false };
  }

  switch (subscription.status) {
    case "active":
      return { status: "active", allowAccess: true, isLimited: false };
    case "past_due":
      return { status: "past_due", allowAccess: true, isLimited: true };
    case "cancelled":
      return { status: "cancelled", allowAccess: false, isLimited: false };
    default:
      return { status: subscription.status, allowAccess: false, isLimited: false };
  }
}
