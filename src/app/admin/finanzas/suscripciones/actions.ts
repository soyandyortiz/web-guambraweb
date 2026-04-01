"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function updateSubscription(
  id: string,
  data: {
    plan_name?: string;
    monthly_fee?: number;
    is_active?: boolean;
    next_billing_date?: string;
  }
) {
  try {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update(data)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/finanzas/suscripciones");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return { success: false, message: error.message };
  }
}
