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
  AlertTriangle,
  Check,
  Tags,
  Filter,
  CornerDownRight
} from "lucide-react";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type FormData = {
  name: string;
  slug: string;
  parent_id: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  slug: "",
  parent_id: "",
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Reemplazar espacios por -
    .replace(/[^\w\-]+/g, "")    // Remover caracteres no alfanuméricos (excepto -)
    .replace(/\-\-+/g, "-");     // Reemplazar múltiples - por uno solo
}

/* Obtener todos los hijos/descendientes recursivamente */
function getDescendants(categoryId: string, categories: CategoryRow[]): string[] {
  const children = categories.filter((c) => c.parent_id === categoryId);
  let desc = [...children.map((c) => c.id)];
  for (const child of children) {
    desc = [...desc, ...getDescendants(child.id, categories)];
  }
  return desc;
}

/* Construir árbol plano para mostrar en la tabla */
function buildTree(categories: CategoryRow[], parentId: string | null = null, level = 0): (CategoryRow & { level: number })[] {
  let result: (CategoryRow & { level: number })[] = [];
  const children = categories
    .filter((c) => c.parent_id === parentId)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  for (const child of children) {
    result.push({ ...child, level });
    result = result.concat(buildTree(categories, child.id, level + 1));
  }
  return result;
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
          <Tags size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
        )}
      </div>
      <h3
        className="font-display font-semibold text-lg mb-1"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {filtered ? "Sin resultados" : "No hay categorías"}
      </h3>
      <p className="text-sm max-w-xs mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros de búsqueda."
          : "Aún no tienes categorías registradas. Crea la primera."}
      </p>
      {!filtered && (
        <button onClick={onNew} className="btn-primary btn-sm">
          <Plus size={14} />
          Nueva Categoría
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL DE FORMULARIO (Crear / Editar)
───────────────────────────────────────── */
function CategoryModal({
  mode,
  initialData,
  categories,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initialData: (Partial<CategoryRow> & { id?: string }) | null;
  categories: CategoryRow[];
  onClose: () => void;
  onSaved: (category: CategoryRow) => void;
}) {
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    parent_id: initialData?.parent_id ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  // Autogenerar slug si el usuario cambia el nombre y el slug estaba vacío
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setForm((p) => ({
      ...p,
      name: newName,
      slug: mode === "create" || p.slug === slugify(p.name) ? slugify(newName) : p.slug,
    }));
  };

  // Prevenir ciclos: no permitir asignar como padre a sí mismo ni a sus descendientes
  const descendants = initialData?.id ? getDescendants(initialData.id, categories) : [];
  const availableParents = categories.filter(
    (c) => c.id !== initialData?.id && !descendants.includes(c.id)
  );

  // Construir el árbol de opciones para padres respetando la jerarquía
  const parentOptionsTree = buildTree(availableParents);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const safeName = form.name.trim();
    const safeSlug = slugify(form.slug || safeName);

    if (!safeName) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!safeSlug) {
      setError("El slug no puede estar vacío.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const payload = {
        name: safeName,
        slug: safeSlug,
        parent_id: form.parent_id || null,
      };

      if (mode === "create") {
        const { data, error: err } = await supabase
          .from("categories")
          .insert(payload)
          .select()
          .single();
        if (err || !data) {
          setError(err?.message ?? "Error al crear la categoría.");
          return;
        }
        await revalidateAdmin();
        onSaved(data);
      } else {
        const { data, error: err } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", initialData!.id!)
          .select()
          .single();
        if (err || !data) {
          setError(err?.message ?? "Error al actualizar la categoría.");
          return;
        }
        await revalidateAdmin();
        onSaved(data);
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
        className="card animate-scale-in w-full max-w-lg"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
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
              <Tags size={18} />
            </div>
            <h3
              className="font-display font-bold text-lg"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {mode === "create" ? "Nueva Categoría" : "Editar Categoría"}
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
              placeholder="Ej: Laptops"
              value={form.name}
              onChange={handleNameChange}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Slug <span style={{ color: "hsl(var(--destructive))" }}>*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="ej-laptops"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              maxLength={150}
              required
            />
            <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              Identificador único para la URL (solo letras, números y guiones).
            </p>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Categoría Padre
            </label>
            <select
              className="input w-full"
              value={form.parent_id}
              onChange={(e) => set("parent_id", e.target.value)}
            >
              <option value="">-- Ninguna (Categoría Principal) --</option>
              {parentOptionsTree.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {"\u00A0\u00A0".repeat(cat.level)}
                  {cat.level > 0 ? "└─ " : ""}
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
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
                  {mode === "create" ? "Crear Categoría" : "Guardar Cambios"}
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
  category,
  onClose,
  onDeleted,
}: {
  category: CategoryRow;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      
      // Validar que no tenga productos asociados
      const { count, error: countErr } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id);

      if (countErr) {
        setError(countErr.message);
        return;
      }

      if ((count ?? 0) > 0) {
        setError(`No se puede eliminar porque tiene ${count} producto(s) asociado(s). Por favor, reasigna los productos primero.`);
        return;
      }

      const { error: err } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);

      if (err) {
        setError(err.message);
        return;
      }
      
      await revalidateAdmin();
      onDeleted(category.id);
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
              Eliminar Categoría
            </h3>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Esta acción eliminará la categoría para siempre.
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
          <strong>&quot;{category.name}&quot;</strong>?
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
            <AlertTriangle size={15} className="flex-shrink-0" />
            <span>{error}</span>
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
                Verificando y Eliminando...
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
   COMPONENTE PRINCIPAL: CategoriasTable
───────────────────────────────────────── */
export function CategoriasTable({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryRow | null>(null);

  /* ── Preparar Jerarquía ── */
  // Si hay búsqueda, aplanamos un poco la tabla solo filtrando
  let displayRows: (CategoryRow & { level?: number })[] = [];
  
  if (search.trim()) {
    const q = search.toLowerCase();
    displayRows = categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  } else {
    displayRows = buildTree(categories);
  }

  /* ── Callbacks de sincronización ── */
  const onSaved = useCallback((saved: CategoryRow) => {
    setCategories((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModalMode(null);
    setEditingCategory(null);
  }, []);

  const onDeleted = useCallback((id: string) => {
    // Si elimina un padre, también desaparecen los hijos cascada en BD, así que limpiamos a los hijos en estado.
    setCategories((prev) => {
      const descendants = getDescendants(id, prev);
      const toRemove = new Set([id, ...descendants]);
      return prev.filter((p) => !toRemove.has(p.id));
    });
    setDeletingCategory(null);
  }, []);

  return (
    <>
      {modalMode && (
        <CategoryModal
          mode={modalMode}
          initialData={editingCategory}
          categories={categories}
          onClose={() => {
            setModalMode(null);
            setEditingCategory(null);
          }}
          onSaved={onSaved}
        />
      )}
      {deletingCategory && (
        <DeleteModal
          category={deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onDeleted={onDeleted}
        />
      )}

      <div className="space-y-4">
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
              placeholder="Buscar categoría por nombre..."
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
            onClick={() => {
              setEditingCategory(null);
              setModalMode("create");
            }}
            className="btn-primary btn-sm whitespace-nowrap"
          >
            <Plus size={14} />
            Nueva Categoría
          </button>
        </div>

        {/* ── Tabla ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          {displayRows.length === 0 ? (
            <EmptyState
              filtered={search !== ""}
              onNew={() => setModalMode("create")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr
                    style={{
                      background: "hsl(var(--muted))",
                      borderBottom: "1px solid hsl(var(--border))",
                    }}
                  >
                    {[
                      { key: "name", label: "Nombre y Jerarquía" },
                      { key: "slug", label: "Slug" },
                      { key: null, label: "Acciones" },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          fontWeight: 600,
                          color: "hsl(var(--muted-foreground))",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((cat) => {
                    const level = cat.level ?? 0;
                    return (
                      <tr
                        key={cat.id}
                        className="group/row transition-colors"
                        style={{ borderBottom: "1px solid hsl(var(--border))" }}
                      >
                        {/* Nombre y Jerarquía */}
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <div className="flex items-center gap-2">
                            {/* Visualización de ramas del árbol */}
                            {level > 0 && Array.from({ length: level }).map((_, i) => (
                              <div
                                key={i}
                                className="w-4 h-full flex items-center justify-center opacity-30"
                              >
                                {i === level - 1 ? <CornerDownRight size={14} /> : <div className="w-px h-full bg-border" />}
                              </div>
                            ))}
                            <span
                              className="font-medium"
                              style={{ color: "hsl(var(--foreground))" }}
                            >
                              {cat.name}
                            </span>
                          </div>
                        </td>

                        {/* Slug */}
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{
                              background: "hsl(var(--muted))",
                              color: "hsl(var(--muted-foreground))",
                              fontFamily: "monospace",
                            }}
                          >
                            {cat.slug}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setModalMode("edit");
                              }}
                              className="p-1.5 rounded bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                              title="Editar categoría"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="p-1.5 rounded bg-transparent hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                              title="Eliminar categoría"
                            >
                              <Trash2 size={15} />
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
        </div>
      </div>
    </>
  );
}
