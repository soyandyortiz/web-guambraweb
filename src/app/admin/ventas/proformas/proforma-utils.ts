"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCustomers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("*")
    .order("nombre_facturacion", { ascending: true });
  return data || [];
}

export async function getProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return data || [];
}
