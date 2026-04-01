export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { PedidosTable, type OrderRow, type OrderStatus } from "@/components/admin/pedidos/PedidosTable";
import { ShoppingBag, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedidos | Ventas — GuambraWeb",
  description: "Gestiona los pedidos y su estado de pago.",
};

/* ─────────────────────────────────────────
   Tipos explícitos del JOIN
───────────────────────────────────────── */
type RawCustomer = { company_name: string | null } | null;

type RawOrder = {
  id: string;
  customer_id: string | null;
  coupon_id: string | null;
  subtotal: number;
  discount_amount: number | null;
  total_amount: number;
  status: string | null;
  payment_id: string | null;
  created_at: string;
  order_type: string | null;
  metadata: any | null;
  customers: RawCustomer | RawCustomer[];
};

const VALID_STATUSES: OrderStatus[] = ["pending", "paid", "cancelled", "pendiente_pago"];

function sanitizeStatus(raw: string | null): OrderStatus | null {
  if (raw && (VALID_STATUSES as string[]).includes(raw)) return raw as OrderStatus;
  return null;
}

export default async function PedidosPage() {
  const supabase = await createClient();

  /* ── JOIN: orders → customers ── */
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
      status,
      payment_id,
      created_at,
      order_type,
      metadata,
      metodo_pago_manual,
      customers (
        company_name
      )
    `)
    .order("created_at", { ascending: false });

  /* ── Normalizar ── */
  const orders: OrderRow[] = ((rawData ?? []) as RawOrder[]).map((o) => {
    const cust = Array.isArray(o.customers)
      ? (o.customers[0] as RawCustomer)
      : (o.customers as RawCustomer);

    return {
      id: o.id,
      customer_id: o.customer_id,
      company_name: cust?.company_name ?? "Cliente desconocido",
      subtotal: o.subtotal,
      discount_amount: o.discount_amount,
      total_amount: o.total_amount,
      status: sanitizeStatus(o.status),
      coupon_id: o.coupon_id,
      payment_id: o.payment_id,
      created_at: o.created_at,
      order_type: o.order_type,
      metadata: o.metadata,
      metodo_pago_manual: (o as any).metodo_pago_manual,
    };
  });

  /* ── Conteos para el encabezado ── */
  const paid    = orders.filter((o) => o.status === "paid").length;
  const pending = orders.filter((o) => o.status === "pending" || o.status === "pendiente_pago").length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "hsl(var(--accent) / 0.15)",
            color: "hsl(var(--accent))",
          }}
        >
          <ShoppingBag size={20} />
        </div>
        <div>
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Pedidos
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {error
              ? "Error al cargar pedidos"
              : `${orders.length} pedido${orders.length !== 1 ? "s" : ""} · ✅ ${paid} pagado${paid !== 1 ? "s" : ""} · ⏳ ${pending} pendiente de pago`}
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
          Error cargando pedidos: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tabla dinámica ── */}
      {!error && <PedidosTable initialOrders={orders} />}
    </div>
  );
}
