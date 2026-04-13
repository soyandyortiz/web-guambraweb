import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { AnimateOnScroll } from "@/components/home/AnimateOnScroll";
import { PortafolioGrid } from "@/components/portafolio/PortafolioGrid";
import { ArrowRight, MessageCircle } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portafolio de Proyectos Web y Sistemas | GuambraWeb",
  description:
    "Proyectos de software desarrollados para negocios reales en Ecuador. Sistemas de gestión, tiendas online, plataformas de alquiler y más. Resultados reales, tecnología a medida.",
};

const WA_LINK =
  "https://wa.me/593982650929?text=Hola%2C%20vi%20su%20portafolio%20y%20me%20interesa%20un%20proyecto%20similar";

export default async function PortafolioPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("portfolio_projects")
    .select(
      "id, title, slug, category, client_name, short_description, cover_image, tech_stack, is_featured, order_index"
    )
    .eq("is_published", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  const safeProjects = projects ?? [];

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "hsl(var(--background))" }}
    >
      <PublicNav />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <AnimateOnScroll animation="fade-up">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                border: "1px solid hsl(var(--primary) / 0.2)",
              }}
            >
              {safeProjects.length} proyectos entregados
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={80}>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-6 tracking-tight leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Proyectos de software{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                para negocios reales
              </span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={160}>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Sistemas de gestión, plataformas web y soluciones diseñadas para
              mejorar ventas, organización y productividad en Ecuador.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={220}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
                style={{
                  background: "hsl(var(--primary))",
                  boxShadow: "0 8px 24px -6px hsl(var(--primary) / 0.4)",
                }}
              >
                <MessageCircle size={18} />
                Quiero algo similar
              </a>
              <Link
                href="#proyectos"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-bold border transition-all hover:opacity-80"
                style={{
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              >
                Ver proyectos
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── GRID CON FILTROS (client component) ── */}
      <section id="proyectos" className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <PortafolioGrid projects={safeProjects as any} />
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll animation="fade-up">
            <div
              className="rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <h2
                  className="text-3xl md:text-4xl font-display font-extrabold mb-4 tracking-tight"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  ¿Quieres que tu negocio sea el{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    próximo caso de éxito?
                  </span>
                </h2>
                <p
                  className="text-lg mb-8 max-w-xl mx-auto"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Cuéntanos tu idea y te enviamos una propuesta personalizada en
                  menos de 24 horas, sin compromiso.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-white text-lg transition-all hover:opacity-90"
                  style={{
                    background: "hsl(var(--primary))",
                    boxShadow: "0 12px 32px -8px hsl(var(--primary) / 0.4)",
                  }}
                >
                  <MessageCircle size={20} />
                  Iniciar proyecto por WhatsApp
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

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
