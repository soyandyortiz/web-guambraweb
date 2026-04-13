export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { ProductosTable } from "@/components/admin/productos/ProductosTable";
import { Package, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos | Admin — GuambraWeb",
  description: "Gestiona el catálogo de productos y servicios de la tienda.",
};

export default async function ProductosPage() {
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .order("name");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, description, price, is_active, image_url, images, created_at, category_id, categories(name), technologies, features, versions, demo_url")
    .order("created_at", { ascending: false });

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
            <Package size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Productos
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al cargar el catálogo"
                : `${products?.length ?? 0} producto${(products?.length ?? 0) !== 1 ? "s" : ""} en el catálogo`}
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
          Error cargando productos: {error.message}
        </div>
      )}

      {/* ── Tabla con CRUD ── */}
      {!error && (
        <ProductosTable 
          initialProducts={products as any ?? []} 
          categories={categories ?? []} 
        />
      )}
    </div>
  );
}
