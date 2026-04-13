export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createClient } from "@/lib/supabase/server";
import { PortafolioTable } from "@/components/admin/portafolio/PortafolioTable";
import { Layers, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portafolio | Admin — GuambraWeb",
  description: "Gestiona los proyectos del portafolio público.",
};

export default async function AdminPortafolioPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "hsl(var(--primary) / 0.15)",
              color: "hsl(var(--primary))",
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Portafolio
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al cargar"
                : `${projects?.length ?? 0} proyecto${(projects?.length ?? 0) !== 1 ? "s" : ""} — ${projects?.filter((p) => p.is_published).length ?? 0} publicados`}
            </p>
          </div>
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
          Error cargando proyectos: {error.message}
        </div>
      )}

      {/* ── Tabla ── */}
      {!error && (
        <PortafolioTable initialProjects={(projects as any) ?? []} />
      )}
    </div>
  );
}
