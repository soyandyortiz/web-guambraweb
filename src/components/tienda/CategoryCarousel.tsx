"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid } from "lucide-react";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url?: string | null;
};

type Props = {
  categories: CategoryItem[];
  activeSlug: string | null;
};

/** Emoji de respaldo cuando la categoría no tiene imagen */
function categoryEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("web") || n.includes("página") || n.includes("sitio")) return "🌐";
  if (n.includes("app") || n.includes("móvil") || n.includes("movil")) return "📱";
  if (n.includes("tienda") || n.includes("ecommerce") || n.includes("e-commerce")) return "🛒";
  if (n.includes("sistema") || n.includes("gestión") || n.includes("erp")) return "⚙️";
  if (n.includes("diseño") || n.includes("branding") || n.includes("logo")) return "🎨";
  if (n.includes("seo") || n.includes("marketing")) return "📈";
  if (n.includes("hosting") || n.includes("servidor") || n.includes("cloud")) return "☁️";
  if (n.includes("soporte") || n.includes("mantenimiento")) return "🔧";
  return "📦";
}

export function CategoryCarousel({ categories, activeSlug }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag state
  const didDrag = useRef(false);
  const startX = useRef(0);
  const scrollLeftSnap = useRef(0);
  const [grabbing, setGrabbing] = useState(false);

  const navigate = useCallback(
    (slug: string | null) => {
      if (didDrag.current) return; // ignorar click si fue arrastre
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set("categoria", slug);
      else params.delete("categoria");
      params.delete("page");
      router.push(`/tienda?${params.toString()}`);
    },
    [router, searchParams]
  );

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    didDrag.current = false;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeftSnap.current = scrollRef.current?.scrollLeft ?? 0;
    setGrabbing(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!grabbing) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1.4;
    if (Math.abs(walk) > 4) didDrag.current = true;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftSnap.current - walk;
    }
  };

  const stopDrag = () => setGrabbing(false);

  return (
    <div className="relative w-full overflow-hidden">
      {/* ── Desenfoque borde izquierdo ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-14 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--background)) 10%, transparent 100%)",
        }}
      />
      {/* ── Desenfoque borde derecho ── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-14 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, hsl(var(--background)) 10%, transparent 100%)",
        }}
      />

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-scroll px-8 py-3 select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: grabbing ? "grabbing" : "grab",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {/* ── Card "Todos" ── */}
        <button
          onClick={() => navigate(null)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-transform duration-200 hover:scale-105"
          style={{ width: 76 }}
        >
          <div
            className="w-[76px] h-[56px] rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{
              background: !activeSlug
                ? "hsl(var(--primary))"
                : "hsl(var(--muted))",
              outline: !activeSlug
                ? "2px solid hsl(var(--primary))"
                : "2px solid transparent",
              outlineOffset: "2px",
              boxShadow: !activeSlug
                ? "0 4px 14px hsl(var(--primary) / 0.28)"
                : "0 2px 6px rgba(0,0,0,0.07)",
            }}
          >
            <LayoutGrid
              size={22}
              style={{ color: !activeSlug ? "white" : "hsl(var(--muted-foreground))" }}
            />
          </div>
          <span
            className="text-[11px] font-semibold text-center leading-tight"
            style={{
              color: !activeSlug
                ? "hsl(var(--primary))"
                : "hsl(var(--foreground))",
            }}
          >
            Todos
          </span>
        </button>

        {/* ── Cards de categorías ── */}
        {categories.map((c) => {
          const isActive = c.slug === activeSlug;
          return (
            <button
              key={c.id}
              onClick={() => navigate(c.slug)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-transform duration-200 hover:scale-105"
              style={{ width: 76 }}
            >
              <div
                className="w-[76px] h-[56px] rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  outline: isActive
                    ? "2px solid hsl(var(--primary))"
                    : "2px solid transparent",
                  outlineOffset: "2px",
                  boxShadow: isActive
                    ? "0 4px 14px hsl(var(--primary) / 0.25)"
                    : "0 2px 6px rgba(0,0,0,0.07)",
                }}
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl"
                    style={{
                      background: isActive
                        ? "hsl(var(--primary) / 0.1)"
                        : "hsl(var(--muted))",
                    }}
                  >
                    {categoryEmoji(c.name)}
                  </div>
                )}
              </div>
              <span
                className="text-[11px] font-semibold text-center leading-tight"
                style={{
                  maxWidth: 76,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--foreground))",
                }}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
