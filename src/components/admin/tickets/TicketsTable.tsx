"use client";

import { useState, useTransition, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateAdmin } from "@/app/actions/admin";
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  Headphones,
  Building2,
  FolderKanban,
  Calendar,
  Circle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Clock,
  MessageSquare,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-react";
import { updateTicket, deleteTicket } from "@/app/actions/tickets";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type TicketStatus = "open" | "in_progress" | "resolved";

export type TicketRow = {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus | null;
  project_id: string | null;
  customer_id: string | null;
  project_name: string;        // denormalizado desde projects
  company_name: string;        // denormalizado desde customers
  created_at: string;
};

/* ─────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────── */
const STATUS_CFG: Record<
  TicketStatus,
  {
    label: string; bg: string; color: string; border: string;
    icon: React.ReactNode; selectLabel: string;
  }
> = {
  open: {
    label: "Abierto",
    bg: "hsl(var(--destructive) / 0.1)",
    color: "hsl(var(--destructive))",
    border: "hsl(var(--destructive) / 0.3)",
    icon: <Circle size={12} style={{ fill: "hsl(var(--destructive))" }} />,
    selectLabel: "🔴 Abierto",
  },
  in_progress: {
    label: "En Progreso",
    bg: "hsl(var(--warning) / 0.1)",
    color: "hsl(var(--warning))",
    border: "hsl(var(--warning) / 0.3)",
    icon: <Clock size={12} />,
    selectLabel: "🟡 En Progreso",
  },
  resolved: {
    label: "Resuelto",
    bg: "hsl(var(--success) / 0.1)",
    color: "hsl(var(--success))",
    border: "hsl(var(--success) / 0.3)",
    icon: <CheckCircle2 size={12} />,
    selectLabel: "🟢 Resuelto",
  },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (mins > 0)  return `hace ${mins}m`;
  return "ahora";
}

type SortDir = "asc" | "desc" | null;
type SortKey = "subject" | "company_name" | "project_name" | "status" | "created_at";

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   BADGE DE ESTADO
───────────────────────────────────────── */
function StatusBadge({ status }: { status: TicketStatus | null }) {
  if (!status || !STATUS_CFG[status]) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
        <Circle size={8} /> Sin estado
      </span>
    );
  }
  const cfg = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────
   SELECTOR DE ESTADO (inline — optimistic)
───────────────────────────────────────── */
function StatusSelect({
  ticketId,
  current,
  onChanged,
}: {
  ticketId: string;
  current: TicketStatus | null;
  onChanged: (id: string, newStatus: TicketStatus) => void;
}) {
  const [value, setValue] = useState<TicketStatus | null>(current);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as TicketStatus;
    const prev = value;
    setValue(next);      // optimistic
    setError(null);

    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (createClient() as any)
        .from("tickets")
        .update({ status: next })
        .eq("id", ticketId);

      if (err) {
        setValue(prev);  // revert
        setError(err.message);
      } else {
        await revalidateAdmin();
        onChanged(ticketId, next);
      }
    });
  };

  const cfg = value ? STATUS_CFG[value] : null;

  return (
    <div>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={handleChange}
          disabled={isPending}
          style={{
            appearance: "none",
            padding: "0.5rem 2.25rem 0.5rem 0.875rem",
            borderRadius: "var(--radius)",
            border: `1.5px solid ${cfg?.border ?? "hsl(var(--border))"}`,
            background: cfg?.bg ?? "hsl(var(--input))",
            color: cfg?.color ?? "hsl(var(--muted-foreground))",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            outline: "none",
            width: "100%",
            transition: "border-color 0.15s, background 0.15s, color 0.15s",
          }}
        >
          {(Object.keys(STATUS_CFG) as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_CFG[s].selectLabel}</option>
          ))}
        </select>
        <div
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: cfg?.color ?? "hsl(var(--muted-foreground))" }}
        >
          {isPending
            ? <Loader2 size={14} className="animate-spin" />
            : <ChevronDown size={14} />
          }
        </div>
      </div>
      {error && (
        <p className="text-xs mt-1" style={{ color: "hsl(var(--destructive))" }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL DETALLE DEL TICKET
───────────────────────────────────────── */
function TicketDetailModal({
  ticket,
  onClose,
  onStatusChanged,
  onUpdate,
}: {
  ticket: TicketRow;
  onClose: () => void;
  onStatusChanged: (id: string, newStatus: TicketStatus) => void;
  onUpdate: (id: string, data: { subject: string; description: string }) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ subject: ticket.subject, description: ticket.description });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateTicket(ticket.id, formData);
      if (res.success) {
        onUpdate(ticket.id, formData);
        setIsEditing(false);
      } else {
        alert("Error al actualizar ticket: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const cfg = ticket.status ? STATUS_CFG[ticket.status] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card animate-scale-in w-full max-w-2xl"
        style={{ maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          className="flex items-start gap-4 px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: cfg?.bg ?? "hsl(var(--muted))",
              color: cfg?.color ?? "hsl(var(--muted-foreground))",
            }}
          >
            <MessageSquare size={18} />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input 
                className="input w-full font-display font-bold text-lg" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            ) : (
              <h3
                className="font-display font-bold text-lg leading-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {ticket.subject}
              </h3>
            )}
            <div
              className="flex flex-wrap items-center gap-3 mt-1.5 text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <span className="flex items-center gap-1">
                <Building2 size={11} /> {ticket.company_name}
              </span>
              <span className="flex items-center gap-1">
                <FolderKanban size={11} /> {ticket.project_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {formatDate(ticket.created_at)}
              </span>
              <span style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}>
                ({timeAgo(ticket.created_at)})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg flex-shrink-0"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Descripción del ticket */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Descripción del problema
            </h4>
            {isEditing ? (
              <textarea 
                className="input w-full text-sm min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            ) : (
              <div
                className="px-4 py-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  background: "hsl(var(--muted) / 0.5)",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  minHeight: "80px",
                }}
              >
                {ticket.description || (
                  <span style={{ color: "hsl(var(--muted-foreground))", fontStyle: "italic" }}>
                    Sin descripción.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Info del ticket en grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Cliente",  value: ticket.company_name,  icon: <Building2 size={13} /> },
              { label: "Proyecto", value: ticket.project_name,  icon: <FolderKanban size={13} /> },
              { label: "Creado",   value: timeAgo(ticket.created_at), icon: <Calendar size={13} /> },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="px-3 py-2.5 rounded-xl"
                style={{
                  background: "hsl(var(--muted) / 0.4)",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-xs mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {icon}
                  {label}
                </div>
                <div className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Cambio de estado */}
          <div
            className="p-4 rounded-xl space-y-3"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="flex items-center justify-between">
              <h4
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Cambiar estado del ticket
              </h4>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              El cambio se sincroniza con Supabase en tiempo real.
            </p>
            <StatusSelect
              ticketId={ticket.id}
              current={ticket.status}
              onChanged={onStatusChanged}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <code
            className="text-xs font-mono px-2 py-1 rounded"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
          >
            #{ticket.id.slice(0, 8).toUpperCase()}
          </code>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="btn-secondary btn-sm" disabled={isSaving}>
                  Cancelar
                </button>
                <button 
                  onClick={handleSave} 
                  className="btn-primary btn-sm" 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Guardar"}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="btn-secondary btn-sm gap-1.5 text-primary">
                  <Edit2 size={13} />
                  Editar
                </button>
                <button onClick={onClose} className="btn-secondary btn-sm">
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ESTADO VACÍO
───────────────────────────────────────── */
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "hsl(var(--muted))" }}
      >
        {filtered
          ? <Filter size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
          : <Headphones size={28} style={{ color: "hsl(var(--muted-foreground))" }} />}
      </div>
      <h3 className="font-display font-semibold text-lg mb-1" style={{ color: "hsl(var(--foreground))" }}>
        {filtered ? "Sin resultados" : "No hay tickets"}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros."
          : "Los tickets de soporte de tus clientes aparecerán aquí."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
type Props = { initialTickets: TicketRow[] };

export function TicketsTable({ initialTickets }: Props) {
  const [tickets, setTickets] = useState<TicketRow[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTicket, setActiveTicket] = useState<TicketRow | null>(null);

  /* ── Status change callback (del modal o de StatusSelect inline) ── */
  const handleStatusChanged = useCallback((id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    // Si el ticket abierto en el modal es el mismo, actualizarlo también
    setActiveTicket((prev) =>
      prev?.id === id ? { ...prev, status: newStatus } : prev
    );
  }, []);

  /* ── Update logic (from modal) ── */
  const handleUpdateTicket = useCallback((id: string, data: { subject: string; description: string }) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    setActiveTicket((prev) =>
      prev?.id === id ? { ...prev, ...data } : prev
    );
  }, []);

  const handleDeleteTicket = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar abrir el modal
    if (!confirm("¿Seguro que deseas eliminar este ticket?")) return;
    
    try {
      const res = await deleteTicket(id);
      if (res.success) {
        setTickets(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Error al eliminar ticket: " + res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar ticket.");
    }
  };

  /* ── Filtrar ── */
  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.subject.toLowerCase().includes(q) ||
      t.company_name.toLowerCase().includes(q) ||
      t.project_name.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" ? true : t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ── Ordenar ── */
  const sorted = [...filtered].sort((a, b) => {
    const av = String(a[sortKey] ?? "");
    const bv = String(b[sortKey] ?? "");
    const cmp = av.localeCompare(bv);
    return sortDir === "asc" ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function getSortDir(key: SortKey): SortDir {
    return sortKey !== key ? null : sortDir;
  }

  /* ── Pills ── */
  const count = (s: TicketStatus) => tickets.filter((t) => t.status === s).length;
  const PILLS = [
    { key: "all" as const,         label: "Todos",       value: tickets.length, color: "var(--primary)" },
    { key: "open" as const,        label: "Abiertos",    value: count("open"),        color: "var(--destructive)" },
    { key: "in_progress" as const, label: "En Progreso", value: count("in_progress"), color: "var(--warning)" },
    { key: "resolved" as const,    label: "Resueltos",   value: count("resolved"),    color: "var(--success)" },
  ];

  return (
    <>
      {/* Modal de detalle */}
      {activeTicket && (
        <TicketDetailModal
          ticket={activeTicket}
          onClose={() => setActiveTicket(null)}
          onStatusChanged={handleStatusChanged}
          onUpdate={handleUpdateTicket}
        />
      )}

      <div className="space-y-4">
        {/* ── Pills de estado ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PILLS.map(({ key, label, value, color }) => {
            const active = statusFilter === key;
            const cssVar = color.replace("var(", "").replace(")", "");
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(active && key !== "all" ? "all" : key)}
                className="text-left p-3 rounded-xl border transition-all duration-150"
                style={{
                  background: active ? `hsl(${cssVar} / 0.12)` : "hsl(var(--card))",
                  borderColor: active ? `hsl(${cssVar} / 0.4)` : "hsl(var(--border))",
                }}
              >
                <div className="text-2xl font-display font-bold" style={{ color: `hsl(${cssVar})` }}>
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Buscador ── */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "hsl(var(--input))", border: "1px solid hsl(var(--border))" }}
        >
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Buscar por asunto, cliente o proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 min-w-0"
            style={{ color: "hsl(var(--foreground))" }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          )}
        </div>

        {/* ── Tabla ── */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
          {sorted.length === 0 ? (
            <EmptyState filtered={search !== "" || statusFilter !== "all"} />
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                {/* THEAD */}
                <thead>
                  <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
                    {[
                      { key: "subject" as SortKey,      label: "Asunto" },
                      { key: "project_name" as SortKey, label: "Proyecto" },
                      { key: "company_name" as SortKey, label: "Cliente" },
                      { key: "status" as SortKey,       label: "Estado" },
                      { key: "created_at" as SortKey,   label: "Creado" },
                      { key: null,                      label: "Acciones" },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        onClick={key ? () => toggleSort(key) : undefined}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          fontWeight: 600,
                          color: "hsl(var(--muted-foreground))",
                          cursor: key ? "pointer" : "default",
                          whiteSpace: "nowrap",
                          userSelect: "none",
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          {label}
                          {key && <SortIcon dir={getSortDir(key)} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* TBODY */}
                <tbody>
                  {sorted.map((ticket, idx) => {
                    const cfg = ticket.status ? STATUS_CFG[ticket.status] : null;
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        style={{
                          borderBottom: idx < sorted.length - 1 ? "1px solid hsl(var(--border) / 0.5)" : "none",
                          cursor: "pointer",
                          transition: "background 0.12s",
                          /* Línea de color izquierda según estado */
                          borderLeft: `3px solid ${cfg?.color ?? "transparent"}`,
                          opacity: ticket.status === "resolved" ? 0.75 : 1,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = "hsl(var(--muted) / 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                        }}
                      >
                        {/* Asunto */}
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                background: cfg?.bg ?? "hsl(var(--muted))",
                                color: cfg?.color ?? "hsl(var(--muted-foreground))",
                              }}
                            >
                              <MessageSquare size={13} />
                            </div>
                            <span
                              className="font-medium"
                              style={{
                                color: "hsl(var(--foreground))",
                                textDecoration: ticket.status === "resolved" ? "line-through" : "none",
                              }}
                            >
                              {ticket.subject}
                            </span>
                          </div>
                        </td>

                        {/* Proyecto */}
                        <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                          <div className="flex items-center gap-1.5 text-sm"
                            style={{ color: "hsl(var(--secondary))" }}>
                            <FolderKanban size={13} />
                            {ticket.project_name}
                          </div>
                        </td>

                        {/* Cliente */}
                        <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                          <div className="flex items-center gap-1.5 text-sm"
                            style={{ color: "hsl(var(--muted-foreground))" }}>
                            <Building2 size={13} />
                            {ticket.company_name}
                          </div>
                        </td>

                        {/* Estado */}
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <StatusBadge status={ticket.status} />
                        </td>

                        {/* Fecha */}
                        <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                            <div>{timeAgo(ticket.created_at)}</div>
                            <div style={{ opacity: 0.65 }}>{formatDate(ticket.created_at).split(",")[0]}</div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div className="flex items-center gap-1">
                            <span
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                              title="Ver detalle / Editar"
                            >
                              <ExternalLink size={14} />
                            </span>
                            <button
                              onClick={(e) => handleDeleteTicket(ticket.id, e)}
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {sorted.length > 0 && (
            <div
              className="flex items-center justify-between px-4 py-3 text-xs border-t"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--muted-foreground))",
                background: "hsl(var(--muted) / 0.3)",
              }}
            >
              <span>
                Mostrando {sorted.length} de {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={11} style={{ color: "hsl(var(--warning))" }} />
                Haz clic en una fila para ver el detalle y cambiar el estado
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
