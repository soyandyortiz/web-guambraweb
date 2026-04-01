export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { CuponesTable } from "@/components/admin/cupones/CuponesTable";
import { Ticket, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cupones | Admin — GuambraWeb",
  description: "Gestiona los cupones de descuento de la tienda.",
};

/* Tipo explícito para evitar la inferencia `never` del cliente genérico */
type RawCoupon = {
  id: string;
  code: string;
  discount_percent: number | null;
  is_active: boolean | null;
  valid_until: string | null;
  created_at: string;
};

export default async function CuponesPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("coupons")
    .select("id, code, discount_percent, is_active, valid_until, created_at")
    .order("created_at", { ascending: false });

  const coupons = (rawData ?? []) as RawCoupon[];

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
          <Ticket size={20} />
        </div>
        <div>
          <h2
            className="font-display font-bold text-xl"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Cupones
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {error
              ? "Error al cargar los cupones"
              : `${coupons.length} cupón${coupons.length !== 1 ? "es" : ""} registrado${coupons.length !== 1 ? "s" : ""}`}
          </p>
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
          Error cargando cupones: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tabla interactiva ── */}
      {!error && <CuponesTable initialCoupons={coupons} />}
    </div>
  );
}
