export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { EquipoTable } from "@/components/admin/equipo/EquipoTable";
import { Users2, AlertCircle, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipo Móvil y Web — GuambraWeb",
  description: "Gestión de desarrolladores, roles y asignaciones activas.",
};

export default async function EquipoPage() {
  const supabase = await createClient();

  // 1. Cargar perfiles 'dev' y contar sus asignaciones
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      created_at,
      role,
      project_assignments ( count )
    `)
    .in("role", ["dev", "admin"])
    .order("created_at", { ascending: false });

  console.log('Datos cargados (Servidor):', data);

  // Normalizar los datos para que project_count sea un número plano
  const normalizedDevs = (data || []).map((dev: any) => ({
    ...dev,
    project_count: dev.project_assignments?.[0]?.count || 0
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "hsl(var(--success) / 0.15)",
              color: "hsl(var(--success))",
            }}
          >
            <Users2 size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Equipo de Desarrollo
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al conectar con el equipo"
                : `${normalizedDevs.length} desarrollador${normalizedDevs.length !== 1 ? "es" : ""} activos`}
            </p>
          </div>
        </div>

        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs bg-muted/30"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Info size={14} className="text-primary" />
          <span className="text-muted-foreground">
            Los roles se gestionan vía <strong>Supabase Auth</strong>
          </span>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "hsl(var(--destructive) / 0.1)",
            border: "1px solid hsl(var(--destructive) / 0.3)",
            color: "hsl(var(--destructive))",
          }}
        >
          <AlertCircle size={16} />
          Error cargando el equipo: {error.message}
        </div>
      )}

      {/* ── Listado / Grid ── */}
      {!error && <EquipoTable devs={normalizedDevs} />}
    </div>
  );
}
