import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { AnimateOnScroll } from "@/components/home/AnimateOnScroll";
import {
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Monitor,
  Layers,
  ArrowRight,
} from "lucide-react";

export const revalidate = 60;

/* ── Tipos locales ── */
type Feature = { label: string; icon?: string };
type TechItem = { name: string; category: string };
type Version = { version: string; date?: string; changes: string[] };

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  client_name: string | null;
  short_description: string | null;
  problem: string | null;
  solution: string | null;
  features: Feature[];
  tech_stack: TechItem[];
  cover_image: string | null;
  images: string[] | null;
  results: string[] | null;
  versions: Version[] | null;
  demo_url: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  "Sitio Web": "214 100% 44%",
  "E-commerce": "262 80% 58%",
  "Alquiler": "38 92% 50%",
  "Sistema de Gestión": "199 89% 48%",
  "Clínica / Salud": "142 71% 45%",
  "Restaurante": "16 100% 50%",
  "Otro": "220 15% 55%",
};

const TECH_CATEGORY_COLORS: Record<string, string> = {
  frontend: "214 100% 44%",
  backend: "262 80% 58%",
  database: "142 71% 45%",
  devops: "38 92% 50%",
  mobile: "16 100% 50%",
};

const WA_LINK =
  "https://wa.me/593982650929?text=Hola%2C%20vi%20su%20portafolio%20y%20me%20interesa%20un%20sistema%20similar";

/* ── generateMetadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_projects")
    .select("title, short_description, seo_title, seo_description, cover_image")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return { title: "Proyecto | GuambraWeb" };

  const title = data.seo_title || `${data.title} | GuambraWeb`;
  const description =
    data.seo_description ||
    data.short_description ||
    "Proyecto de software desarrollado por GuambraWeb";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.cover_image ? [data.cover_image] : [],
    },
  };
}

/* ── Page ── */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) notFound();

  const p = project as unknown as Project;
  const color = CATEGORY_COLORS[p.category] ?? "214 100% 44%";
  const features: Feature[] = Array.isArray(p.features) ? p.features : [];
  const techStack: TechItem[] = Array.isArray(p.tech_stack) ? p.tech_stack : [];
  const results: string[] = Array.isArray(p.results) ? p.results : [];
  const versions: Version[] = Array.isArray(p.versions) ? p.versions : [];
  const gallery: string[] = Array.isArray(p.images) ? p.images.filter(Boolean) : [];

  // Group tech by category
  const techGroups = techStack.reduce<Record<string, TechItem[]>>((acc, t) => {
    const cat = t.category || "otro";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  // Related projects (same category, different slug)
  const { data: related } = await supabase
    .from("portfolio_projects")
    .select("id, title, slug, category, cover_image, short_description")
    .eq("is_published", true)
    .eq("category", p.category)
    .neq("slug", slug)
    .limit(3);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "hsl(var(--background))" }}
    >
      <PublicNav />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        {/* Gradient top */}
        <div
          className="absolute inset-x-0 top-0 h-80 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, hsl(${color} / 0.06) 0%, transparent 100%)`,
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Back link */}
          <Link
            href="/portafolio"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <ArrowLeft size={16} />
            Volver al portafolio
          </Link>

          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: `hsl(${color})` }}
              >
                {p.category}
              </span>
              {p.client_name && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: `hsl(${color} / 0.1)`,
                    color: `hsl(${color})`,
                    border: `1px solid hsl(${color} / 0.3)`,
                  }}
                >
                  {p.client_name}
                </span>
              )}
            </div>

            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight mb-5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {p.title}
            </h1>

            {p.short_description && (
              <p
                className="text-lg md:text-xl leading-relaxed max-w-2xl mb-8"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {p.short_description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-white transition-all hover:opacity-90"
                style={{
                  background: "hsl(var(--primary))",
                  boxShadow: "0 8px 24px -6px hsl(var(--primary) / 0.4)",
                }}
              >
                <MessageCircle size={17} />
                Solicitar sistema similar
              </a>
              {p.demo_url && (
                <a
                  href={p.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold border transition-all hover:opacity-80"
                  style={{
                    borderColor: `hsl(${color} / 0.4)`,
                    color: `hsl(${color})`,
                    background: `hsl(${color} / 0.06)`,
                  }}
                >
                  <ExternalLink size={17} />
                  Ver demo en vivo
                </a>
              )}
            </div>
          </AnimateOnScroll>

          {/* Cover image */}
          {p.cover_image && (
            <AnimateOnScroll animation="fade-up" delay={100}>
              <div
                className="w-full rounded-[2rem] overflow-hidden shadow-2xl mb-0"
                style={{ border: "1px solid hsl(var(--border))" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.cover_image}
                  alt={p.title}
                  className="w-full object-cover"
                  style={{ maxHeight: 520 }}
                />
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* ── PROBLEMA + SOLUCIÓN ── */}
        {(p.problem || p.solution) && (
          <div className="grid md:grid-cols-2 gap-6">
            {p.problem && (
              <AnimateOnScroll animation="fade-left">
                <div
                  className="p-8 rounded-[2rem] h-full"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "hsl(16 100% 50% / 0.1)" }}
                    >
                      <AlertTriangle size={20} style={{ color: "hsl(16 100% 50%)" }} />
                    </div>
                    <h2
                      className="text-lg font-bold"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      El Problema
                    </h2>
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {p.problem}
                  </p>
                </div>
              </AnimateOnScroll>
            )}
            {p.solution && (
              <AnimateOnScroll animation="fade-right">
                <div
                  className="p-8 rounded-[2rem] h-full"
                  style={{
                    background: `hsl(${color} / 0.04)`,
                    border: `1px solid hsl(${color} / 0.2)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `hsl(${color} / 0.1)` }}
                    >
                      <Lightbulb size={20} style={{ color: `hsl(${color})` }} />
                    </div>
                    <h2
                      className="text-lg font-bold"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      La Solución
                    </h2>
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {p.solution}
                  </p>
                </div>
              </AnimateOnScroll>
            )}
          </div>
        )}

        {/* ── CARACTERÍSTICAS ── */}
        {features.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${color} / 0.1)` }}
                >
                  <Layers size={20} style={{ color: `hsl(${color})` }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-display font-bold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Características del sistema
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <span
                      className="text-xl flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl"
                      style={{ background: `hsl(${color} / 0.1)` }}
                    >
                      {f.icon || "✓"}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* ── STACK TECNOLÓGICO ── */}
        {techStack.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(var(--muted) / 0.5)" }}
                >
                  <Monitor size={20} style={{ color: "hsl(var(--foreground))" }} />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-display font-bold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Stack tecnológico
                </h2>
              </div>
              <div className="flex flex-wrap gap-6">
                {Object.entries(techGroups).map(([cat, techs]) => {
                  const techColor = TECH_CATEGORY_COLORS[cat] ?? "220 15% 55%";
                  const catLabels: Record<string, string> = {
                    frontend: "Frontend",
                    backend: "Backend",
                    database: "Base de datos",
                    devops: "DevOps",
                    mobile: "Mobile",
                  };
                  return (
                    <div key={cat} className="flex flex-col gap-2">
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: `hsl(${techColor})` }}
                      >
                        {catLabels[cat] ?? cat}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((t) => (
                          <span
                            key={t.name}
                            className="px-3 py-1.5 rounded-full text-sm font-semibold"
                            style={{
                              background: `hsl(${techColor} / 0.1)`,
                              color: `hsl(${techColor})`,
                              border: `1px solid hsl(${techColor} / 0.25)`,
                            }}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* ── GALERÍA ── */}
        {gallery.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div>
              <h2
                className="text-2xl md:text-3xl font-display font-bold mb-8"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Capturas del sistema
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: "1px solid hsl(var(--border))" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${p.title} — captura ${i + 1}`}
                      className="w-full object-cover hover:scale-105 transition-transform duration-500"
                      style={{ maxHeight: 320 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* ── RESULTADOS ── */}
        {results.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div
              className="rounded-[2rem] p-10"
              style={{
                background: `hsl(${color} / 0.05)`,
                border: `1px solid hsl(${color} / 0.2)`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${color} / 0.15)` }}
                >
                  <TrendingUp size={20} style={{ color: `hsl(${color})` }} />
                </div>
                <h2
                  className="text-2xl font-display font-bold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Resultados obtenidos
                </h2>
              </div>
              <ul className="space-y-3">
                {results.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: `hsl(${color})` }}
                    />
                    <span
                      className="text-base"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        )}

        {/* ── VERSIONES ── */}
        {versions.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div>
              <h2
                className="text-2xl md:text-3xl font-display font-bold mb-8"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Historial de versiones
              </h2>
              <div className="space-y-4 relative">
                {/* Vertical line */}
                <div
                  className="absolute left-5 top-5 bottom-5 w-px"
                  style={{ background: `hsl(${color} / 0.2)` }}
                />
                {versions.map((v, i) => (
                  <div key={i} className="flex gap-5 relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold text-white"
                      style={{ background: `hsl(${color})` }}
                    >
                      {i + 1}
                    </div>
                    <div
                      className="flex-1 p-5 rounded-2xl"
                      style={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="font-bold text-sm"
                          style={{ color: `hsl(${color})` }}
                        >
                          {v.version}
                        </span>
                        {v.date && (
                          <span
                            className="text-xs"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            {v.date}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1">
                        {v.changes.map((c, j) => (
                          <li
                            key={j}
                            className="text-sm flex items-start gap-2"
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            <span style={{ color: `hsl(${color})` }}>→</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* ── CTA ── */}
        <AnimateOnScroll animation="fade-up">
          <div
            className="rounded-[2.5rem] p-10 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, hsl(${color} / 0.08) 0%, transparent 70%)`,
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-2xl md:text-4xl font-display font-extrabold mb-4"
                style={{ color: "hsl(var(--foreground))" }}
              >
                ¿Quieres un sistema como este{" "}
                <span style={{ color: `hsl(${color})` }}>para tu negocio?</span>
              </h2>
              <p
                className="text-base md:text-lg mb-8 max-w-lg mx-auto"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Te enviamos una propuesta personalizada en menos de 24 horas,
                sin costo ni compromiso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-white transition-all hover:opacity-90"
                  style={{
                    background: "hsl(var(--primary))",
                    boxShadow: "0 12px 32px -8px hsl(var(--primary) / 0.4)",
                  }}
                >
                  <MessageCircle size={18} />
                  Contactar por WhatsApp
                </a>
                {p.demo_url && (
                  <a
                    href={p.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold border transition-all hover:opacity-80"
                    style={{
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    <ExternalLink size={18} />
                    Ver demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* ── PROYECTOS RELACIONADOS ── */}
        {related && related.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div>
              <h2
                className="text-2xl font-display font-bold mb-6"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Proyectos similares
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => {
                  const rc = CATEGORY_COLORS[r.category as string] ?? "214 100% 44%";
                  return (
                    <Link
                      key={r.id}
                      href={`/portafolio/${r.slug}`}
                      className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
                      style={{
                        background: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                      }}
                    >
                      <div
                        className="h-32 overflow-hidden"
                        style={{ background: `hsl(${rc} / 0.08)` }}
                      >
                        {r.cover_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.cover_image as string}
                            alt={r.title as string}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: `hsl(${rc})` }}
                        >
                          {r.category as string}
                        </span>
                        <p
                          className="text-sm font-bold mt-1 leading-snug group-hover:text-primary transition-colors"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {r.title as string}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/portafolio"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Ver todo el portafolio <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        )}
      </div>

      <Footer />

      {/* Floating WhatsApp */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        style={{
          background: "#25D366",
          boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
        }}
        aria-label="WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
