"use client";

import { useState, useTransition, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateAdmin } from "@/app/actions/admin";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Search,
  Globe,
  AlertTriangle,
  Check,
  ImageIcon,
  PlusCircle,
  MinusCircle,
  ExternalLink,
  Layers,
  LayoutGrid,
} from "lucide-react";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  client_name: string | null;
  short_description: string | null;
  problem: string | null;
  solution: string | null;
  features: { label: string; icon?: string }[];
  tech_stack: { name: string; category: string }[];
  cover_image: string | null;
  images: string[] | null;
  results: string[] | null;
  versions: { version: string; date: string; changes: string[] }[] | null;
  demo_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};

const CATEGORIES = [
  "Sitio Web",
  "E-commerce",
  "Alquiler",
  "Sistema de Gestión",
  "Clínica / Salud",
  "Restaurante",
  "Otro",
];

type FormData = {
  title: string;
  slug: string;
  category: string;
  client_name: string;
  short_description: string;
  problem: string;
  solution: string;
  features: { label: string; icon?: string }[];
  tech_stack: { name: string; category: string }[];
  cover_image: string;
  images: string[];
  results: string[];
  versions: { version: string; date: string; changes: string[] }[];
  demo_url: string;
  is_featured: boolean;
  is_published: boolean;
  order_index: string;
  seo_title: string;
  seo_description: string;
};

const INITIAL_FORM: FormData = {
  title: "",
  slug: "",
  category: "Sistema de Gestión",
  client_name: "",
  short_description: "",
  problem: "",
  solution: "",
  features: [],
  tech_stack: [],
  cover_image: "",
  images: [],
  results: [],
  versions: [],
  demo_url: "",
  is_featured: false,
  is_published: false,
  order_index: "0",
  seo_title: "",
  seo_description: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* ─────────────────────────────────────────
   MODAL FORM
───────────────────────────────────────── */
function ProjectForm({
  initial,
  onSave,
  onClose,
  loading,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [tab, setTab] = useState<"basic" | "content" | "media" | "seo">("basic");

  const set = (key: keyof FormData, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  // Auto-slug from title
  const handleTitle = (v: string) => {
    set("title", v);
    if (!initial.slug) set("slug", slugify(v));
  };

  // Features
  const addFeature = () => set("features", [...form.features, { label: "", icon: "✓" }]);
  const updateFeature = (i: number, key: "label" | "icon", val: string) => {
    const arr = [...form.features];
    arr[i] = { ...arr[i], [key]: val };
    set("features", arr);
  };
  const removeFeature = (i: number) =>
    set("features", form.features.filter((_, idx) => idx !== i));

  // Tech stack
  const addTech = () => set("tech_stack", [...form.tech_stack, { name: "", category: "frontend" }]);
  const updateTech = (i: number, key: "name" | "category", val: string) => {
    const arr = [...form.tech_stack];
    arr[i] = { ...arr[i], [key]: val };
    set("tech_stack", arr);
  };
  const removeTech = (i: number) =>
    set("tech_stack", form.tech_stack.filter((_, idx) => idx !== i));

  // Results
  const addResult = () => set("results", [...(form.results ?? []), ""]);
  const updateResult = (i: number, val: string) => {
    const arr = [...(form.results ?? [])];
    arr[i] = val;
    set("results", arr);
  };
  const removeResult = (i: number) =>
    set("results", (form.results ?? []).filter((_, idx) => idx !== i));

  // Gallery images
  const addImage = () => set("images", [...(form.images ?? []), ""]);
  const updateImage = (i: number, val: string) => {
    const arr = [...(form.images ?? [])];
    arr[i] = val;
    set("images", arr);
  };
  const removeImage = (i: number) =>
    set("images", (form.images ?? []).filter((_, idx) => idx !== i));

  const TABS = [
    { key: "basic", label: "Info" },
    { key: "content", label: "Contenido" },
    { key: "media", label: "Media" },
    { key: "seo", label: "SEO" },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <h2
            className="font-bold text-lg"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {initial.title ? "Editar proyecto" : "Nuevo proyecto"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-3 text-sm font-medium transition-colors"
              style={{
                color: tab === t.key ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                borderBottom: tab === t.key ? "2px solid hsl(var(--primary))" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* ── BASIC ── */}
          {tab === "basic" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Título del proyecto *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => handleTitle(e.target.value)}
                    placeholder="Control total de inventario para tienda de ropa"
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Slug (URL)
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="control-inventario-tienda-ropa"
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Categoría
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Cliente / Negocio
                  </label>
                  <input
                    value={form.client_name}
                    onChange={(e) => set("client_name", e.target.value)}
                    placeholder="Tienda La Moda"
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    URL Demo
                  </label>
                  <input
                    value={form.demo_url}
                    onChange={(e) => set("demo_url", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Orden de aparición
                  </label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) => set("order_index", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Descripción corta (2 líneas)
                </label>
                <textarea
                  value={form.short_description}
                  onChange={(e) => set("short_description", e.target.value)}
                  rows={2}
                  placeholder="Sistema que permite controlar el inventario en tiempo real..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => set("is_published", e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>Publicado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => set("is_featured", e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>Destacado en Home</span>
                </label>
              </div>
            </>
          )}

          {/* ── CONTENT ── */}
          {tab === "content" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  El Problema
                </label>
                <textarea
                  value={form.problem}
                  onChange={(e) => set("problem", e.target.value)}
                  rows={3}
                  placeholder="El negocio no tenía control de fechas ni disponibilidad..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  La Solución
                </label>
                <textarea
                  value={form.solution}
                  onChange={(e) => set("solution", e.target.value)}
                  rows={3}
                  placeholder="Desarrollamos un sistema web que centraliza..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Características del sistema
                  </label>
                  <button onClick={addFeature} className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                    <PlusCircle size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={f.icon}
                        onChange={(e) => updateFeature(i, "icon", e.target.value)}
                        placeholder="✓"
                        className="w-12 px-2 py-2 rounded-xl text-sm border outline-none text-center"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <input
                        value={f.label}
                        onChange={(e) => updateFeature(i, "label", e.target.value)}
                        placeholder="Control de inventario"
                        className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <button onClick={() => removeFeature(i)} style={{ color: "hsl(var(--destructive))" }}>
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Stack tecnológico
                  </label>
                  <button onClick={addTech} className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                    <PlusCircle size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {form.tech_stack.map((t, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={t.name}
                        onChange={(e) => updateTech(i, "name", e.target.value)}
                        placeholder="React"
                        className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <select
                        value={t.category}
                        onChange={(e) => updateTech(i, "category", e.target.value)}
                        className="px-2 py-2 rounded-xl text-xs border outline-none"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Base de datos</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Mobile</option>
                      </select>
                      <button onClick={() => removeTech(i)} style={{ color: "hsl(var(--destructive))" }}>
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Resultados obtenidos
                  </label>
                  <button onClick={addResult} className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                    <PlusCircle size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.results ?? []).map((r, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={r}
                        onChange={(e) => updateResult(i, e.target.value)}
                        placeholder="Reducción de errores en un 80%"
                        className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <button onClick={() => removeResult(i)} style={{ color: "hsl(var(--destructive))" }}>
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── MEDIA ── */}
          {tab === "media" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Imagen de portada (URL)
                </label>
                <input
                  value={form.cover_image}
                  onChange={(e) => set("cover_image", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                {form.cover_image && (
                  <div className="mt-2 rounded-xl overflow-hidden border" style={{ borderColor: "hsl(var(--border))", height: 120 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.cover_image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Galería de imágenes
                  </label>
                  <button onClick={addImage} className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                    <PlusCircle size={14} /> Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.images ?? []).map((img, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={img}
                        onChange={(e) => updateImage(i, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                        style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      />
                      <button onClick={() => removeImage(i)} style={{ color: "hsl(var(--destructive))" }}>
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── SEO ── */}
          {tab === "seo" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  SEO Title (max 60 chars)
                </label>
                <input
                  value={form.seo_title}
                  onChange={(e) => set("seo_title", e.target.value)}
                  placeholder="Sistema de alquiler de trajes | GuambraWeb"
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {form.seo_title.length}/60 caracteres
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  SEO Description (max 160 chars)
                </label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) => set("seo_description", e.target.value)}
                  rows={3}
                  placeholder="Plataforma para controlar fechas, clientes y productos sin errores..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {form.seo_description.length}/160 caracteres
                </p>
              </div>
              <div
                className="p-4 rounded-xl text-sm"
                style={{ background: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.2)" }}
              >
                <p className="font-semibold mb-1" style={{ color: "hsl(var(--primary))" }}>
                  Vista previa en Google
                </p>
                <p className="font-medium text-base" style={{ color: "#1a0dab" }}>
                  {form.seo_title || form.title || "Título del proyecto"}
                </p>
                <p className="text-xs" style={{ color: "#006621" }}>
                  guambraweb.com/portafolio/{form.slug || "slug"}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "#545454" }}>
                  {form.seo_description || form.short_description || "Descripción del proyecto..."}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={loading || !form.title || !form.slug}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "hsl(var(--primary))" }}
          >
            {loading ? "Guardando…" : "Guardar proyecto"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────── */
export function PortafolioTable({ initialProjects }: { initialProjects: PortfolioProject[] }) {
  const supabase = createClient();
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PortfolioProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Todos" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (p: PortfolioProject) => {
    setEditTarget(p);
    setFormOpen(true);
  };

  const toFormData = (p: PortfolioProject | null): FormData => {
    if (!p) return INITIAL_FORM;
    return {
      title: p.title,
      slug: p.slug,
      category: p.category,
      client_name: p.client_name ?? "",
      short_description: p.short_description ?? "",
      problem: p.problem ?? "",
      solution: p.solution ?? "",
      features: Array.isArray(p.features) ? (p.features as { label: string; icon?: string }[]) : [],
      tech_stack: Array.isArray(p.tech_stack) ? (p.tech_stack as { name: string; category: string }[]) : [],
      cover_image: p.cover_image ?? "",
      images: p.images ?? [],
      results: p.results ?? [],
      versions: p.versions ?? [],
      demo_url: p.demo_url ?? "",
      is_featured: p.is_featured,
      is_published: p.is_published,
      order_index: String(p.order_index),
      seo_title: p.seo_title ?? "",
      seo_description: p.seo_description ?? "",
    };
  };

  const handleSave = useCallback(
    (form: FormData) => {
      startTransition(async () => {
        const payload = {
          title: form.title.trim(),
          slug: form.slug.trim(),
          category: form.category,
          client_name: form.client_name.trim() || null,
          short_description: form.short_description.trim() || null,
          problem: form.problem.trim() || null,
          solution: form.solution.trim() || null,
          features: form.features,
          tech_stack: form.tech_stack,
          cover_image: form.cover_image.trim() || null,
          images: form.images.filter(Boolean),
          results: form.results?.filter(Boolean) ?? [],
          versions: form.versions,
          demo_url: form.demo_url.trim() || null,
          is_featured: form.is_featured,
          is_published: form.is_published,
          order_index: parseInt(form.order_index) || 0,
          seo_title: form.seo_title.trim() || null,
          seo_description: form.seo_description.trim() || null,
        };

        if (editTarget) {
          const { data, error } = await supabase
            .from("portfolio_projects")
            .update(payload)
            .eq("id", editTarget.id)
            .select()
            .single();
          if (!error && data) {
            setProjects((prev) =>
              prev.map((p) => (p.id === editTarget.id ? (data as unknown as PortfolioProject) : p))
            );
          }
        } else {
          const { data, error } = await supabase
            .from("portfolio_projects")
            .insert(payload)
            .select()
            .single();
          if (!error && data) {
            setProjects((prev) => [data as unknown as PortfolioProject, ...prev]);
          }
        }
        await revalidateAdmin();
        setFormOpen(false);
        setEditTarget(null);
      });
    },
    [editTarget, supabase]
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const { error } = await supabase
        .from("portfolio_projects")
        .delete()
        .eq("id", deleteTarget.id);
      if (!error) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      }
      await revalidateAdmin();
      setDeleteTarget(null);
    });
  }, [deleteTarget, supabase]);

  const togglePublished = async (p: PortfolioProject) => {
    const { data } = await supabase
      .from("portfolio_projects")
      .update({ is_published: !p.is_published })
      .eq("id", p.id)
      .select()
      .single();
    if (data) setProjects((prev) => prev.map((x) => (x.id === p.id ? (data as unknown as PortfolioProject) : x)));
    await revalidateAdmin();
  };

  const toggleFeatured = async (p: PortfolioProject) => {
    const { data } = await supabase
      .from("portfolio_projects")
      .update({ is_featured: !p.is_featured })
      .eq("id", p.id)
      .select()
      .single();
    if (data) setProjects((prev) => prev.map((x) => (x.id === p.id ? (data as unknown as PortfolioProject) : x)));
    await revalidateAdmin();
  };

  const CATEGORY_COLORS: Record<string, string> = {
    "Sitio Web": "var(--primary)",
    "E-commerce": "var(--accent)",
    "Alquiler": "var(--warning)",
    "Sistema de Gestión": "var(--secondary)",
    "Clínica / Salud": "var(--success)",
    "Restaurante": "var(--warning)",
    "Otro": "var(--muted-foreground)",
  };

  return (
    <>
      {/* ── TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["Todos", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filterCat === cat ? "hsl(var(--primary))" : "hsl(var(--muted) / 0.5)",
                color: filterCat === cat ? "white" : "hsl(var(--muted-foreground))",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyectos..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm border outline-none"
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            />
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* ── GRID DE CARDS ── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          <LayoutGrid size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hay proyectos{search ? " que coincidan" : " aún"}</p>
          <p className="text-sm mt-1">Haz clic en &ldquo;Nuevo&rdquo; para agregar el primer proyecto</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const accentColor = CATEGORY_COLORS[p.category] ?? "var(--primary)";
            return (
              <div
                key={p.id}
                className="rounded-2xl overflow-hidden border flex flex-col group transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                {/* Cover */}
                <div
                  className="h-36 relative overflow-hidden"
                  style={{ background: `hsl(${accentColor} / 0.1)` }}
                >
                  {p.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={32} style={{ color: `hsl(${accentColor} / 0.4)` }} />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: `hsl(${accentColor})` }}
                    >
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    {p.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: "hsl(var(--warning))" }}>
                        ★ Dest.
                      </span>
                    )}
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: p.is_published ? "hsl(var(--success) / 0.15)" : "hsl(var(--muted) / 0.8)",
                        color: p.is_published ? "hsl(var(--success))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {p.is_published ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-4">
                  <p className="font-semibold text-sm leading-snug mb-1" style={{ color: "hsl(var(--foreground))" }}>
                    {p.title}
                  </p>
                  {p.client_name && (
                    <p className="text-xs mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {p.client_name}
                    </p>
                  )}
                  {p.short_description && (
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {p.short_description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-t"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex gap-1">
                    <button
                      onClick={() => togglePublished(p)}
                      title={p.is_published ? "Despublicar" : "Publicar"}
                      className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                      style={{ color: p.is_published ? "hsl(var(--success))" : "hsl(var(--muted-foreground))" }}
                    >
                      {p.is_published ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => toggleFeatured(p)}
                      title={p.is_featured ? "Quitar destacado" : "Destacar"}
                      className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                      style={{ color: p.is_featured ? "hsl(var(--warning))" : "hsl(var(--muted-foreground))" }}
                    >
                      {p.is_featured ? <Star size={15} /> : <StarOff size={15} />}
                    </button>
                    {p.demo_url && (
                      <a
                        href={p.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver demo"
                        className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                        style={{ color: "hsl(var(--primary))" }}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                      style={{ color: "hsl(var(--destructive))" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL FORM ── */}
      {formOpen && (
        <ProjectForm
          initial={toFormData(editTarget)}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          loading={isPending}
        />
      )}

      {/* ── CONFIRM DELETE ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: "hsl(var(--destructive) / 0.1)" }}>
                <AlertTriangle size={20} style={{ color: "hsl(var(--destructive))" }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: "hsl(var(--foreground))" }}>
                  Eliminar proyecto
                </p>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            <p className="text-sm mb-6 px-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              ¿Eliminar <strong style={{ color: "hsl(var(--foreground))" }}>{deleteTarget.title}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "hsl(var(--destructive))" }}
              >
                {isPending ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
