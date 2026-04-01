"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { LayoutGrid } from "lucide-react";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

type Props = {
  categories: CategoryItem[];
  activeSlug: string | null;
};

export function CategoryFilter({ categories, activeSlug }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("categoria", slug);
      } else {
        params.delete("categoria");
      }
      // Reset pagination when changing filter
      params.delete("page");
      router.push(`/tienda?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 w-full">
      <button
        onClick={() => navigate(null)}
        className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
          !activeSlug
            ? "bg-primary text-primary-foreground scale-105 ring-2 ring-primary/20"
            : "bg-card text-foreground border border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:-translate-y-0.5"
        }`}
      >
        <LayoutGrid size={16} className={!activeSlug ? "opacity-100" : "opacity-70"} />
        Todos
      </button>

      {categories.map((c) => {
        const isActive = c.slug === activeSlug;
        return (
          <button
            key={c.id}
            onClick={() => navigate(c.slug)}
            className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
              isActive
                ? "bg-primary text-primary-foreground scale-105 ring-2 ring-primary/20"
                : "bg-card text-foreground border border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:-translate-y-0.5"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
