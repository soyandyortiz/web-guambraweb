import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CategoryCarousel, type CategoryItem } from "@/components/tienda/CategoryCarousel";
import { SearchBar } from "@/components/tienda/SearchBar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tienda Online | GuambraWeb",
  description:
    "Explora nuestra tienda online de productos digitales y servicios tecnológicos adaptados a tus necesidades.",
};

/* ─── helpers ───────────────────────────────────────────────── */
function toFriendlySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

type ProductRecord = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  category_id: string | null;
  categories?: { name: string } | null;
};

/* ─── page ───────────────────────────────────────────────────── */
export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; categoria?: string; search?: string }>;
}) {
  const { page, categoria: categoriaSlug, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const productsPerPage = 8;
  const offset = (currentPage - 1) * productsPerPage;
  const searchTerm = search?.trim() ?? "";

  const supabase = await createClient();

  /* ── 1. Categorías ────────────────────────────────────────── */
  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, image_url")
    .order("name");

  const categories: CategoryItem[] = categoriesRaw ?? [];

  /* ── 2. Resolver category_id desde slug ───────────────────── */
  let filteredCategoryId: string | null = null;
  let activeCategoryName: string | null = null;

  if (categoriaSlug) {
    const match = categories.find((c) => c.slug === categoriaSlug);
    if (match) {
      filteredCategoryId = match.id;
      activeCategoryName = match.name;
    }
  }

  /* ── 3. Calcular IDs a filtrar (raíz + hijos si aplica) ───── */
  let categoryIds: string[] | null = null;

  if (filteredCategoryId) {
    const isRoot = !categories.find((c) => c.id === filteredCategoryId)
      ?.parent_id;

    if (isRoot) {
      const childIds = categories
        .filter((c) => c.parent_id === filteredCategoryId)
        .map((c) => c.id);
      categoryIds = [filteredCategoryId, ...childIds];
    } else {
      categoryIds = [filteredCategoryId];
    }
  }

  /* ── helper para aplicar filtros comunes a una query ───────── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function applyFilters(query: any) {
    query = query.eq("is_active", true);

    if (categoryIds) {
      query = query.in("category_id", categoryIds);
    }

    if (searchTerm) {
      // ILIKE with OR across name and description columns
      query = query.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    return query;
  }

  /* ── 4. Count ─────────────────────────────────────────────── */
  const { count } = await applyFilters(
    supabase.from("products").select("*", { count: "exact", head: true })
  );

  /* ── 5. Productos paginados ───────────────────────────────── */
  const { data: products, error } = await applyFilters(
    supabase
      .from("products")
      .select(
        "id, name, description, price, image_url, images, category_id, categories(name)"
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + productsPerPage - 1)
  );

  const totalProducts = count || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  /* ── helper: href que preserva categoria + search ─────────── */
  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (categoriaSlug) params.set("categoria", categoriaSlug);
    if (searchTerm) params.set("search", searchTerm);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/tienda${qs ? `?${qs}` : ""}`;
  }

  const hasActiveFilters = !!categoriaSlug || !!searchTerm;

  /* ────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* ── 1. Carrusel de categorías + Buscador ── */}
      <section className="mb-10">
        {categories.length > 0 && (
          <div className="mb-5">
            <Suspense>
              <CategoryCarousel
                categories={categories}
                activeSlug={categoriaSlug ?? null}
              />
            </Suspense>
          </div>
        )}

        <div className="max-w-2xl mx-auto rounded-2xl shadow-sm">
          <Suspense>
            <SearchBar initialValue={searchTerm} />
          </Suspense>
        </div>
      </section>
      

      {/* Error */}
      {error && (
        <div className="p-4 mb-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 max-w-4xl mx-auto">
          Ocurrió un error al cargar los productos. Por favor, intenta de nuevo
          más tarde.
        </div>
      )}

      {/* ── 4. Main layout: Full width product area ── */}
      <div className="w-full">
        {/* Active filters pill row */}
          {hasActiveFilters && (
            <div
              className="flex flex-wrap items-center gap-2 mb-5 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <span>Mostrando:</span>

              {activeCategoryName && (
                <span
                  className="font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "hsl(var(--primary) / 0.12)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  {activeCategoryName}
                </span>
              )}

              {searchTerm && (
                <span
                  className="font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "hsl(var(--accent) / 0.15)",
                    color: "hsl(var(--accent-foreground))",
                  }}
                >
                  &ldquo;{searchTerm}&rdquo;
                </span>
              )}

              <span>·</span>
              <span>
                {totalProducts} resultado{totalProducts !== 1 ? "s" : ""}
              </span>

              {/* Clear all filters */}
              <Link
                href="/tienda"
                className="ml-2 text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Limpiar filtros
              </Link>
            </div>
          )}

          {/* Empty state */}
          {(!products || products.length === 0) && !error && (
            <div
              className="text-center py-20 rounded-2xl"
              style={{ border: "1px dashed hsl(var(--border))" }}
            >
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold mb-2">
                {hasActiveFilters
                  ? "Sin resultados"
                  : "No hay productos disponibles"}
              </h2>
              <p style={{ color: "hsl(var(--muted-foreground))" }}>
                {hasActiveFilters
                  ? "Prueba con otro término de búsqueda o cambia la categoría."
                  : "Pronto añadiremos nuevos productos increíbles a nuestra tienda."}
              </p>
              {hasActiveFilters && (
                <Link
                  href="/tienda"
                  className="inline-block mt-4 text-sm font-medium underline"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Ver todos los productos
                </Link>
              )}
            </div>
          )}

          {/* Product grid */}
          {products && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
              {(products as ProductRecord[]).map((product) => {
                const slug = toFriendlySlug(product.name);
                const categoryName = product.categories?.name;

                return (
                  <Link
                    href={`/tienda/${product.id}-${slug}`}
                    key={product.id}
                    className="group rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
                    style={{
                      background: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden flex items-center justify-center">
                      {(product.image_url || (product.images && product.images.length > 0)) ? (
                        <img
                          src={product.image_url || product.images![0]}
                          alt={product.name}
                          loading="lazy"
                          width="400"
                          height="300"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <ShoppingBag
                          size={32}
                          style={{
                            color: "hsl(var(--muted-foreground) / 0.5)",
                          }}
                        />
                      )}

                      {/* Category badge */}
                      {categoryName && (
                        <span
                          className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            background: "hsl(var(--primary) / 0.85)",
                            color: "white",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {categoryName}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 md:p-5 flex-grow flex flex-col">
                      <h3
                        className="font-bold text-base md:text-lg mb-1.5 md:mb-2 line-clamp-2"
                        style={{ color: "hsl(var(--card-foreground))" }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-xs md:text-sm mb-4 line-clamp-2 md:line-clamp-3"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {product.description || "Sin descripción disponible."}
                      </p>

                      <div className="mt-auto pt-2 grid grid-cols-1 items-start gap-3 sm:flex sm:items-center sm:justify-between sm:gap-0">
                        <span className="font-bold text-base md:text-lg gradient-text">
                          {formatPrice(Number(product.price))}
                        </span>
                        <span
                          className="w-full sm:w-auto text-center text-xs md:text-sm font-medium px-3 py-1.5 rounded-md transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm"
                          style={{
                            background: "hsl(var(--primary) / 0.1)",
                            color: "hsl(var(--primary))",
                          }}
                        >
                          Ver detalle
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {currentPage > 1 && (
                <Link
                  href={pageHref(currentPage - 1)}
                  className="px-4 py-2 border rounded-md text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  style={{
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  ← Anterior
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = p === currentPage;
                  return (
                    <Link
                      key={p}
                      href={pageHref(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      style={
                        !isActive
                          ? { color: "hsl(var(--foreground))" }
                          : undefined
                      }
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages && (
                <Link
                  href={pageHref(currentPage + 1)}
                  className="px-4 py-2 border rounded-md text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  style={{
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
