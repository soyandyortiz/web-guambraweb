"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  client_name: string | null;
  short_description: string | null;
  cover_image: string | null;
  tech_stack: { name: string; category: string }[] | null;
  is_featured: boolean;
};

const CATEGORIES = [
  "Todos",
  "Sitio Web",
  "E-commerce",
  "Alquiler",
  "Sistema de Gestión",
  "Clínica / Salud",
  "Restaurante",
  "Otro",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Sitio Web": "214 100% 44%",
  "E-commerce": "262 80% 58%",
  "Alquiler": "38 92% 50%",
  "Sistema de Gestión": "199 89% 48%",
  "Clínica / Salud": "142 71% 45%",
  "Restaurante": "16 100% 50%",
  "Otro": "220 15% 55%",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "220 15% 55%";
}

export function PortafolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos" ? projects : projects.filter((p) => p.category === active);

  // Only show categories that have at least one project
  const availableCats = CATEGORIES.filter(
    (c) => c === "Todos" || projects.some((p) => p.category === c)
  );

  return (
    <div>
      {/* ── FILTROS ── */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {availableCats.map((cat) => {
          const isActive = active === cat;
          const color = getCategoryColor(cat);
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive
                  ? `hsl(${color})`
                  : `hsl(${color} / 0.08)`,
                color: isActive ? "white" : `hsl(${color})`,
                border: `1.5px solid hsl(${color} / ${isActive ? "1" : "0.25"})`,
                transform: isActive ? "scale(1.04)" : "scale(1)",
                boxShadow: isActive
                  ? `0 4px 14px -4px hsl(${color} / 0.4)`
                  : "none",
              }}
            >
              {cat}
              {cat !== "Todos" && (
                <span className="ml-1.5 opacity-70">
                  ({projects.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── GRID ── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p
            className="text-lg font-medium"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            No hay proyectos publicados en esta categoría aún.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((project, i) => {
            const color = getCategoryColor(project.category);
            const techs = Array.isArray(project.tech_stack)
              ? project.tech_stack.slice(0, 4)
              : [];

            return (
              <Link
                key={project.id}
                href={`/portafolio/${project.slug}`}
                className="group block rounded-[2rem] overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {/* Cover image */}
                <div
                  className="relative h-56 overflow-hidden"
                  style={{ background: `hsl(${color} / 0.08)` }}
                >
                  {project.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={48} style={{ color: `hsl(${color} / 0.3)` }} />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to top, hsl(${color} / 0.6) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{
                        background: `hsl(${color})`,
                        boxShadow: `0 4px 12px hsl(${color} / 0.4)`,
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {project.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: "hsl(38 92% 50%)" }}
                      >
                        ★ Destacado
                      </span>
                    </div>
                  )}

                  {/* Arrow on hover */}
                  <div
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                    style={{ background: `hsl(${color})` }}
                  >
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  {project.client_name && (
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: `hsl(${color})` }}
                    >
                      {project.client_name}
                    </p>
                  )}
                  <h3
                    className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {project.title}
                  </h3>
                  {project.short_description && (
                    <p
                      className="text-sm leading-relaxed line-clamp-2 mb-4"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {project.short_description}
                    </p>
                  )}

                  {/* Tech badges */}
                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((t) => (
                        <span
                          key={t.name}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: "hsl(var(--muted) / 0.6)",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          {t.name}
                        </span>
                      ))}
                      {Array.isArray(project.tech_stack) && project.tech_stack.length > 4 && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: "hsl(var(--muted) / 0.6)",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
