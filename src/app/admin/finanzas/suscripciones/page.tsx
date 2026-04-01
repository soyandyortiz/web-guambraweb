export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import {
  SuscripcionesTable,
  type SuscripcionRow,
} from "@/components/admin/suscripciones/SuscripcionesTable";
import { CreditCard, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suscripciones | Finanzas — GuambraWeb",
  description: "Gestiona los planes de mantenimiento mensual de tus clientes.",
};

/* ─────────────────────────────────────────
   Tipos del JOIN
───────────────────────────────────────── */
type RawCustomer = { company_name: string | null } | null;
type RawProject = { name: string | null } | null;

type RawSub = {
  id: string;
  customer_id: string | null;
  project_id: string | null;
  plan_name: string;
  monthly_fee: number;
  next_billing_date: string;
  is_active: boolean | null;
  status: string | null;
  customers: RawCustomer | RawCustomer[];
  projects: RawProject | RawProject[];
};

export default async function FinanzasSuscripcionesPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("subscriptions")
    .select(
      `
      id,
      customer_id,
      project_id,
      plan_name,
      monthly_fee,
      next_billing_date,
      is_active,
      status,
      customers (
        company_name
      ),
      projects (
        name
      )
    `,
    )
    .order("is_active", { ascending: false })
    .order("next_billing_date", { ascending: true });

  /* ── Normalizar ── */
  const subs: SuscripcionRow[] = ((rawData ?? []) as RawSub[]).map((s) => {
    const cust = Array.isArray(s.customers)
      ? (s.customers[0] as RawCustomer)
      : (s.customers as RawCustomer);
    const proj = Array.isArray(s.projects)
      ? (s.projects[0] as RawProject)
      : (s.projects as RawProject);

    return {
      id: s.id,
      customer_id: s.customer_id,
      project_id: s.project_id,
      plan_name: s.plan_name,
      monthly_fee: s.monthly_fee,
      next_billing_date: s.next_billing_date,
      is_active: s.is_active,
      status: s.status,
      company_name: cust?.company_name ?? "Cliente desconocido",
      project_name: proj?.name ?? "Sin proyecto",
    };
  });

  /* ── Métricas para encabezado ── */
  const active = subs.filter((s) => s.is_active === true);
  const mrr = active.reduce((sum, s) => sum + s.monthly_fee, 0);

  function formatCurrency(n: number) {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "hsl(var(--warning) / 0.12)",
            color: "hsl(var(--warning))",
          }}
        >
          <CreditCard size={20} />
        </div>
        <div>
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Suscripciones
          </h2>
          <p
            className="text-sm"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {error
              ? "Error al cargar suscripciones"
              : `${subs.length} suscripción${subs.length !== 1 ? "es" : ""} · ${active.length} activa${active.length !== 1 ? "s" : ""} · MRR ${formatCurrency(mrr)}`}
          </p>
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
          Error cargando suscripciones: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tabla ── */}
      {!error && <SuscripcionesTable initialSubs={subs} />}
    </div>
  );
}
