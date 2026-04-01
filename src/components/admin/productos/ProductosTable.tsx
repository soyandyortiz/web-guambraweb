"use client";

import { useState, useTransition, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateAdmin } from "@/app/actions/admin";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  AlertTriangle,
  Check,
  ImageIcon,
  Cpu,
  Layers,
  History,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { ImageUploader } from "./ImageUploader";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean | null;
  image_url: string | null;
  images: string[] | null;
  created_at: string;
  category_id: string | null;
  categories?: { name: string } | null;
  technologies?: string[] | null;
  features?: string[] | null;
  versions?: { version: string; changes: string[] }[] | null;
};

export type SimpleCategory = {
  id: string;
  name: string;
  parent_id: string | null;
};

type FormData = {
  name: string;
  description: string;
  price: string;
  images: string[];      // array de hasta 5 URLs
  is_active: boolean;
  technologies: string[];
  features: string[];
  versions: { version: string; changes: string[] }[];
};

const INITIAL_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  images: [],
  is_active: true,
  technologies: [],
  features: [],
  versions: [],
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
type SortKey = keyof Pick<ProductRow, "name" | "price" | "is_active" | "created_at">;

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   BADGE DE ESTADO
───────────────────────────────────────── */
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
          <Package size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
        )}
      </div>
      <h3
        className="font-display font-semibold text-lg mb-1"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {filtered ? "Sin resultados" : "No hay productos"}
      </h3>
      <p className="text-sm max-w-xs mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros de búsqueda o estado."
          : "Aún no tienes productos registrados. Crea el primero."}
      </p>
      {!filtered && (
        <button onClick={onNew} className="btn-primary btn-sm">
          <Plus size={14} />
          Nuevo Producto
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL DE FORMULARIO (Crear / Editar)
───────────────────────────────────────── */
function ProductModal({
  mode,
  initialData,
  categories,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initialData: (Partial<ProductRow> & { id?: string }) | null;
  categories: SimpleCategory[];
  onClose: () => void;
  onSaved: (product: ProductRow) => void;
}) {
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price != null ? String(initialData.price) : "",
    images: initialData?.images ?? (initialData?.image_url ? [initialData.image_url] : []),
    is_active: initialData?.is_active ?? true,
    technologies: initialData?.technologies ?? [],
    features: initialData?.features ?? [],
    versions: initialData?.versions ?? [],
  });

  const [mainCategoryId, setMainCategoryId] = useState<string>(() => {
    if (!initialData?.category_id) return "";
    const cat = categories.find(c => c.id === initialData?.category_id);
    if (!cat) return "";
    return cat.parent_id ? cat.parent_id : cat.id;
  });

  const [subCategoryId, setSubCategoryId] = useState<string>(() => {
    if (!initialData?.category_id) return "";
    const cat = categories.find(c => c.id === initialData?.category_id);
    if (!cat) return "";
    return cat.parent_id ? cat.id : "";
  });

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("El precio debe ser un número válido mayor o igual a 0.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      let finalCategoryId: string | null = null;
      if (subCategoryId) {
        finalCategoryId = subCategoryId;
      } else if (mainCategoryId) {
        finalCategoryId = mainCategoryId;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: priceNum,
        images: form.images,
        image_url: form.images[0] ?? null,   // retrocompatibilidad: primera imagen como principal
        is_active: form.is_active,
        category_id: finalCategoryId,
        technologies: form.technologies,
        features: form.features,
        versions: form.versions,
      };

      if (mode === "create") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: err } = await (supabase as any)
          .from("products")
          .insert(payload)
          .select("*, categories(name)")
          .single();
        if (err || !data) {
          setError(err?.message ?? "Error al crear el producto.");
          return;
        }
        await revalidateAdmin();
        onSaved(data as ProductRow);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: err } = await (supabase as any)
          .from("products")
          .update(payload)
          .eq("id", initialData!.id!)
          .select("*, categories(name)")
          .single();
        if (err || !data) {
          setError(err?.message ?? "Error al actualizar el producto.");
          return;
        }
        await revalidateAdmin();
        onSaved(data as ProductRow);
      }
    });
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div
        className="card animate-scale-in w-full max-w-lg"
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
                background: "hsl(var(--primary) / 0.15)",
                color: "hsl(var(--primary))",
              }}
            >
              <Package size={18} />
            </div>
            <h3
              className="font-display font-bold text-lg"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
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
          {/* Error banner */}
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

          {/* Nombre */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Nombre <span style={{ color: "hsl(var(--destructive))" }}>*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ej: Tienda Online Básica"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              maxLength={120}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Descripción
            </label>
            <textarea
              className="input text-sm"
              placeholder="Breve resumen del producto..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              style={{ resize: "vertical", minHeight: "60px" }}
            />
          </div>

          {/* Tecnologías */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
                <Cpu size={14} className="text-primary" />
                Tecnologías
              </label>
              <button
                type="button"
                className="text-xs text-primary font-medium hover:underline"
                onClick={() => setForm(p => ({ ...p, technologies: [...p.technologies, ""] }))}
              >
                + Agregar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {form.technologies.map((tech, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input
                    type="text"
                    className="input text-xs py-1 px-2 h-8"
                    placeholder="Ej: Next.js"
                    value={tech}
                    onChange={(e) => {
                      const next = [...form.technologies];
                      next[idx] = e.target.value;
                      setForm(p => ({ ...p, technologies: next }));
                    }}
                  />
                  <button
                    type="button"
                    className="p-1 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setForm(p => ({ ...p, technologies: p.technologies.filter((_, i) => i !== idx) }));
                    }}
                  >
                    <MinusCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Características */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
                <Layers size={14} className="text-primary" />
                Características
              </label>
              <button
                type="button"
                className="text-xs text-primary font-medium hover:underline"
                onClick={() => setForm(p => ({ ...p, features: [...p.features, ""] }))}
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input text-sm py-1 px-3 h-9"
                    placeholder="Ej: Dashboard interactivo"
                    value={feature}
                    onChange={(e) => {
                      const next = [...form.features];
                      next[idx] = e.target.value;
                      setForm(p => ({ ...p, features: next }));
                    }}
                  />
                  <button
                    type="button"
                    className="p-1 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setForm(p => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));
                    }}
                  >
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Versiones y Cambios */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
                <History size={14} className="text-primary" />
                Versiones y Cambios
              </label>
              <button
                type="button"
                className="btn-ghost text-xs h-7 px-2"
                onClick={() => setForm(p => ({ 
                  ...p, 
                  versions: [{ version: "", changes: [""] }, ...p.versions] 
                }))}
              >
                <Plus size={12} className="mr-1" /> Nueva Versión
              </button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {form.versions.map((v, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-muted/30 space-y-2 relative group">
                   <button
                    type="button"
                    className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setForm(p => ({ ...p, versions: p.versions.filter((_, i) => i !== idx) }));
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground px-1.5 py-0.5 border rounded">VER</span>
                    <input
                      type="text"
                      className="bg-transparent font-bold text-sm outline-none border-b border-transparent focus:border-primary/30 w-full"
                      placeholder="Ej: 1.0.0"
                      value={v.version}
                      onChange={(e) => {
                        const next = [...form.versions];
                        next[idx].version = e.target.value;
                        setForm(p => ({ ...p, versions: next }));
                      }}
                    />
                  </div>
                  <div className="space-y-1 pl-2 border-l-2 border-primary/20 ml-1">
                    {v.changes.map((change, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                        <input
                          type="text"
                          className="bg-transparent text-xs outline-none flex-1 border-b border-transparent focus:border-primary/20"
                          placeholder="Cambio realizado..."
                          value={change}
                          onChange={(e) => {
                            const next = [...form.versions];
                            next[idx].changes[cIdx] = e.target.value;
                            setForm(p => ({ ...p, versions: next }));
                          }}
                        />
                        <button
                          type="button"
                          className="p-1 text-muted-foreground/50 hover:text-destructive"
                          onClick={() => {
                            const next = [...form.versions];
                            next[idx].changes = next[idx].changes.filter((_, i) => i !== cIdx);
                            setForm(p => ({ ...p, versions: next }));
                          }}
                        >
                          <MinusCircle size={10} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-[10px] text-primary/70 hover:text-primary mt-1 font-medium"
                      onClick={() => {
                        const next = [...form.versions];
                        next[idx].changes.push("");
                        setForm(p => ({ ...p, versions: next }));
                      }}
                    >
                      + Añadir cambio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Precio (USD) <span style={{ color: "hsl(var(--destructive))" }}>*</span>
            </label>
            <div className="relative">
              <DollarSign
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              />
              <input
                type="number"
                className="input"
                style={{ paddingLeft: "2rem" }}
                placeholder="0.00"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Imágenes — subida + URL */}
          <ImageUploader
            value={form.images}
            onChange={(urls) => setForm((p) => ({ ...p, images: urls }))}
            disabled={isPending}
          />

          {/* Categoría y Subcategoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Categoría Principal
              </label>
              <select
                className="input"
                value={mainCategoryId}
                onChange={(e) => {
                  setMainCategoryId(e.target.value);
                  setSubCategoryId("");
                }}
              >
                <option value="">Ninguna</option>
                {categories.filter(c => !c.parent_id).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {mainCategoryId && categories.some(c => c.parent_id === mainCategoryId) && (
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Subcategoría
                </label>
                <select
                  className="input"
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                >
                  <option value="">Seleccionar (opcional)...</option>
                  {categories.filter(c => c.parent_id === mainCategoryId).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Estado Activo */}
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
                Producto Activo
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                Los productos inactivos no aparecen en la tienda
              </p>
            </div>
            {form.is_active ? (
              <ToggleRight size={28} style={{ color: "hsl(var(--success))", flexShrink: 0 }} />
            ) : (
              <ToggleLeft size={28} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
            )}
          </div>

          {/* Acciones del formulario */}
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
                  {mode === "create" ? "Crear Producto" : "Guardar Cambios"}
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
   MODAL DE CONFIRMACIÓN: Eliminar
───────────────────────────────────────── */
function DeleteModal({
  product,
  onClose,
  onDeleted,
}: {
  product: ProductRow;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);
      if (err) {
        setError(err.message);
        return;
      }
      await revalidateAdmin();
      onDeleted(product.id);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card animate-scale-in w-full max-w-md p-6 space-y-4">
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
              Eliminar Producto
            </h3>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{
            background: "hsl(var(--muted) / 0.5)",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        >
          ¿Confirmas que deseas eliminar{" "}
          <strong>&quot;{product.name}&quot;</strong>?
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
            {isPending ? (
              <>
                <span className="spinner" style={{ width: "14px", height: "14px", borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
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
   COMPONENTE PRINCIPAL: ProductosTable
───────────────────────────────────────── */
type Props = { 
  initialProducts: ProductRow[];
  categories: SimpleCategory[]; 
};

export function ProductosTable({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductRow | null>(null);

  /* ── Filtrar ── */
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.is_active === true
        : p.is_active !== true;
    return matchSearch && matchStatus;
  });

  /* ── Ordenar ── */
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = String(av).localeCompare(String(bv));
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
    if (sortKey !== key) return null;
    return sortDir;
  }

  /* ── Callbacks de sincronización ── */
  const onSaved = useCallback((saved: ProductRow) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModalMode(null);
    setEditingProduct(null);
  }, []);

  const onDeleted = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingProduct(null);
  }, []);

  /* ── Stats rápidas ── */
  const totalActive = products.filter((p) => p.is_active).length;
  const totalInactive = products.filter((p) => !p.is_active).length;

  return (
    <>
      {/* ── Modals ── */}
      {modalMode && (
        <ProductModal
          mode={modalMode}
          initialData={editingProduct}
          categories={categories}
          onClose={() => {
            setModalMode(null);
            setEditingProduct(null);
          }}
          onSaved={onSaved}
        />
      )}
      {deletingProduct && (
        <DeleteModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={onDeleted}
        />
      )}

      <div className="space-y-4">
        {/* ── Stat Pills ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: products.length,
              color: "var(--primary)",
              active: statusFilter === "all",
              onClick: () => setStatusFilter("all"),
            },
            {
              label: "Activos",
              value: totalActive,
              color: "var(--success)",
              active: statusFilter === "active",
              onClick: () => setStatusFilter(statusFilter === "active" ? "all" : "active"),
            },
            {
              label: "Inactivos",
              value: totalInactive,
              color: "var(--destructive)",
              active: statusFilter === "inactive",
              onClick: () => setStatusFilter(statusFilter === "inactive" ? "all" : "inactive"),
            },
          ].map(({ label, value, color, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="text-left p-3 rounded-xl border transition-all duration-150"
              style={{
                background: active
                  ? `hsl(${color.replace("var(", "").replace(")", "")} / 0.12)`
                  : "hsl(var(--card))",
                borderColor: active
                  ? `hsl(${color.replace("var(", "").replace(")", "")} / 0.4)`
                  : "hsl(var(--border))",
              }}
            >
              <div
                className="text-2xl font-display font-bold"
                style={{ color: `hsl(${color.replace("var(", "").replace(")", "")})` }}
              >
                {value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {label}
              </div>
            </button>
          ))}
        </div>

        {/* ── Controles ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
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
              placeholder="Buscar por nombre o descripción..."
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

          {/* Botón Nuevo */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setModalMode("create");
            }}
            className="btn-primary btn-sm whitespace-nowrap"
          >
            <Plus size={14} />
            Nuevo Producto
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
              onNew={() => setModalMode("create")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table
                style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}
              >
                {/* ── THEAD ── */}
                <thead>
                  <tr
                    style={{
                      background: "hsl(var(--muted))",
                      borderBottom: "1px solid hsl(var(--border))",
                    }}
                  >
                    {[
                      { key: "name" as SortKey, label: "Producto" },
                      { key: null, label: "Categoría" },
                      { key: "price" as SortKey, label: "Precio" },
                      { key: "is_active" as SortKey, label: "Estado" },
                      { key: "created_at" as SortKey, label: "Creado" },
                      { key: null, label: "Acciones" },
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

                {/* ── TBODY ── */}
                <tbody>
                  {sorted.map((product, idx) => (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom:
                          idx < sorted.length - 1
                            ? "1px solid hsl(var(--border) / 0.5)"
                            : "none",
                        transition: "background 0.15s",
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
                      {/* Producto */}
                      <td style={{ padding: "0.875rem 1rem", maxWidth: "280px" }}>
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                            style={{
                              background: product.image_url
                                ? "transparent"
                                : "hsl(var(--muted))",
                              border: "1px solid hsl(var(--border))",
                            }}
                          >
                            {product.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.image_url}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Package
                                size={16}
                                style={{ color: "hsl(var(--muted-foreground))" }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div
                              className="font-semibold truncate"
                              style={{ color: "hsl(var(--foreground))" }}
                              title={product.name}
                            >
                              {product.name}
                            </div>
                            {product.description && (
                              <div
                                className="text-xs truncate mt-0.5"
                                style={{ color: "hsl(var(--muted-foreground))" }}
                                title={product.description}
                              >
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td
                        style={{
                          padding: "0.875rem 1rem",
                          whiteSpace: "nowrap",
                          color: "hsl(var(--muted-foreground))",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {product.categories?.name || "-"}
                      </td>

                      {/* Precio */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <span
                          className="font-semibold font-mono"
                          style={{ color: "hsl(var(--success))" }}
                        >
                          {formatPrice(product.price)}
                        </span>
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <StatusBadge active={product.is_active} />
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
                        {new Date(product.created_at).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                        <div className="flex items-center gap-1.5">
                          {/* Editar */}
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setModalMode("edit");
                            }}
                            className="p-2 rounded-lg transition-all duration-150"
                            title="Editar"
                            style={{ color: "hsl(var(--primary))" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "hsl(var(--primary) / 0.12)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "transparent";
                            }}
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-2 rounded-lg transition-all duration-150"
                            title="Eliminar"
                            style={{ color: "hsl(var(--destructive))" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "hsl(var(--destructive) / 0.12)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "transparent";
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Footer ── */}
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
                Mostrando {sorted.length} de {products.length} producto
                {products.length !== 1 ? "s" : ""}
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
