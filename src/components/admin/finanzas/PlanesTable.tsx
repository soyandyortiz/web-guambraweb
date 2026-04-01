"use client";

import { useState, useTransition } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Tags,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  AlertTriangle,
  Check,
  PlusCircle,
  MinusCircle,
  Calendar,
} from "lucide-react";
import {
  saveSubscriptionPlan,
  deleteSubscriptionPlan,
  togglePlanStatus,
} from "@/app/actions/subscription-plans";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type PlanRow = {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  features: any; // Cambiado a any para soportar el tipo Json de Supabase
  is_active: boolean | null;
  created_at: string | null;
};

type FormData = {
  name: string;
  description: string;
  price_monthly: string;
  features: string[];
  is_active: boolean;
};

const INITIAL_FORM: FormData = {
  name: "",
  description: "",
  price_monthly: "",
  features: [],
  is_active: true,
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatPrice(price: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

type SortDir = "asc" | "desc" | null;
type SortKey = keyof Pick<
  PlanRow,
  "name" | "price_monthly" | "is_active" | "created_at"
>;

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

function StatusBadge({ active }: { active: boolean | null }) {
  return active ? (
    <span className="badge-success" style={{ whiteSpace: "nowrap" }}>
      <span
        className="w-1.5 h-1.5 rounded-full inline-block mr-1"
        style={{ background: "hsl(var(--success))" }}
      />
      Activo
    </span>
  ) : (
    <span className="badge-destructive" style={{ whiteSpace: "nowrap" }}>
      <span
        className="w-1.5 h-1.5 rounded-full inline-block mr-1"
        style={{ background: "hsl(var(--destructive))" }}
      />
      Inactivo
    </span>
  );
}

/* ─────────────────────────────────────────
   COMPONENTES
───────────────────────────────────────── */
export function PlanesTable({ initialData }: { initialData: PlanRow[] }) {
  const [plans, setPlans] = useState<PlanRow[]>(initialData);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Modales
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanRow | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  const filteredPlans = plans
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortDir) return 0;
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA == null || valB == null) return 0;
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const handleToggleStatus = async (plan: PlanRow) => {
    try {
      await togglePlanStatus(plan.id, !!plan.is_active);
      setPlans((prev) =>
        prev.map((p) =>
          p.id === plan.id ? { ...p, is_active: !plan.is_active } : p,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Error al cambiar el estado.");
    }
  };

  return (
    <div className="card animate-fade-in overflow-hidden">
      {/* ToolBar */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-6 border-b"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar planes..."
            className="input pl-10 text-sm h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn-primary w-full sm:w-auto h-10 px-4"
          onClick={() => setModalMode("create")}
        >
          <Plus size={16} />
          Nuevo Plan
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="bg-muted/30 text-[11px] uppercase tracking-wider font-bold"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <th className="px-6 py-4 border-b">Plan</th>
              <th className="px-6 py-4 border-b">Mensual/Anual</th>
              <th className="px-6 py-4 border-b">Estado</th>
              <th className="px-6 py-4 border-b">Creado</th>
              <th className="px-6 py-4 border-b text-right">Acciones</th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {filteredPlans.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-20 text-center text-muted-foreground text-sm"
                >
                  No se encontraron planes.
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-6 py-4 min-w-[200px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{plan.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {plan.description || "Sin descripción"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-primary">
                        {formatPrice(plan.price_monthly)} / mes reg.
                      </span>
                      <span className="text-xs text-success font-bold">
                        {formatPrice(plan.price_monthly * 0.4)} / mes promo (12m)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge active={plan.is_active} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={plan.is_active ? "Desactivar" : "Activar"}
                      >
                        {plan.is_active ? (
                          <ToggleRight className="text-success" size={20} />
                        ) : (
                          <ToggleLeft
                            className="text-muted-foreground"
                            size={20}
                          />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setModalMode("edit");
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowDelete(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modalMode && (
        <PlanModal
          mode={modalMode}
          initialData={selectedPlan}
          onClose={() => {
            setModalMode(null);
            setSelectedPlan(null);
          }}
          onSaved={(updated) => {
            if (modalMode === "create") setPlans((p) => [updated, ...p]);
            else
              setPlans((p) =>
                p.map((x) => (x.id === updated.id ? updated : x)),
              );
            setModalMode(null);
            setSelectedPlan(null);
          }}
        />
      )}

      {showDelete && selectedPlan && (
        <DeleteModal
          plan={selectedPlan}
          onClose={() => {
            setShowDelete(false);
            setSelectedPlan(null);
          }}
          onDeleted={(id) => {
            setPlans((p) => p.filter((x) => x.id !== id));
            setShowDelete(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
}

function PlanModal({
  mode,
  initialData,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initialData: PlanRow | null;
  onClose: () => void;
  onSaved: (plan: PlanRow) => void;
}) {
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price_monthly:
      initialData?.price_monthly != null
        ? String(initialData.price_monthly)
        : "",
    features: initialData?.features ?? [],
    is_active: initialData?.is_active ?? true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pm = parseFloat(form.price_monthly);

    if (!form.name.trim()) return setError("El nombre es requerido.");
    if (isNaN(pm) || pm < 0)
      return setError("El precio mensual debe ser válido.");

    startTransition(async () => {
      try {
        const payload = {
          ...form,
          price_monthly: pm,
          price_yearly: pm * 0.4 * 12, // Se guarda el calculado por si se usa en otros reportes, pero la UI manda el mensual
          features: form.features.filter((f) => f.trim() !== ""), // Limpiar vacíos
        };

        // El action maneja si es create o update enviando el ID si existe
        // Pero aquí necesitamos el objeto completo devuelto para actualizar el estado local
        // Por simplicidad en el componente, el action de save hará el trabajo pesado.
        // Como el action no devuelve el objeto (en mi implementation previa), lo fetchamos.

        await saveSubscriptionPlan(
          initialData?.id ? { id: initialData.id, ...payload } : payload,
        );

        // Recargar o inventar el objeto para el estado local
        onSaved({
          id: initialData?.id ?? Math.random().toString(), // El real vendrá por revalidate pero esto ayuda a la UI reactiva
          ...payload,
          created_at: initialData?.created_at ?? new Date().toISOString(),
        } as PlanRow);
      } catch (err: any) {
        setError(err.message || "Error al guardar el plan.");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <Tags size={18} />
            </div>
            <h3 className="font-display font-bold text-lg">
              {mode === "create" ? "Nuevo Plan" : "Editar Plan"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nombre del Plan</label>
            <input
              type="text"
              className="input"
              placeholder="Ej: Platinum"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              className="input min-h-[80px] py-2 text-sm"
              placeholder="Resumen del plan..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-primary">
              Precio Mensual Base (USD)
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={14}
              />
              <input
                type="number"
                step="0.01"
                className="input pl-8"
                placeholder="0.00"
                value={form.price_monthly}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price_monthly: e.target.value }))
                }
                required
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Al ingresar el precio mensual, el sistema calculará automáticamente las ofertas de 6, 12 y 24 meses usando el modelo Hostinger.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Check size={14} className="text-primary" /> Características
              </label>
              <button
                type="button"
                className="text-xs text-primary font-bold hover:underline"
                onClick={() =>
                  setForm((f) => ({ ...f, features: [...f.features, ""] }))
                }
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {form.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    className="input text-xs h-9"
                    placeholder="Beneficio del plan..."
                    value={feat}
                    onChange={(e) => {
                      const n = [...form.features];
                      n[idx] = e.target.value;
                      setForm((f) => ({ ...f, features: n }));
                    }}
                  />
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        features: f.features.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border cursor-pointer"
            onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
          >
            <div>
              <p className="text-sm font-semibold">Plan Activo</p>
              <p className="text-[10px] text-muted-foreground">
                Los planes inactivos no pueden ser seleccionados en checkout.
              </p>
            </div>
            {form.is_active ? (
              <ToggleRight className="text-success" size={28} />
            ) : (
              <ToggleLeft className="text-muted-foreground" size={28} />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 bg-primary text-white"
              disabled={isPending}
            >
              {isPending
                ? "Guardando..."
                : mode === "create"
                  ? "Crear Plan"
                  : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({
  plan,
  onClose,
  onDeleted,
}: {
  plan: PlanRow;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteSubscriptionPlan(plan.id);
        onDeleted(plan.id);
      } catch (err: any) {
        setError(err.message || "Error al eliminar el plan.");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md p-6 animate-scale-in space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Eliminar Plan</h3>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg text-sm italic">
          ¿Seguro que deseas eliminar el plan{" "}
          <strong>&quot;{plan.name}&quot;</strong>?
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-ghost flex-1"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="btn-destructive flex-1"
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
