"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  X,
  Eye,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  Building2,
  Calendar,
  Receipt,
  Package,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Hash,
} from "lucide-react";
import { InvoicePDFButton } from "@/components/admin/shared/InvoicePDFButton";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type FacturaRow = {
  id: string;
  customer_id: string | null;
  company_name: string;
  tax_id: string | null;           // RUC / DNI
  email: string | null;
  address: string | null;
  subtotal: number;
  discount_amount: number | null;
  total_amount: number;
  coupon_id: string | null;
  payment_id: string | null;
  created_at: string;
};

export type FacturaItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number | null;
  unit_price: number;
  subtotal: number;
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

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Número de comprobante: COM-XXXXXXXX */
function invoiceNumber(id: string) {
  return `COM-${id.slice(0, 8).toUpperCase()}`;
}

type SortDir = "asc" | "desc" | null;
type SortKey = "company_name" | "total_amount" | "created_at";

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   MODAL DE DETALLE / VISTA DE FACTURA
───────────────────────────────────────── */
function FacturaDetailModal({
  factura,
  onClose,
}: {
  factura: FacturaRow;
  onClose: () => void;
}) {
  const [items, setItems] = useState<FacturaItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga los order_items al montar
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
          products ( name )
        `)
        .eq("order_id", factura.id);

      if (err) { setError(err.message); return; }

      type RawItem = {
        id: string;
        product_id: string | null;
        quantity: number | null;
        unit_price: number;
        products: { name: string } | { name: string }[] | null;
      };

      const normalized: FacturaItem[] = ((data ?? []) as RawItem[]).map((item) => {
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
  }, [factura.id]);

  // Disparar en el primer render del modal
  useState(() => { loadItems(); });

  const invoiceNum = invoiceNumber(factura.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card animate-scale-in w-full max-w-2xl my-8"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between px-6 py-5 border-b flex-shrink-0"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(var(--success) / 0.05)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "hsl(var(--success) / 0.15)",
                color: "hsl(var(--success))",
              }}
            >
              <Receipt size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="font-display font-bold text-lg leading-none"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {invoiceNum}
                </h3>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "hsl(var(--success) / 0.12)",
                    color: "hsl(var(--success))",
                    border: "1px solid hsl(var(--success) / 0.3)",
                  }}
                >
                  <CheckCircle2 size={11} /> PAGADO
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                Comprobante emitido el {formatDateTime(factura.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && items && (
              <InvoicePDFButton 
                factura={{
                  id: factura.id,
                  number: invoiceNum,
                  date: formatDate(factura.created_at),
                  clientData: {
                    name: factura.company_name,
                    taxId: factura.tax_id || "N/A",
                    email: factura.email || "N/A",
                    address: factura.address || undefined,
                  },
                  items: items.map(i => ({
                    description: i.product_name,
                    quantity: i.quantity ?? 1,
                    unitPrice: i.unit_price
                  })),
                  subtotal: factura.subtotal,
                  total: factura.total_amount,
                  discount: factura.discount_amount || 0,
                  tax: factura.total_amount - (factura.subtotal - (factura.discount_amount || 0))
                }}
              />
            )}
            <button
              onClick={onClose}
              className="btn-ghost p-2 rounded-lg"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* ── Datos del cliente ── */}
          <div
            className="grid grid-cols-2 gap-4 px-4 py-4 rounded-xl"
            style={{
              background: "hsl(var(--muted) / 0.4)",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                Emitido a
              </p>
              <p className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                {factura.company_name}
              </p>
              {factura.tax_id && (
                <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  RUC/DNI: <span className="font-mono font-semibold">{factura.tax_id}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                Referencia
              </p>
              <p className="font-mono text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                {invoiceNum}
              </p>
              {factura.payment_id && (
                <p className="text-xs mt-0.5 font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Pago: {factura.payment_id.slice(0, 12)}…
                </p>
              )}
            </div>
          </div>

          {/* ── Tabla de productos ── */}
          <div>
            <h4
              className="font-semibold text-sm mb-3 flex items-center gap-2"
              style={{ color: "hsl(var(--foreground))" }}
            >
              <Package size={15} />
              Detalle de productos
            </h4>

            {loading && (
              <div className="flex items-center justify-center gap-2 py-10"
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

            {!loading && !error && items?.length === 0 && (
              <div
                className="py-8 text-center text-sm rounded-xl"
                style={{
                  background: "hsl(var(--muted) / 0.4)",
                  color: "hsl(var(--muted-foreground))",
                  border: "1px dashed hsl(var(--border))",
                }}
              >
                Sin líneas de producto registradas.
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
                        <th key={h} style={{
                          padding: "0.625rem 1rem",
                          textAlign: h === "Producto" ? "left" : "right",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          fontWeight: 600,
                          color: "hsl(var(--muted-foreground))",
                          whiteSpace: "nowrap",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id} style={{
                        borderBottom: idx < items.length - 1 ? "1px solid hsl(var(--border) / 0.5)" : "none",
                        background: idx % 2 === 1 ? "hsl(var(--muted) / 0.2)" : "transparent",
                      }}>
                        <td style={{ padding: "0.75rem 1rem", color: "hsl(var(--foreground))" }}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
                              <Package size={12} />
                            </div>
                            {item.product_name}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "hsl(var(--foreground))" }}>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
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
                  <tfoot style={{ borderTop: "2px solid hsl(var(--border))" }}>
                    <tr style={{ background: "hsl(var(--muted) / 0.3)" }}>
                      <td colSpan={3} style={{ padding: "0.625rem 1rem", textAlign: "right", fontSize: "0.8125rem", color: "hsl(var(--muted-foreground))" }}>
                        Subtotal
                      </td>
                      <td style={{ padding: "0.625rem 1rem", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "hsl(var(--foreground))" }}>
                        {formatCurrency(factura.subtotal)}
                      </td>
                    </tr>
                    {!!(factura.discount_amount && factura.discount_amount > 0) && (
                      <tr style={{ background: "hsl(var(--success) / 0.04)" }}>
                        <td colSpan={3} style={{ padding: "0.625rem 1rem", textAlign: "right", fontSize: "0.8125rem", color: "hsl(var(--success))" }}>
                          Descuento {factura.coupon_id ? "(Cupón)" : ""}
                        </td>
                        <td style={{ padding: "0.625rem 1rem", textAlign: "right", color: "hsl(var(--success))", fontVariantNumeric: "tabular-nums" }}>
                          − {formatCurrency(factura.discount_amount)}
                        </td>
                      </tr>
                    )}
                    <tr style={{ background: "hsl(var(--success) / 0.08)", borderTop: "1px solid hsl(var(--success) / 0.2)" }}>
                      <td colSpan={3} style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem", fontWeight: 700, color: "hsl(var(--success))" }}>
                        TOTAL COBRADO
                      </td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "1.125rem", fontWeight: 800, color: "hsl(var(--success))", fontVariantNumeric: "tabular-nums" }}>
                        {formatCurrency(factura.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
          >
            {factura.id}
          </span>
          <button onClick={onClose} className="btn-secondary btn-sm">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL: FacturasTable
───────────────────────────────────────── */
type Props = { facturas: FacturaRow[] };

export function FacturasTable({ facturas: initialFacturas }: Props) {
  const [facturas] = useState<FacturaRow[]>(initialFacturas);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewingFactura, setViewingFactura] = useState<FacturaRow | null>(null);

  /* ── Filtrar ── */
  const filtered = facturas.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.company_name.toLowerCase().includes(q) ||
      (f.tax_id ?? "").toLowerCase().includes(q) ||
      invoiceNumber(f.id).toLowerCase().includes(q)
    );
  });

  /* ── Ordenar ── */
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "total_amount") {
      const diff = a.total_amount - b.total_amount;
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
  const totalRevenue = facturas.reduce((s, f) => s + f.total_amount, 0);
  const totalDiscount = facturas.reduce((s, f) => s + (f.discount_amount ?? 0), 0);
  const avgTicket = facturas.length > 0 ? totalRevenue / facturas.length : 0;

  const STATS = [
    {
      label: "Total facturado",
      value: formatCurrency(totalRevenue),
      icon: <TrendingUp size={18} />,
      color: "hsl(var(--success))",
      bg: "hsl(var(--success) / 0.1)",
      border: "hsl(var(--success) / 0.25)",
    },
    {
      label: "Facturas emitidas",
      value: facturas.length.toString(),
      icon: <FileText size={18} />,
      color: "hsl(var(--primary))",
      bg: "hsl(var(--primary) / 0.1)",
      border: "hsl(var(--primary) / 0.25)",
    },
    {
      label: "Ticket promedio",
      value: formatCurrency(avgTicket),
      icon: <Receipt size={18} />,
      color: "hsl(var(--secondary))",
      bg: "hsl(var(--secondary) / 0.1)",
      border: "hsl(var(--secondary) / 0.25)",
    },
    {
      label: "Descuentos aplicados",
      value: formatCurrency(totalDiscount),
      icon: <Hash size={18} />,
      color: "hsl(var(--warning))",
      bg: "hsl(var(--warning) / 0.1)",
      border: "hsl(var(--warning) / 0.25)",
    },
  ];

  return (
    <>
      {viewingFactura && (
        <FacturaDetailModal
          factura={viewingFactura}
          onClose={() => setViewingFactura(null)}
        />
      )}

      <div className="space-y-4">
        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(({ label, value, icon, color, bg, border }) => (
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
                <div
                  className="font-display font-bold text-sm leading-tight truncate"
                  style={{ color }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Controles: buscador + exportar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
            style={{ background: "hsl(var(--input))", border: "1px solid hsl(var(--border))" }}
          >
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Buscar por cliente, RUC o número de comprobante..."
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

          {/* Botón Exportar — visual */}
          <button
            className="btn-secondary gap-2 whitespace-nowrap"
            title="Exportar comprobantes (próximamente)"
            onClick={() => alert("Exportación de comprobantes — próximamente disponible")}
          >
            <Download size={15} />
            Exportar CSV
          </button>
        </div>

        {/* ── Tabla ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--muted))" }}
              >
                <FileText size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1"
                style={{ color: "hsl(var(--foreground))" }}>
                {search ? "Sin resultados" : "Sin comprobantes aún"}
              </h3>
              <p className="text-sm max-w-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {search
                  ? "Prueba con otro término de búsqueda."
                  : "Los comprobantes de pedidos pagados aparecerán aquí."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                {/* THEAD */}
                <thead>
                  <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
                    {[
                      { key: null,                       label: "Nº Comprobante" },
                      { key: "company_name" as SortKey,  label: "Cliente"      },
                      { key: "created_at" as SortKey,    label: "Fecha de Pago"},
                      { key: null,                       label: "Subtotal"     },
                      { key: null,                       label: "Descuento"    },
                      { key: "total_amount" as SortKey,  label: "Total"        },
                      { key: null,                       label: "Ver"          },
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
                  {sorted.map((f, idx) => (
                    <tr
                      key={f.id}
                      style={{
                        borderBottom:
                          idx < sorted.length - 1
                            ? "1px solid hsl(var(--border) / 0.5)"
                            : "none",
                        transition: "background 0.12s",
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
                      {/* Nº Factura */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "hsl(var(--success) / 0.1)",
                              color: "hsl(var(--success))",
                            }}
                          >
                            <FileText size={13} />
                          </div>
                          <code
                            className="text-xs font-mono font-semibold"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {invoiceNumber(f.id)}
                          </code>
                        </div>
                      </td>

                      {/* Cliente */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <div
                          className="font-medium text-sm"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {f.company_name}
                        </div>
                        {f.tax_id && (
                          <div
                            className="text-xs font-mono mt-0.5"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            {f.tax_id}
                          </div>
                        )}
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
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formatDate(f.created_at)}
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          whiteSpace: "nowrap",
                          color: "hsl(var(--muted-foreground))",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {formatCurrency(f.subtotal)}
                      </td>

                      {/* Descuento */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        {f.discount_amount && f.discount_amount > 0 ? (
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "hsl(var(--success))" }}
                          >
                            − {formatCurrency(f.discount_amount)}
                          </span>
                        ) : (
                          <span style={{ color: "hsl(var(--muted-foreground))" }}>—</span>
                        )}
                      </td>

                      {/* Total */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <span
                          className="font-bold text-sm"
                          style={{
                            color: "hsl(var(--success))",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {formatCurrency(f.total_amount)}
                        </span>
                      </td>

                      {/* Ver detalle */}
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <button
                          onClick={() => setViewingFactura(f)}
                          className="btn-secondary btn-sm gap-1.5"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <Eye size={13} />
                          Ver
                        </button>
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
                {sorted.length} de {facturas.length} factura{facturas.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={11} style={{ color: "hsl(var(--success))" }} />
                Solo pedidos con estado <strong style={{ color: "hsl(var(--success))" }}>Pagado</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
