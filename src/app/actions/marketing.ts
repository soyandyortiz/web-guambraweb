"use server";

import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

// Creamos un cliente de Supabase (aquí usamos el estandard, pero para marketing leads
// que es una tabla pública para inserción, sirve bien)
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveMarketingLead(formData: {
  name: string;
  email: string;
  whatsapp: string;
}) {
  try {
    const { error } = await supabaseAdmin
      .from("marketing_leads" as any)
      .insert([formData]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error saving marketing lead:", error);
    return { success: false, message: error.message };
  }
}

export async function getMarketingLeads() {
  try {
    const { data, error } = await supabaseAdmin
      .from("marketing_leads" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching marketing leads:", error);
    return { success: false, message: error.message };
  }
}
