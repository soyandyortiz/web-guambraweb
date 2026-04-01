import { createClient } from "@/lib/supabase/server";
import { ProformaEmitter } from "@/components/admin/proformas/ProformaEmitter";
import { Customer, Product } from "@/types/database";

export default async function NuevaProformaPage() {
  const supabase = await createClient();

  // Fetch customers and products for the selection
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("nombre_facturacion", { ascending: true });

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold">Emitir Nueva Proforma</h1>
        <p className="text-sm text-muted-foreground">
          Genera documentos profesionales para tus clientes en segundos.
        </p>
      </div>

      <ProformaEmitter 
        initialCustomers={(customers as Customer[]) || []} 
        initialProducts={(products as Product[]) || []} 
      />
    </div>
  );
}
