"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  X,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  ShoppingBag,
  Package,
  Building2,
  Calendar,
  CreditCard,
  Receipt,
  Hash,
  Loader2,
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useTransition } from "react";
import { confirmOrderPayment, discardOrder } from "@/app/admin/ventas/pedidos/actions";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type OrderStatus = "pending" | "paid" | "cancelled" | "pendiente_pago";

export type OrderRow = {
  id: string;
  customer_id: string | null;
  company_name: string;          // denormalizado desde customers
  subtotal: number;
  discount_amount: number | null;
  total_amount: number;
  status: OrderStatus | null;
  coupon_id: string | null;
  payment_id: string | null;
  created_at: string;
  order_type?: string | null;
  metadata?: any | null;
  metodo_pago_manual?: string | null;
};

export type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;          // denormalizado desde products
  quantity: number | null;
  unit_price: number;
  subtotal: number;              // quantity * unit_price
};

/* ─────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────── */
const STATUS_CFG: Record<
  OrderStatus,
  { label: string; bg: string; color: string; border: string; dot: string }
> = {
  pending: {
    label: "Pendiente de Pago",
    bg: "hsl(var(--warning) / 0.12)",
    color: "hsl(var(--warning))",
    border: "hsl(var(--warning) / 0.35)",
    dot: "hsl(var(--warning))",
  },
  paid: {
    label: "Pagado",
    bg: "hsl(var(--success) / 0.12)",
    color: "hsl(var(--success))",
    border: "hsl(var(--success) / 0.35)",
    dot: "hsl(var(--success))",
  },
  cancelled: {
    label: "Cancelado",
    bg: "hsl(var(--destructive) / 0.12)",
    color: "hsl(var(--destructive))",
    border: "hsl(var(--destructive) / 0.35)",
    dot: "hsl(var(--destructive))",
  },
  pendiente_pago: {
    label: "Pendiente de Pago",
    bg: "hsl(var(--warning) / 0.12)",
    color: "hsl(var(--warning))",
    border: "hsl(var(--warning) / 0.35)",
    dot: "hsl(var(--warning))",
  },
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

type SortDir = "asc" | "desc" | null;
type SortKey = "company_name" | "total_amount" | "status" | "created_at";

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   BADGE DE ESTADO
───────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus | null }) {
  const cfg =
    status && STATUS_CFG[status]
      ? STATUS_CFG[status]
      : {
          label: "Desconocido",
          bg: "hsl(var(--muted))",
          color: "hsl(var(--muted-foreground))",
          border: "hsl(var(--border))",
          dot: "hsl(var(--muted-foreground))",
        };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────
   MODAL DE DETALLE DEL PEDIDO
───────────────────────────────────────── */
function OrderDetailModal({
  order,
  onClose,
  onConfirmPayment,
  onDiscard,
  isPending,
}: {
  order: OrderRow;
  onClose: () => void;
  onConfirmPayment: (id: string) => void;
  onDiscard: (id: string) => void;
  isPending: boolean;
}) {
  const [items, setItems] = useState<OrderItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga los order_items al montar el modal
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: err } = await (supabase as any)
        .from("order_items")
        .select(`
          id,
          product_id,
          quantity,
          unit_price,
          products (
            name
          )
        `)
        .eq("order_id", order.id);

      if (err) { setError(err.message); return; }

      type RawItem = {
        id: string;
        product_id: string | null;
        quantity: number | null;
        unit_price: number;
        products: { name: string } | { name: string }[] | null;
      };

      const normalized: OrderItem[] = ((data ?? []) as RawItem[]).map((item) => {
        const prod = Array.isArray(item.products)
          ? item.products[0]
          : item.products;
        const qty = item.quantity ?? 1;
        return {
          id: item.id,
          product_id: item.product_id,
          product_name: prod?.name ?? "Producto eliminado",
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: qty * item.unit_price,
        };
      });

      setItems(normalized);
    } finally {
      setLoading(false);
    }
  }, [order.id]);

  // Disparar al montar
  useState(() => { loadItems(); });

  const cfg = order.status && STATUS_CFG[order.status] ? STATUS_CFG[order.status] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card animate-scale-in w-full max-w-2xl my-8"
        style={{ maxHeight: "85vh", display: "flex", flexDirection: "column" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: cfg?.bg ?? "hsl(var(--muted))",
                color: cfg?.color ?? "hsl(var(--muted-foreground))",
              }}
            >
              <Receipt size={18} />
            </div>
            <div>
              <h3
                className="font-display font-bold text-lg leading-none"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Detalle del Pedido
              </h3>
              <p className="text-xs mt-0.5 font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                #{shortId(order.id)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* ── Info general del pedido ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                icon: <Building2 size={14} />,
                label: "Cliente",
                value: order.company_name,
              },
              {
                icon: <Calendar size={14} />,
                label: "Fecha",
                value: formatDate(order.created_at),
              },
              {
                icon: <Hash size={14} />,
                label: "Estado",
                value: <StatusBadge status={order.status} />,
              },
              {
                icon: <CreditCard size={14} />,
                label: "Subtotal",
                value: formatCurrency(order.subtotal),
              },
              {
                icon: <CreditCard size={14} />,
                label: "Descuento",
                value: order.discount_amount
                  ? `− ${formatCurrency(order.discount_amount)}`
                  : "—",
              },
              {
                icon: <CreditCard size={14} />,
                label: "Total",
                value: (
                  <span className="font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
                    {formatCurrency(order.total_amount)}
                  </span>
                ),
              },
              order.metodo_pago_manual ? {
                icon: <Hash size={14} />,
                label: "Pago Manual",
                value: (
                  <span className="capitalize">
                    {order.metodo_pago_manual.replace(/_/g, " ")}
                  </span>
                ),
              } : null,
            ].filter(Boolean).map((item: any) => {
              const { icon, label, value } = item;
              return (
              <div
                key={label}
                className="px-3 py-2.5 rounded-xl text-left"
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
                <div className="text-sm" style={{ color: "hsl(var(--foreground))" }}>
                  {value}
                </div>
              </div>
            );
          }) as any}
          </div>

          {/* ── Líneas de pedido ── */}
          <div>
            <h4
              className="font-display font-semibold text-sm mb-3 flex items-center gap-2"
              style={{ color: "hsl(var(--foreground))" }}
            >
              <Package size={15} />
              Productos comprados
            </h4>

            {loading && (
              <div className="flex items-center justify-center py-10 gap-2"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                <Loader2 size={18} className="animate-spin" />
                Cargando productos...
              </div>
            )}

            {error && !loading && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "hsl(var(--destructive) / 0.1)",
                  border: "1px solid hsl(var(--destructive) / 0.3)",
                  color: "hsl(var(--destructive))",
                }}
              >
                <AlertTriangle size={15} /> {error}
              </div>
            )}

            {!loading && !error && items && items.length === 0 && (
              <div
                className="py-8 text-center text-sm rounded-xl"
                style={{
                  background: "hsl(var(--muted) / 0.4)",
                  color: "hsl(var(--muted-foreground))",
                  border: "1px dashed hsl(var(--border))",
                }}
              >
                Este pedido no tiene productos registrados.
              </div>
            )}

            {!loading && items && items.length > 0 && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid hsl(var(--border))" }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
                      {["Producto", "Cant.", "Precio Unit.", "Subtotal"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0.625rem 1rem",
                            textAlign: h === "Producto" ? "left" : "right",
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontWeight: 600,
                            color: "hsl(var(--muted-foreground))",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom:
                            idx < items.length - 1
                              ? "1px solid hsl(var(--border) / 0.5)"
                              : "none",
                          background: idx % 2 === 1 ? "hsl(var(--muted) / 0.2)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--foreground))" }}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{
                                background: "hsl(var(--primary) / 0.1)",
                                color: "hsl(var(--primary))",
                              }}
                            >
                              <Package size={12} />
                            </div>
                            {item.product_name}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "hsl(var(--foreground))" }}>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                          >
                            ×{item.quantity ?? 1}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "hsl(var(--muted-foreground))", fontVariantNumeric: "tabular-nums" }}>
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "hsl(var(--foreground))", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Totales */}
                  <tfoot>
                    <tr style={{ borderTop: "2px solid hsl(var(--border))", background: "hsl(var(--muted) / 0.5)" }}>
                      <td
                        colSpan={3}
                        style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.8125rem", fontWeight: 600, color: "hsl(var(--muted-foreground))" }}
                      >
                        Total del pedido
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "right",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "hsl(var(--foreground))",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatCurrency(order.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* IDs auxiliares */}
          {(order.coupon_id || order.payment_id) && (
            <div
              className="flex flex-wrap gap-3 text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {order.coupon_id && (
                <span>
                  🎟️ Cupón:{" "}
                  <code className="font-mono">{shortId(order.coupon_id)}</code>
                </span>
              )}
              {order.payment_id && (
                <span>
                  💳 Pago ID:{" "}
                  <code className="font-mono">{shortId(order.payment_id)}</code>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0 bg-muted/20"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-2">
            {(order.status === "pending" || order.status === "pendiente_pago") && (
              <button
                onClick={() => onConfirmPayment(order.id)}
                disabled={isPending}
                className="btn-primary btn-sm gap-2 bg-success hover:bg-success/90 border-success"
                style={{ background: "hsl(var(--success))", borderColor: "hsl(var(--success))" }}
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Confirmar Pago
              </button>
            )}
            {(order.status === "pending" || order.status === "pendiente_pago" || order.status === "cancelled") && (
              <button
                onClick={() => onDiscard(order.id)}
                disabled={isPending}
                className="btn-secondary btn-sm gap-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={14} />
                Descartar
              </button>
            )}
          </div>
          
          <button onClick={onClose} className="btn-secondary btn-sm">
            Cerrar
          </button>
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
        {filtered ? (
          <Filter size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
        ) : (
          <ShoppingBag size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
        )}
      </div>
      <h3
        className="font-display font-semibold text-lg mb-1"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {filtered ? "Sin resultados" : "No hay pedidos"}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros de búsqueda o estado."
          : "Los pedidos de la tienda aparecerán aquí."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
type Props = { initialOrders: OrderRow[] };

export function PedidosTable({ initialOrders }: Props) {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewingOrder, setViewingOrder] = useState<OrderRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirmPayment = async (orderId: string) => {
    if (!confirm("¿Seguro que deseas confirmar el pago de este pedido? Esto activará cualquier suscripción vinculada y lo registrará en finanzas.")) return;

    startTransition(async () => {
      try {
        const res = await confirmOrderPayment(orderId);

        if (!res.success) {
          throw new Error(res.message);
        }

        // Actualizar estado local
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "paid" } : o))
        );
      } catch (err: any) {
        console.error("Error updating order status:", err);
        alert(`Error al confirmar el pago: ${err.message}`);
      }
    });
  };

  const handleDiscardOrder = async (orderId: string) => {
    if (!confirm("¿ESTÁS SEGURO? Esta acción eliminará permanentemente el pedido. Solo hazlo si el pedido fue una prueba o un error.")) return;
    if (!confirm("CONFIRMACIÓN FINAL: Se perderán todos los datos de este pedido. ¿Continuar?")) return;

    startTransition(async () => {
      try {
        const res = await discardOrder(orderId);
        if (!res.success) throw new Error(res.message);

        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } catch (err: any) {
        alert(`Error al descartar pedido: ${err.message}`);
      }
    });
  };

  /* ── Filtrar ── */
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.company_name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ? true : o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ── Ordenar ── */
  const sorted = [...filtered].sort((a, b) => {
    const av = String(a[sortKey] ?? "");
    const bv = String(b[sortKey] ?? "");
    // Orden numérico para total
    if (sortKey === "total_amount") {
      const diff = a.total_amount - b.total_amount;
      return sortDir === "asc" ? diff : -diff;
    }
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

  /* ── Stats ── */
  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + o.total_amount, 0);
  const countByStatus = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  const PILLS = [
    { key: "all" as const,       label: "Todos",     value: orders.length,          color: "var(--primary)" },
    { key: "pending" as const,   label: "Pendientes",value: countByStatus("pending"),color: "var(--warning)" },
    { key: "paid" as const,      label: "Pagados",   value: countByStatus("paid"),   color: "var(--success)" },
    { key: "cancelled" as const, label: "Cancelados",value: countByStatus("cancelled"),color: "var(--destructive)" },
  ];

  return (
    <>
      <div className="space-y-4">
        {/* ── Stats ── */}
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

        {/* Ingreso total pagado */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{
            background: "hsl(var(--success) / 0.08)",
            border: "1px solid hsl(var(--success) / 0.25)",
          }}
        >
          <span className="text-sm font-medium" style={{ color: "hsl(var(--success))" }}>
            💰 Ingresos confirmados (pedidos pagados)
          </span>
          <span className="text-lg font-display font-bold" style={{ color: "hsl(var(--success))" }}>
            {formatCurrency(totalRevenue)}
          </span>
        </div>

        {/* ── Controles ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
            style={{ background: "hsl(var(--input))", border: "1px solid hsl(var(--border))" }}
          >
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Buscar por cliente o ID de pedido..."
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
                      { key: null,            label: "ID Pedido" },
                      { key: "company_name" as SortKey, label: "Cliente" },
                      { key: "total_amount" as SortKey, label: "Total" },
                      { key: "status" as SortKey,       label: "Estado" },
                      { key: "created_at" as SortKey,   label: "Fecha" },
                      { key: null,            label: "Detalle" },
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
                  {sorted.map((order, idx) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom:
                          idx < sorted.length - 1
                            ? "1px solid hsl(var(--border) / 0.5)"
                            : "none",
                        transition: "background 0.12s",
                        opacity: order.status === "cancelled" ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          "hsl(var(--muted) / 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                      }}
                    >
                      {/* ID */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <code
                          className="text-xs px-2 py-1 rounded-lg font-mono font-semibold"
                          style={{
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          #{shortId(order.id)}
                        </code>
                      </td>

                      {/* Cliente */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "hsl(var(--secondary) / 0.12)",
                              color: "hsl(var(--secondary))",
                            }}
                          >
                            <Building2 size={13} />
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {order.company_name}
                          </span>
                          {order.order_type === "subscription" && (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                              style={{ 
                                background: "hsl(var(--primary) / 0.15)", 
                                color: "hsl(var(--primary))",
                                border: "1px solid hsl(var(--primary) / 0.2)"
                              }}
                            >
                              Suscripción
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <span
                          className="font-semibold tabular-nums"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {formatCurrency(order.total_amount)}
                        </span>
                        {order.discount_amount && order.discount_amount > 0 && (
                          <span
                            className="text-xs ml-1.5"
                            style={{ color: "hsl(var(--success))" }}
                          >
                            −{formatCurrency(order.discount_amount)}
                          </span>
                        )}
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Fecha */}
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          whiteSpace: "nowrap",
                          color: "hsl(var(--muted-foreground))",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {formatDate(order.created_at)}
                      </td>

                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="btn-secondary btn-sm gap-1.5"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <Eye size={13} />
                            Ver
                          </button>

                          {(order.status === "pending" || order.status === "pendiente_pago") && (
                            <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleConfirmPayment(order.id);
                               }}
                               disabled={isPending}
                               className="btn-primary btn-sm gap-1.5 bg-success hover:bg-success/90"
                               style={{ 
                                 fontSize: "0.75rem", 
                                 background: "hsl(var(--success))",
                                 borderColor: "hsl(var(--success))"
                               }}
                             >
                               {isPending ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                               Confirmar Pago
                             </button>
                           )}

                          {(order.status === "pending" || order.status === "pendiente_pago" || order.status === "cancelled") && (
                            <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleDiscardOrder(order.id);
                               }}
                               disabled={isPending}
                               className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                               title="Descartar pedido"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
                Mostrando {sorted.length} de {orders.length} pedido{orders.length !== 1 ? "s" : ""}
              </span>
              <span>
                Ordenado por{" "}
                <strong style={{ color: "hsl(var(--foreground))" }}>{sortKey}</strong>{" "}
                ({sortDir === "asc" ? "↑" : "↓"})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLE */}
      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
          onConfirmPayment={handleConfirmPayment}
          onDiscard={handleDiscardOrder}
          isPending={isPending}
        />
      )}
    </>
  );
}
