"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTicket(id: string, data: {
  subject?: string;
  description?: string;
  status?: "open" | "in_progress" | "resolved" | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tickets")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating ticket:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/soporte/tickets");
  return { success: true };
}

export async function deleteTicket(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting ticket:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/soporte/tickets");
  return { success: true };
}
