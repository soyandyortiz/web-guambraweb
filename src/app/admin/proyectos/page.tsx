export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { ProyectosTable } from "@/components/admin/proyectos/ProyectosTable";
import { FolderKanban, Plus, AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proyectos | Admin",
};

/* ─────────────────────────────────────────
   Tipos explícitos para el resultado del JOIN
   (evita que TypeScript infiera `never` en
   queries relacionales con el cliente genérico)
───────────────────────────────────────── */
type RawCustomer = { company_name: string | null } | null;

type RawProfile = { full_name: string | null } | null;

type RawAssignment = {
  profiles: RawProfile | RawProfile[];
};

type RawProject = {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  repo_url: string | null;
  created_at: string;
  customers: RawCustomer | RawCustomer[];
  project_assignments: RawAssignment[];
};

export default async function ProyectosPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("projects")
    .select(`
      id,
      name,
      description,
      status,
      start_date,
      end_date,
      repo_url,
      created_at,
      customers (
        company_name
      ),
      project_assignments (
        profiles (
          full_name
        )
      )
    `)
    .order("created_at", { ascending: false });

  const projects = (rawData ?? []) as RawProject[];

  /* ── Normalizar estructura de datos ── */
  const normalized = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    status: (p.status ?? "design") as "design" | "development" | "qa" | "live",
    start_date: p.start_date,
    end_date: p.end_date,
    repo_url: p.repo_url,
    created_at: p.created_at,
    company_name: Array.isArray(p.customers)
      ? (p.customers[0] as RawCustomer)?.company_name ?? "—"
      : (p.customers as RawCustomer)?.company_name ?? "—",
    developers: (p.project_assignments ?? [])
      .map((pa: RawAssignment) => {
        const prof = Array.isArray(pa.profiles)
          ? (pa.profiles[0] as RawProfile)
          : (pa.profiles as RawProfile);
        return prof?.full_name ?? null;
      })
      .filter((name): name is string => typeof name === "string"),
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "hsl(var(--secondary) / 0.15)",
              color: "hsl(var(--secondary))",
            }}
          >
            <FolderKanban size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Proyectos
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al cargar proyectos"
                : `${normalized.length} proyecto${normalized.length !== 1 ? "s" : ""} en total`}
            </p>
          </div>
        </div>

      </div>

      {/* ── Error de Supabase ── */}
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
          Error cargando proyectos: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tabla ── */}
      {!error && <ProyectosTable projects={normalized} />}
    </div>
  );
}
