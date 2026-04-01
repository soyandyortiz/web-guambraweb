"use client";

import { useState, useTransition, useCallback, useOptimistic } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateAdmin } from "@/app/actions/admin";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Ticket,
  Percent,
  Calendar,
  AlertTriangle,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  Copy,
  CheckCheck,
} from "lucide-react";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type CouponRow = {
  id: string;
  code: string;
  discount_percent: number | null;
  is_active: boolean | null;
  valid_until: string | null;
  created_at: string;
};

type FormData = {
  code: string;
  discount_percent: string;
  valid_until: string;
  is_active: boolean;
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpired(validUntil: string | null): boolean {
  if (!validUntil) return false;
  return new Date(validUntil) < new Date();
}

type SortDir = "asc" | "desc" | null;
type SortKey = keyof Pick<CouponRow, "code" | "discount_percent" | "valid_until" | "created_at">;

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   SWITCH COMPONENT (sin dependencias externas)
───────────────────────────────────────── */
function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "44px",
        height: "24px",
        borderRadius: "9999px",
        padding: "2px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s, opacity 0.2s",
        background: checked ? "hsl(var(--success))" : "hsl(var(--muted))",
        opacity: disabled ? 0.6 : 1,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: "block",
          width: "20px",
          height: "20px",
          borderRadius: "9999px",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          transform: checked ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.2s",
        }}
      />
    </button>
  );
}

/* ─────────────────────────────────────────
   FILA CON SWITCH (optimistic UI)
───────────────────────────────────────── */
function CouponRow({
  coupon,
  idx,
  total,
  onEdit,
  onToggle,
  onDelete,
}: {
  coupon: CouponRow;
  idx: number;
  total: number;
  onEdit: (coupon: CouponRow) => void;
  onToggle: (id: string, newVal: boolean) => void;
  onDelete: (coupon: CouponRow) => void;
}) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(
    coupon.is_active ?? false
  );
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleToggle = (newVal: boolean) => {
    startTransition(async () => {
      setOptimisticActive(newVal);
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("coupons")
        .update({ is_active: newVal })
        .eq("id", coupon.id);
      if (!error) {
        await revalidateAdmin();
        onToggle(coupon.id, newVal);
      }
      // Si hay error el valor optimista se revertirá al rerenderizar
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const expired = isExpired(coupon.valid_until);

  return (
    <tr
      style={{
        borderBottom:
          idx < total - 1 ? "1px solid hsl(var(--border) / 0.5)" : "none",
        transition: "background 0.15s",
        opacity: expired && !optimisticActive ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background =
          "hsl(var(--muted) / 0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
      }}
    >
      {/* Código */}
      <td style={{ padding: "0.875rem 1rem" }}>
        <div className="flex items-center gap-2">
          <span
            className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg tracking-widest"
            style={{
              background: "hsl(var(--primary) / 0.12)",
              color: "hsl(var(--primary))",
              border: "1px solid hsl(var(--primary) / 0.25)",
            }}
          >
            {coupon.code}
          </span>
          <button
            onClick={handleCopy}
            title="Copiar código"
            style={{
              color: copied ? "hsl(var(--success))" : "hsl(var(--muted-foreground))",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              transition: "color 0.2s",
            }}
          >
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </td>

      {/* Descuento */}
      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
        {coupon.discount_percent != null ? (
          <span
            className="inline-flex items-center gap-1 font-semibold text-sm px-2.5 py-1 rounded-full"
            style={{
              background: "hsl(var(--warning) / 0.12)",
              color: "hsl(var(--warning))",
              border: "1px solid hsl(var(--warning) / 0.3)",
            }}
          >
            <Percent size={12} />
            {coupon.discount_percent}% OFF
          </span>
        ) : (
          <span style={{ color: "hsl(var(--muted-foreground))" }}>—</span>
        )}
      </td>

      {/* Válido hasta */}
      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
        {coupon.valid_until ? (
          <span
            className="inline-flex items-center gap-1.5 text-sm"
            style={{
              color: expired
                ? "hsl(var(--destructive))"
                : "hsl(var(--muted-foreground))",
              fontWeight: expired ? 600 : 400,
            }}
          >
            <Calendar size={13} />
            {formatDate(coupon.valid_until)}
            {expired && (
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: "hsl(var(--destructive) / 0.12)",
                  color: "hsl(var(--destructive))",
                }}
              >
                Vencido
              </span>
            )}
          </span>
        ) : (
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: "hsl(var(--success) / 0.12)",
              color: "hsl(var(--success))",
              border: "1px solid hsl(var(--success) / 0.25)",
            }}
          >
            Sin vencimiento
          </span>
        )}
      </td>

      {/* Creado */}
      <td
        style={{
          padding: "0.875rem 1rem",
          whiteSpace: "nowrap",
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.8125rem",
        }}
      >
        {formatDate(coupon.created_at)}
      </td>

      {/* Switch Activo */}
      <td style={{ padding: "0.875rem 1rem" }}>
        <div className="flex items-center gap-2.5">
          <Switch
            checked={optimisticActive}
            onChange={handleToggle}
            disabled={isPending}
          />
          <span
            className="text-xs font-medium"
            style={{
              color: optimisticActive
                ? "hsl(var(--success))"
                : "hsl(var(--muted-foreground))",
            }}
          >
            {optimisticActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </td>

      {/* Acciones */}
      <td style={{ padding: "0.875rem 1rem" }}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(coupon)}
            title="Editar cupón"
            className="p-2 rounded-lg transition-all duration-150"
            style={{ color: "hsl(var(--primary))" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "hsl(var(--primary) / 0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(coupon)}
            title="Eliminar cupón"
            className="p-2 rounded-lg transition-all duration-150"
            style={{ color: "hsl(var(--destructive))" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "hsl(var(--destructive) / 0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────
   ESTADO VACÍO
───────────────────────────────────────── */
function EmptyState({
  filtered,
  onNew,
}: {
  filtered: boolean;
  onNew: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "hsl(var(--muted))" }}
      >
        {filtered ? (
          <Filter size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
        ) : (
          <Ticket size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
        )}
      </div>
      <h3
        className="font-display font-semibold text-lg mb-1"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {filtered ? "Sin resultados" : "No hay cupones"}
      </h3>
      <p className="text-sm max-w-xs mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros de búsqueda."
          : "Aún no tienes cupones registrados. Crea el primero."}
      </p>
      {!filtered && (
        <button onClick={onNew} className="btn-primary btn-sm">
          <Plus size={14} />
          Nuevo Cupón
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL CREAR CUPÓN
───────────────────────────────────────── */
function CouponModal({
  mode,
  initialData,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initialData?: CouponRow | null;
  onClose: () => void;
  onSaved: (coupon: CouponRow) => void;
}) {
  const [form, setForm] = useState<FormData>({
    code: initialData?.code ?? "",
    discount_percent: initialData?.discount_percent?.toString() ?? "",
    valid_until: initialData?.valid_until ? initialData.valid_until.split("T")[0] : "",
    is_active: initialData?.is_active ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const code = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    set("code", code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.code.trim()) {
      setError("El código del cupón es obligatorio.");
      return;
    }
    const pct = form.discount_percent ? parseFloat(form.discount_percent) : null;
    if (pct !== null && (isNaN(pct) || pct <= 0 || pct > 100)) {
      setError("El descuento debe ser un número entre 1 y 100.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_percent: pct,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
      };

      if (mode === "create") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: err } = await (supabase as any)
          .from("coupons")
          .insert(payload)
          .select()
          .single();

        if (err || !data) {
          setError(err?.message ?? "Error al crear el cupón.");
          return;
        }
        await revalidateAdmin();
        onSaved(data as CouponRow);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: err } = await (supabase as any)
          .from("coupons")
          .update(payload)
          .eq("id", initialData!.id)
          .select()
          .single();

        if (err || !data) {
          setError(err?.message ?? "Error al actualizar el cupón.");
          return;
        }
        await revalidateAdmin();
        onSaved(data as CouponRow);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card animate-scale-in w-full max-w-md"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "hsl(var(--accent) / 0.15)",
                color: "hsl(var(--accent))",
              }}
            >
              <Ticket size={18} />
            </div>
            <h3
              className="font-display font-bold text-lg"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {mode === "create" ? "Nuevo Cupón" : "Editar Cupón"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
              style={{
                background: "hsl(var(--destructive) / 0.1)",
                border: "1px solid hsl(var(--destructive) / 0.3)",
                color: "hsl(var(--destructive))",
              }}
            >
              <AlertTriangle size={15} />
              {error}
            </div>
          )}

          {/* Código */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Código <span style={{ color: "hsl(var(--destructive))" }}>*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input uppercase"
                placeholder="Ej: PROMO20"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                maxLength={32}
                required
                style={{ letterSpacing: "0.1em", fontFamily: "monospace" }}
              />
              <button
                type="button"
                onClick={generateCode}
                className="btn-secondary btn-sm whitespace-nowrap"
                title="Generar código aleatorio"
              >
                Generar
              </button>
            </div>
          </div>

          {/* Descuento */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Descuento (%)
            </label>
            <div className="relative">
              <Percent
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
              <input
                type="number"
                className="input"
                style={{ paddingRight: "2rem" }}
                placeholder="Ej: 20"
                value={form.discount_percent}
                onChange={(e) => set("discount_percent", e.target.value)}
                min="1"
                max="100"
                step="1"
              />
            </div>
          </div>

          {/* Válido hasta */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Válido hasta{" "}
              <span
                className="text-xs ml-1"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                (opcional — deja vacío para sin vencimiento)
              </span>
            </label>
            <div className="relative">
              <Calendar
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
              <input
                type="date"
                className="input"
                style={{ paddingLeft: "2rem" }}
                value={form.valid_until}
                onChange={(e) => set("valid_until", e.target.value)}
              />
            </div>
          </div>

          {/* Toggle Activo */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
            style={{
              background: "hsl(var(--muted) / 0.5)",
              border: "1px solid hsl(var(--border))",
            }}
            onClick={() => set("is_active", !form.is_active)}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                Cupón Activo
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                Los cupones inactivos no se pueden canjear
              </p>
            </div>
            <Switch
              checked={form.is_active}
              onChange={(v) => set("is_active", v)}
            />
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner" style={{ width: "14px", height: "14px" }} />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={15} />
                  {mode === "create" ? "Crear Cupón" : "Guardar Cambios"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL ELIMINAR
───────────────────────────────────────── */
function DeleteModal({
  coupon,
  onClose,
  onDeleted,
}: {
  coupon: CouponRow;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("coupons")
        .delete()
        .eq("id", coupon.id);
      if (err) {
        setError(err.message);
        return;
      }
      await revalidateAdmin();
      onDeleted(coupon.id);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card animate-scale-in w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "hsl(var(--destructive) / 0.15)",
              color: "hsl(var(--destructive))",
            }}
          >
            <Trash2 size={20} />
          </div>
          <div>
            <h3
              className="font-display font-bold text-lg"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Eliminar Cupón
            </h3>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div
          className="px-4 py-3 rounded-xl text-sm flex items-center gap-3"
          style={{
            background: "hsl(var(--muted) / 0.5)",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        >
          <span
            className="font-mono font-bold px-2 py-0.5 rounded text-xs tracking-widest"
            style={{
              background: "hsl(var(--primary) / 0.12)",
              color: "hsl(var(--primary))",
            }}
          >
            {coupon.code}
          </span>
          ¿Confirmas la eliminación de este cupón?
        </div>

        {error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
            style={{
              background: "hsl(var(--destructive) / 0.1)",
              border: "1px solid hsl(var(--destructive) / 0.3)",
              color: "hsl(var(--destructive))",
            }}
          >
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1" disabled={isPending}>
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="btn-destructive flex-1"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span
                  className="spinner"
                  style={{
                    width: "14px",
                    height: "14px",
                    borderColor: "rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                  }}
                />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
type Props = { initialCoupons: CouponRow[] };

export function CuponesTable({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState<CouponRow[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "expired">(
    "all"
  );
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showCreate, setShowCreate] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRow | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponRow | null>(null);

  const onSaved = useCallback((saved: CouponRow) => {
    setCoupons((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setShowCreate(false);
    setEditingCoupon(null);
  }, []);

  /* ── Filtrar ── */
  const filtered = coupons.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.code.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? c.is_active === true
        : statusFilter === "inactive"
        ? c.is_active !== true
        : isExpired(c.valid_until);
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
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function getSortDir(key: SortKey): SortDir {
    return sortKey !== key ? null : sortDir;
  }

  const onDeleted = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeletingCoupon(null);
  }, []);

  const handleToggle = useCallback((id: string, newVal: boolean) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: newVal } : c))
    );
  }, []);

  /* ── Stats ── */
  const totalActive = coupons.filter((c) => c.is_active).length;
  const totalInactive = coupons.filter((c) => !c.is_active).length;
  const totalExpired = coupons.filter((c) => isExpired(c.valid_until)).length;

  const FILTER_PILLS = [
    { key: "all" as const,      label: "Todos",    value: coupons.length,  color: "var(--primary)" },
    { key: "active" as const,   label: "Activos",  value: totalActive,     color: "var(--success)" },
    { key: "inactive" as const, label: "Inactivos",value: totalInactive,   color: "var(--muted-foreground)" },
    { key: "expired" as const,  label: "Vencidos", value: totalExpired,    color: "var(--destructive)" },
  ];

  return (
    <>
      {/* ── Modals ── */}
      {(showCreate || editingCoupon) && (
        <CouponModal
          mode={editingCoupon ? "edit" : "create"}
          initialData={editingCoupon}
          onClose={() => {
            setShowCreate(false);
            setEditingCoupon(null);
          }}
          onSaved={onSaved}
        />
      )}
      {deletingCoupon && (
        <DeleteModal
          coupon={deletingCoupon}
          onClose={() => setDeletingCoupon(null)}
          onDeleted={onDeleted}
        />
      )}

      <div className="space-y-4">
        {/* ── Stat Pills ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FILTER_PILLS.map(({ key, label, value, color }) => {
            const active = statusFilter === key;
            const cssVar = color.replace("var(", "").replace(")", "");
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(active && key !== "all" ? "all" : key)}
                className="text-left p-3 rounded-xl border transition-all duration-150"
                style={{
                  background: active
                    ? `hsl(${cssVar} / 0.12)`
                    : "hsl(var(--card))",
                  borderColor: active
                    ? `hsl(${cssVar} / 0.4)`
                    : "hsl(var(--border))",
                }}
              >
                <div
                  className="text-2xl font-display font-bold"
                  style={{ color: `hsl(${cssVar})` }}
                >
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Controles ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
            style={{
              background: "hsl(var(--input))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              type="text"
              placeholder="Buscar por código..."
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
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary btn-sm whitespace-nowrap"
          >
            <Plus size={14} />
            Nuevo Cupón
          </button>
        </div>

        {/* ── Tabla ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid hsl(var(--border))" }}
        >
          {sorted.length === 0 ? (
            <EmptyState
              filtered={search !== "" || statusFilter !== "all"}
              onNew={() => setShowCreate(true)}
            />
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
                      { key: "code" as SortKey,             label: "Código" },
                      { key: "discount_percent" as SortKey, label: "Descuento" },
                      { key: "valid_until" as SortKey,      label: "Válido hasta" },
                      { key: "created_at" as SortKey,       label: "Creado" },
                      { key: null,                          label: "Estado" },
                      { key: null,                          label: "" },
                    ].map(({ key, label }) => (
                      <th
                        key={label || "__actions"}
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
                  {sorted.map((coupon, idx) => (
                    <CouponRow
                      key={coupon.id}
                      coupon={coupon}
                      idx={idx}
                      total={sorted.length}
                      onEdit={(c) => setEditingCoupon(c)}
                      onToggle={handleToggle}
                      onDelete={(c) => setDeletingCoupon(c)}
                    />
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
                Mostrando {sorted.length} de {coupons.length} cupón
                {coupons.length !== 1 ? "es" : ""}
              </span>
              <span>
                Ordenado por{" "}
                <strong style={{ color: "hsl(var(--foreground))" }}>{sortKey}</strong>{" "}
                ({sortDir === "asc" ? "↑ ascendente" : "↓ descendente"})
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
