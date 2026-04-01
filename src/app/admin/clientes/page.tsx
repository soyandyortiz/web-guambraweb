export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { ClientesTable } from "@/components/admin/clientes/ClientesTable";
import { Users, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes (CRM) — GuambraWeb",
  description: "Gestión de clientes, empresas e identidades fiscales.",
};

export default async function ClientesPage() {
  const supabase = await createClient();

  // 1. Cargar Clientes con sus perfiles vinculados
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: customers, error: customersError } = await (supabase as any)
    .from("customers")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  // 2. Cargar Perfiles con rol 'client' para vinculación
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles, error: profilesError } = await (supabase as any)
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "client")
    .order("full_name");

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "hsl(var(--primary) / 0.15)",
            color: "hsl(var(--primary))",
          }}
        >
          <Users size={20} />
        </div>
        <div>
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Gestión de Clientes
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {customersError || profilesError
              ? "Error al conectar con la base de datos"
              : `CRM: ${customers?.length || 0} cliente${customers?.length !== 1 ? "s" : ""} registrados`}
          </p>
        </div>
      </div>

      {/* ── Errores ── */}
      {(customersError || profilesError) && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "hsl(var(--destructive) / 0.1)",
            border: "1px solid hsl(var(--destructive) / 0.3)",
            color: "hsl(var(--destructive))",
          }}
        >
          <AlertCircle size={16} />
          Error cargando datos: {customersError?.message || profilesError?.message}
        </div>
      )}

      {/* ── Tabla Principal ── */}
      {!customersError && (
        <ClientesTable 
          initialCustomers={customers || []} 
          availableProfiles={profiles || []}
        />
      )}
    </div>
  );
}
