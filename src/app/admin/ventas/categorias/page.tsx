export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { CategoriasTable } from "@/components/admin/categorias/CategoriasTable";
import { Tags, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías | Admin — GuambraWeb",
  description: "Gestiona el árbol de categorías de productos.",
};

export default async function CategoriasPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, created_at, updated_at")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "hsl(var(--primary) / 0.15)",
              color: "hsl(var(--primary))",
            }}
          >
            <Tags size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Categorías de Productos
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al cargar las categorías"
                : `${categories?.length ?? 0} categoría${(categories?.length ?? 0) !== 1 ? "s" : ""} en total`}
            </p>
          </div>
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
          Error cargando categorías: {error.message}
        </div>
      )}

      {/* ── Tabla con CRUD ── */}
      {!error && (
        <CategoriasTable initialCategories={categories ?? []} />
      )}
    </div>
  );
}
