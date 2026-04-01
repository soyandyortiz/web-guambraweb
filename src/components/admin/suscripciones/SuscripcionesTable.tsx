"use client";

import { useState, useTransition, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  RefreshCw,
  FolderKanban,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  CreditCard,
  TrendingUp,
  Clock,
  Zap,
  Edit2,
} from "lucide-react";
import { updateSubscription } from "@/app/admin/finanzas/suscripciones/actions";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type SuscripcionRow = {
  id: string;
  customer_id: string | null;
  project_id: string | null;
  plan_name: string;
  monthly_fee: number;
  next_billing_date: string;
  is_active: boolean | null;
  status: string | null; // gratis, active, expired, unsupervised
  // Denormalizados
  company_name: string;
  project_name: string;
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Días hasta la próxima fecha de cobro (puede ser negativo = vencido) */
function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / 86400000);
}

/** Añade exactamente 30 días a una fecha ISO (yyyy-mm-dd) */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

type SortDir = "asc" | "desc" | null;
type SortKey = "plan_name" | "company_name" | "project_name" | "monthly_fee" | "next_billing_date";

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc")  return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   BADGE DE ESTADO AVANZADO
   gratis | active | expired | unsupervised
───────────────────────────────────────── */
function StatusBadge({ status, isActive }: { status: string | null; isActive: boolean | null }) {
  const s = status || (isActive ? "active" : "inactive");
  
  const config: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
    gratis: {
      label: "Cortesía (Gratis)",
      icon: <Zap size={12} />,
      color: "hsl(var(--primary))",
      bg: "hsl(var(--primary) / 0.12)",
      border: "hsl(var(--primary) / 0.3)",
    },
    active: {
      label: "Plan Activo",
      icon: <CheckCircle2 size={12} />,
      color: "hsl(var(--success))",
      bg: "hsl(var(--success) / 0.12)",
      border: "hsl(var(--success) / 0.3)",
    },
    expired: {
      label: "Expirado",
      icon: <XCircle size={12} />,
      color: "hsl(var(--destructive))",
      bg: "hsl(var(--destructive) / 0.12)",
      border: "hsl(var(--destructive) / 0.3)",
    },
    unsupervised: {
      label: "Sin Supervisión",
      icon: <AlertTriangle size={12} />,
      color: "hsl(var(--warning))",
      bg: "hsl(var(--warning) / 0.12)",
      border: "hsl(var(--warning) / 0.3)",
    },
    inactive: {
      label: "Inactiva",
      icon: <Clock size={12} />,
      color: "hsl(var(--muted-foreground))",
      bg: "hsl(var(--muted))",
      border: "hsl(var(--border))",
    }
  };

  const current = config[s] || config.inactive;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
      style={{
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
      }}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

/* ─────────────────────────────────────────
   CHIP DE PRÓXIMO COBRO
───────────────────────────────────────── */
function BillingChip({ dateStr, isActive }: { dateStr: string; isActive: boolean | null }) {
  const days = daysUntil(dateStr);
  const overdue = days < 0;
  const warning = days >= 0 && days <= 7;

  let bg    = "hsl(var(--muted))";
  let color = "hsl(var(--muted-foreground))";
  let icon  = <Calendar size={12} />;

  if (!isActive) {
    bg    = "hsl(var(--muted))";
    color = "hsl(var(--muted-foreground))";
  } else if (overdue) {
    bg    = "hsl(var(--destructive) / 0.12)";
    color = "hsl(var(--destructive))";
    icon  = <AlertTriangle size={12} />;
  } else if (warning) {
    bg    = "hsl(var(--warning) / 0.12)";
    color = "hsl(var(--warning))";
    icon  = <Clock size={12} />;
  } else {
    bg    = "hsl(var(--muted))";
    color = "hsl(var(--muted-foreground))";
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
        style={{ background: bg, color }}
      >
        {icon}
        {formatDate(dateStr)}
      </div>
      {isActive && (
        <span
          className="text-xs pl-1"
          style={{
            color: overdue
              ? "hsl(var(--destructive))"
              : warning
              ? "hsl(var(--warning))"
              : "hsl(var(--muted-foreground))",
            fontWeight: overdue || warning ? 600 : 400,
          }}
        >
          {overdue
            ? `Vencido hace ${Math.abs(days)}d`
            : days === 0
            ? "¡Hoy!"
            : `En ${days} día${days !== 1 ? "s" : ""}`}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   BOTÓN RENOVAR (+ 30 días)
───────────────────────────────────────── */
function RenewButton({
  sub,
  onRenewed,
}: {
  sub: SuscripcionRow;
  onRenewed: (id: string, newDate: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRenew = () => {
    setError(null);
    const newDate = addDays(sub.next_billing_date, 30);

    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (createClient() as any)
        .from("subscriptions")
        .update({ next_billing_date: newDate })
        .eq("id", sub.id);

      if (err) {
        setError(err.message);
        return;
      }
      onRenewed(sub.id, newDate);
    });
  };

  return (
    <div>
      <button
        onClick={handleRenew}
        disabled={isPending}
        className="btn-secondary btn-sm gap-1.5"
        style={{
          fontSize: "0.75rem",
          color: isPending ? "hsl(var(--muted-foreground))" : "hsl(var(--primary))",
          borderColor: "hsl(var(--primary) / 0.3)",
        }}
        title={`Renovar +30 días → ${addDays(sub.next_billing_date, 30)}`}
      >
        {isPending
          ? <Loader2 size={13} className="animate-spin" />
          : <RefreshCw size={13} />
        }
        {isPending ? "Renovando…" : "Renovar"}
      </button>
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "hsl(var(--destructive))" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL: EDITAR SUSCRIPCIÓN
───────────────────────────────────────── */
function EditSubscriptionModal({
  sub,
  onClose,
  onUpdated,
}: {
  sub: SuscripcionRow;
  onClose: () => void;
  onUpdated: (updated: Partial<SuscripcionRow>) => void;
}) {
  const [formData, setFormData] = useState({
    plan_name: sub.plan_name,
    monthly_fee: sub.monthly_fee,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateSubscription(sub.id, formData);
      if (res.success) {
        onUpdated(formData);
        onClose();
      } else {
        alert("Error: " + res.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-xl flex items-center gap-2">
            <Edit2 size={20} className="text-primary" />
            Editar Suscripción
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Nombre del Plan</label>
            <input
              type="text"
              required
              value={formData.plan_name}
              onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Cuota Mensual (USD)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.monthly_fee}
              onChange={(e) => setFormData({ ...formData, monthly_fee: parseFloat(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold border border-border hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-[2] px-4 py-2.5 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 size={18} className="animate-spin" />}
              Guardar Cambios
            </button>
          </div>
        </form>
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
        <CreditCard size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
      </div>
      <h3
        className="font-display font-semibold text-lg mb-1"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {filtered ? "Sin resultados" : "Sin suscripciones"}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros."
          : "Las suscripciones activas de mantenimiento aparecerán aquí."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
type Props = { initialSubs: SuscripcionRow[] };

export function SuscripcionesTable({ initialSubs }: Props) {
  const [subs, setSubs] = useState<SuscripcionRow[]>(initialSubs);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "gratis" | "expired">("all");
  const [sortKey, setSortKey] = useState<SortKey>("next_billing_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [editingSub, setEditingSub] = useState<SuscripcionRow | null>(null);

  /* ── Callback de renovación ── */
  const handleRenewed = useCallback((id: string, newDate: string) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, next_billing_date: newDate } : s))
    );
  }, []);

  /* ── Filtrar ── */
  const filtered = subs.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.plan_name.toLowerCase().includes(q) ||
      s.company_name.toLowerCase().includes(q) ||
      s.project_name.toLowerCase().includes(q);
    const matchActive =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? s.status === "active" || (s.is_active === true && s.status !== "gratis")
        : activeFilter === "gratis"
        ? s.status === "gratis"
        : s.status === "expired" || s.is_active === false;
    return matchSearch && matchActive;
  });

  /* ── Ordenar ── */
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "monthly_fee") {
      const diff = a.monthly_fee - b.monthly_fee;
      return sortDir === "asc" ? diff : -diff;
    }
    const av = String(a[sortKey] ?? "");
    const bv = String(b[sortKey] ?? "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function getSortDir(key: SortKey): SortDir {
    return sortKey !== key ? null : sortDir;
  }

  /* ── Métricas ── */
  const active   = subs.filter((s) => s.is_active === true);
  const inactive = subs.filter((s) => s.is_active !== true);
  const mrr      = active.reduce((s, sub) => s + sub.monthly_fee, 0);
  const arr      = mrr * 12;
  const overdue  = active.filter((s) => daysUntil(s.next_billing_date) < 0).length;
  const dueSoon  = active.filter((s) => {
    const d = daysUntil(s.next_billing_date);
    return d >= 0 && d <= 7;
  }).length;

  /* ── Pills ── */
  const PILLS = [
    { key: "all" as const,      label: "Todas",     count: subs.length,     color: "var(--muted-foreground)"     },
    { key: "active" as const,   label: "Con Plan",  count: subs.filter(s => s.status === 'active').length,   color: "var(--success)"     },
    { key: "gratis" as const,   label: "Cortesía",  count: subs.filter(s => s.status === 'gratis').length,   color: "var(--primary)"     },
    { key: "expired" as const,  label: "Vencidas",  count: subs.filter(s => s.status === 'expired' || s.is_active === false).length, color: "var(--destructive)" },
  ];

  return (
    <div className="space-y-4">
      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "MRR (Ingreso Mensual)",
            value: formatCurrency(mrr),
            icon: <TrendingUp size={18} />,
            color: "hsl(var(--success))",
            bg: "hsl(var(--success) / 0.1)",
            border: "hsl(var(--success) / 0.25)",
          },
          {
            label: "ARR (Ingreso Anual)",
            value: formatCurrency(arr),
            icon: <Zap size={18} />,
            color: "hsl(var(--primary))",
            bg: "hsl(var(--primary) / 0.1)",
            border: "hsl(var(--primary) / 0.25)",
          },
          {
            label: "Cobros próximos (7d)",
            value: dueSoon.toString(),
            icon: <Clock size={18} />,
            color: "hsl(var(--warning))",
            bg: "hsl(var(--warning) / 0.1)",
            border: "hsl(var(--warning) / 0.25)",
          },
          {
            label: "Cobros vencidos",
            value: overdue.toString(),
            icon: <AlertTriangle size={18} />,
            color: overdue > 0 ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))",
            bg: overdue > 0 ? "hsl(var(--destructive) / 0.1)" : "hsl(var(--muted) / 0.5)",
            border: overdue > 0 ? "hsl(var(--destructive) / 0.25)" : "hsl(var(--border))",
          },
        ].map(({ label, value, icon, color, bg, border }) => (
          <div
            key={label}
            className="px-4 py-4 rounded-xl flex items-center gap-3"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(var(--card))", color }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {label}
              </div>
              <div className="font-display font-bold text-sm leading-tight" style={{ color }}>
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controles ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Pills activo/inactivo */}
        <div
          className="flex rounded-lg overflow-hidden flex-shrink-0"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          {PILLS.map(({ key, label, count, color }, idx) => {
            const active = activeFilter === key;
            const cssVar = color.replace("var(", "").replace(")", "");
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(active && key !== "all" ? "all" : key)}
                className="px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition-all"
                style={{
                  background: active ? `hsl(${cssVar} / 0.12)` : "hsl(var(--card))",
                  color: active ? `hsl(${cssVar})` : "hsl(var(--muted-foreground))",
                  borderRight: idx < PILLS.length - 1 ? "1px solid hsl(var(--border))" : "none",
                }}
              >
                {label}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: active ? `hsl(${cssVar} / 0.2)` : "hsl(var(--muted))",
                    color: active ? `hsl(${cssVar})` : "hsl(var(--muted-foreground))",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
          style={{ background: "hsl(var(--input))", border: "1px solid hsl(var(--border))" }}
        >
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Buscar por plan, empresa o proyecto..."
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
      </div>

      {/* ── Tabla ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid hsl(var(--border))" }}
      >
        {sorted.length === 0 ? (
          <EmptyState filtered={search !== "" || activeFilter !== "all"} />
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              {/* THEAD */}
              <thead>
                <tr
                  style={{
                    background: "hsl(var(--muted))",
                    borderBottom: "1px solid hsl(var(--border))",
                  }}
                >
                  {[
                    { key: "plan_name" as SortKey,         label: "Plan"            },
                    { key: "company_name" as SortKey,      label: "Empresa"         },
                    { key: "project_name" as SortKey,      label: "Proyecto"        },
                    { key: "monthly_fee" as SortKey,       label: "Monto Mensual"   },
                    { key: "next_billing_date" as SortKey, label: "Próximo Cobro"   },
                    { key: null,                           label: "Estado"          },
                    { key: null,                           label: "Acción"          },
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
                {sorted.map((sub, idx) => {
                  const days = daysUntil(sub.next_billing_date);
                  const isOverdue = sub.is_active && days < 0;
                  const isDueSoon = sub.is_active && days >= 0 && days <= 7;

                  return (
                    <tr
                      key={sub.id}
                      style={{
                        borderBottom:
                          idx < sorted.length - 1
                            ? "1px solid hsl(var(--border) / 0.5)"
                            : "none",
                        transition: "background 0.12s",
                        opacity: sub.is_active === false ? 0.65 : 1,
                        /* Borde izquierdo: rojo si vencido, ámbar si pronto, transparente si ok */
                        borderLeft: `3px solid ${
                          isOverdue
                            ? "hsl(var(--destructive))"
                            : isDueSoon
                            ? "hsl(var(--warning))"
                            : "transparent"
                        }`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          "hsl(var(--muted) / 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          "transparent";
                      }}
                    >
                      {/* Plan */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: sub.is_active
                                ? "hsl(var(--success) / 0.12)"
                                : "hsl(var(--muted))",
                              color: sub.is_active
                                ? "hsl(var(--success))"
                                : "hsl(var(--muted-foreground))",
                            }}
                          >
                            <CreditCard size={13} />
                          </div>
                          <span
                            className="font-semibold text-sm"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {sub.plan_name}
                          </span>
                        </div>
                      </td>

                      {/* Empresa */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <Building2 size={13} style={{ color: "hsl(var(--secondary))", flexShrink: 0 }} />
                          {sub.company_name}
                        </div>
                      </td>

                      {/* Proyecto */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          <FolderKanban size={13} style={{ flexShrink: 0 }} />
                          {sub.project_name}
                        </div>
                      </td>

                      {/* Monto mensual */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <span
                          className="font-bold"
                          style={{
                            color: sub.is_active
                              ? "hsl(var(--success))"
                              : "hsl(var(--muted-foreground))",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {formatCurrency(sub.monthly_fee)}
                        </span>
                        <span
                          className="text-xs ml-1"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          /mes
                        </span>
                      </td>

                      {/* Próximo cobro */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <BillingChip
                          dateStr={sub.next_billing_date}
                          isActive={sub.is_active}
                        />
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <StatusBadge status={sub.status} isActive={sub.is_active} />
                      </td>

                      {/* Acción */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div className="flex items-center gap-2">
                          <RenewButton sub={sub} onRenewed={handleRenewed} />
                          <button
                            onClick={() => setEditingSub(sub)}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Editar plan de suscripción"
                          >
                            <Edit2 size={15} />
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

        {/* Modal de Edición */}
        {editingSub && (
          <EditSubscriptionModal
            sub={editingSub}
            onClose={() => setEditingSub(null)}
            onUpdated={(updated) => {
              setSubs((prev) =>
                prev.map((s) => (s.id === editingSub.id ? { ...s, ...updated } : s))
              );
            }}
          />
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
              {sorted.length} de {subs.length} suscripción{subs.length !== 1 ? "es" : ""}
            </span>
            <div className="flex items-center gap-3">
              {overdue > 0 && (
                <span
                  className="flex items-center gap-1"
                  style={{ color: "hsl(var(--destructive))" }}
                >
                  <AlertTriangle size={11} />
                  {overdue} vencida{overdue !== 1 ? "s" : ""} — usa Renovar para actualizar
                </span>
              )}
              {dueSoon > 0 && overdue === 0 && (
                <span
                  className="flex items-center gap-1"
                  style={{ color: "hsl(var(--warning))" }}
                >
                  <Clock size={11} />
                  {dueSoon} vence{dueSoon !== 1 ? "n" : ""} en 7 días
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
