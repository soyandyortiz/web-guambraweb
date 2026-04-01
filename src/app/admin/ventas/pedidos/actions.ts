"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { activateSubscriptionFromOrder } from "@/lib/subscription-service";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function confirmOrderPayment(orderId: string) {
  try {
    // 1. Marcar como pagado
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId);

    if (updateError) throw updateError;

    // 2. Activar suscripción si corresponde
    await activateSubscriptionFromOrder(orderId);

    revalidatePath("/admin/ventas/pedidos");
    revalidatePath("/admin/finanzas/suscripciones");
    revalidatePath("/admin/produccion/proyectos");

    return { success: true };
  } catch (error: any) {
    console.error("Error confirmando pago:", error);
    return { success: false, message: error.message };
  }
}

export async function discardOrder(orderId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/ventas/pedidos");
    return { success: true };
  } catch (error: any) {
    console.error("Error descartando pedido:", error);
    return { success: false, message: error.message };
  }
}
