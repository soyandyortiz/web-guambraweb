export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { AssetsTable, type ITAsset, type SimpleProject } from "@/components/admin/soporte/AssetsTable";
import { Server, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Assets | Soporte — GuambraWeb",
  description: "Mantenimiento técnico y gestión de dominios/hosting de proyectos.",
};

/* ─────────────────────────────────────────
   Tipos del JOIN
───────────────────────────────────────── */
type RawProject = { name: string } | null;

type RawAsset = {
  id: string;
  project_id: string | null;
  domain_name: string | null;
  hosting_provider: string | null;
  renewal_date: string | null;
  tech_stack: any;
  projects: RawProject | RawProject[];
};

export default async function SoporteAssetsPage() {
  const supabase = await createClient();

  /* 1. Fetch Assets + Join Projects */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAssets, error: assetError } = await (supabase as any)
    .from("assets_it")
    .select(`
      id,
      project_id,
      domain_name,
      hosting_provider,
      renewal_date,
      tech_stack,
      projects (
        name
      )
    `)
    .order("renewal_date", { ascending: true });

  /* 2. Fetch Projects (para el dropdown de registro) */
  const { data: projectData, error: projError } = await supabase
    .from("projects")
    .select("id, name")
    .order("name");

  /* ── Normalizar Activos ── */
  const assets: ITAsset[] = ((rawAssets ?? []) as RawAsset[]).map((a) => {
    const proj = Array.isArray(a.projects)
      ? (a.projects[0] as RawProject)
      : (a.projects as RawProject);

    return {
      id: a.id,
      project_id: a.project_id,
      domain_name: a.domain_name,
      hosting_provider: a.hosting_provider,
      renewal_date: a.renewal_date,
      tech_stack: a.tech_stack,
      project_name: proj?.name ?? "Proyecto desconocido",
    };
  });

  const projects: SimpleProject[] = (projectData ?? []) as SimpleProject[];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "hsl(var(--success) / 0.12)",
            color: "hsl(var(--success))",
          }}
        >
          <Server size={20} />
        </div>
        <div>
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Activos IT
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {assetError
              ? "Error al cargar activos"
              : `${assets.length} activo${assets.length !== 1 ? "s" : ""} técnicos registrados en el sistema.`}
          </p>
        </div>
      </div>

      {/* ── Errores ── */}
      {(assetError || projError) && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "hsl(var(--destructive) / 0.1)",
            border: "1px solid hsl(var(--destructive) / 0.3)",
            color: "hsl(var(--destructive))",
          }}
        >
          <AlertCircle size={16} />
          Error cargando datos: {(assetError || projError)?.message}
        </div>
      )}

      {/* ── Tabla e Interface ── */}
      {!assetError && !projError && <AssetsTable initialAssets={assets} projects={projects} />}
    </div>
  );
}
