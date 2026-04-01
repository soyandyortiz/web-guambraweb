export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import {
  TicketsTable,
  type TicketRow,
  type TicketStatus,
} from "@/components/admin/tickets/TicketsTable";
import { Headphones, AlertCircle, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tickets | Soporte — GuambraWeb",
  description: "Gestiona los tickets de soporte de tus clientes.",
};

/* ─────────────────────────────────────────
   Tipos del JOIN
───────────────────────────────────────── */
type RawProject  = { name: string } | null;
type RawCustomer = { company_name: string | null } | null;

type RawTicket = {
  id: string;
  project_id: string | null;
  customer_id: string | null;
  subject: string;
  description: string;
  status: string | null;
  created_at: string;
  projects: RawProject | RawProject[];
  customers: RawCustomer | RawCustomer[];
};

const VALID_STATUSES: TicketStatus[] = ["open", "in_progress", "resolved"];

function sanitizeStatus(raw: string | null): TicketStatus | null {
  if (raw && (VALID_STATUSES as string[]).includes(raw)) return raw as TicketStatus;
  return null;
}

export default async function SoporteTicketsPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("tickets")
    .select(`
      id,
      project_id,
      customer_id,
      subject,
      description,
      status,
      created_at,
      projects (
        name
      ),
      customers (
        company_name
      )
    `)
    .order("created_at", { ascending: false });

  /* ── Normalizar ── */
  const tickets: TicketRow[] = ((rawData ?? []) as RawTicket[]).map((t) => {
    const proj = Array.isArray(t.projects)
      ? (t.projects[0] as RawProject)
      : (t.projects as RawProject);
    const cust = Array.isArray(t.customers)
      ? (t.customers[0] as RawCustomer)
      : (t.customers as RawCustomer);

    return {
      id: t.id,
      subject: t.subject,
      description: t.description,
      status: sanitizeStatus(t.status),
      project_id: t.project_id,
      customer_id: t.customer_id,
      project_name: proj?.name ?? "Sin proyecto",
      company_name: cust?.company_name ?? "Cliente desconocido",
      created_at: t.created_at,
    };
  });

  /* ── Conteos ── */
  const countOpen       = tickets.filter((t) => t.status === "open").length;
  const countInProgress = tickets.filter((t) => t.status === "in_progress").length;
  const countResolved   = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "hsl(var(--destructive) / 0.12)",
              color: "hsl(var(--destructive))",
            }}
          >
            <Headphones size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Tickets de Soporte
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al cargar tickets"
                : `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} · 🔴 ${countOpen} abierto${countOpen !== 1 ? "s" : ""} · 🟡 ${countInProgress} en progreso · 🟢 ${countResolved} resuelto${countResolved !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <Link
          href="/admin/soporte/tickets/nuevo"
          className="btn-primary btn-sm self-start sm:self-auto bg-destructive hover:bg-destructive/90"
          style={{ background: "hsl(var(--destructive))", borderColor: "hsl(var(--destructive))" }}
        >
          <Plus size={15} />
          Nuevo Ticket
        </Link>
      </div>

      {/* ── Error Supabase ── */}
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
          Error cargando tickets: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tabla ── */}
      {!error && <TicketsTable initialTickets={tickets} />}
    </div>
  );
}
