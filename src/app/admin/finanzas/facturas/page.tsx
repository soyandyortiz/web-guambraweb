export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { FacturasTable, type FacturaRow } from "@/components/admin/facturas/FacturasTable";
import { Receipt, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprobantes | Finanzas — GuambraWeb",
  description: "Registro de todos los pagos confirmados y comprobantes emitidos.",
};

/* ─────────────────────────────────────────
   Tipos del JOIN
───────────────────────────────────────── */
type RawCustomer = {
  company_name: string | null;
  tax_id: string | null;
  email: string | null;
  address: string | null;
} | null;

type RawOrder = {
  id: string;
  customer_id: string | null;
  coupon_id: string | null;
  subtotal: number;
  discount_amount: number | null;
  total_amount: number;
  payment_id: string | null;
  created_at: string;
  customers: RawCustomer | RawCustomer[];
};

export default async function FinanzasFacturasPage() {
  const supabase = await createClient();

  /* Solo órdenes con status = 'paid' */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("orders")
    .select(`
      id,
      customer_id,
      coupon_id,
      subtotal,
      discount_amount,
      total_amount,
      payment_id,
      created_at,
      customers (
        company_name,
        tax_id,
        email,
        address
      )
    `)
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  /* ── Normalizar ── */
  const facturas: FacturaRow[] = ((rawData ?? []) as RawOrder[]).map((o) => {
    const cust = Array.isArray(o.customers)
      ? (o.customers[0] as RawCustomer)
      : (o.customers as RawCustomer);

    return {
      id: o.id,
      customer_id: o.customer_id,
      company_name: cust?.company_name ?? "Cliente desconocido",
      tax_id: cust?.tax_id ?? null,
      email: cust?.email ?? null,
      address: cust?.address ?? null,
      subtotal: o.subtotal,
      discount_amount: o.discount_amount,
      total_amount: o.total_amount,
      coupon_id: o.coupon_id,
      payment_id: o.payment_id,
      created_at: o.created_at,
    };
  });

  /* ── Totales para encabezado ── */
  const totalRevenue = facturas.reduce((s, f) => s + f.total_amount, 0);

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
            background: "hsl(var(--success) / 0.12)",
            color: "hsl(var(--success))",
          }}
        >
          <Receipt size={20} />
        </div>
        <div>
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Comprobantes
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {error
              ? "Error al cargar comprobantes"
              : `${facturas.length} comprobante${facturas.length !== 1 ? "s" : ""} · Total: ${formatCurrency(totalRevenue)}`}
          </p>
        </div>
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
          Error cargando comprobantes: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tabla ── */}
      {!error && <FacturasTable facturas={facturas} />}
    </div>
  );
}
