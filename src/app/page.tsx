import type { Metadata } from "next";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  MonitorPlay,
  Database,
  Smartphone,
  Layers,
  MessageCircle,
  ShoppingCart,
  Layout,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { SpotlightCard, TextGlow } from "@/components/ui/SpotlightCard";
// Dynamic components
import dynamic from "next/dynamic";

const CodingAnimation = dynamic(() => import("@/components/home/CodingAnimation").then(mod => mod.CodingAnimation));
const HowToBuyTimeline = dynamic(() => import("@/components/home/HowToBuyTimeline").then(mod => mod.HowToBuyTimeline));
const NewsletterSection = dynamic(() => import("@/components/home/NewsletterSection").then(mod => mod.NewsletterSection));

export const metadata: Metadata = {
  title:
    "Desarrollo Web y Sistemas de Gestión en Riobamba y Ecuador | GuambraWeb",
  description:
    "GuambraWeb: Agencia tecnológica en Riobamba. Especialistas en desarrollo web, tiendas online y sistemas de gestión para negocios en todo Ecuador.",
};

export default function HomePage() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-primary/20"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <PublicNav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-80px)] py-12 md:py-16 header-glow">
        {/* Decorative Background: Coding Animation */}
        <div className="absolute top-20 right-[10%] hidden lg:block max-w-[250px]">
          <CodingAnimation />
        </div>
        <div className="absolute bottom-20 left-[10%] hidden lg:block max-w-[250px]">
          <CodingAnimation />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-sm"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                border: "1px solid hsl(var(--primary) / 0.2)",
                color: "hsl(var(--primary))",
              }}
            >
              <Zap size={14} className="animate-pulse" />
              Agencia de Desarrollo de Software
            </div>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-5 leading-[1.1] tracking-tighter"
            style={{ color: "hsl(var(--foreground))" }}
          >
            <TextGlow>Desarrollo Web</TextGlow> y Sistemas de Gestión en{" "}
            <span className="gradient-text">Riobamba, Ecuador</span>
          </h1>

          <p
            className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Transformamos tu visión en soluciones tecnológicas de alto
            rendimiento. Especialistas en e-commerce y automatización de
            procesos.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              href="/portafolio"
              className="btn-primary flex items-center justify-center text-base md:text-lg rounded-full px-6 py-3 md:px-10 md:py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_hsl(var(--primary)/0.3)] transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Ver Portafolio
              <ArrowRight size={22} className="ml-2" />
            </Link>
            <Link
              href="/contacto"
              className="flex items-center justify-center text-base md:text-lg rounded-full px-6 py-3 md:px-10 md:py-4 font-bold transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
              style={{
                background: "hsl(var(--secondary) / 0.1)",
                color: "hsl(var(--secondary))",
                border: "2px solid hsl(var(--secondary) / 0.2)",
              }}
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS DESTACADOS ── */}
      <section
        className="py-32 relative"
        style={{ background: "hsl(var(--card) / 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2
              className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              <TextGlow>Nuestros Servicios</TextGlow> Core
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Enfocados en brindar resultados medibles para el crecimiento de tu
              empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Bloque 1: Desarrollo Web */}
            <SpotlightCard className="p-10 md:p-14 rounded-[2rem] h-full">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-10 transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                  color: "white",
                  boxShadow: "0 10px 25px -5px hsl(var(--primary)/0.5)",
                }}
              >
                <MonitorPlay size={40} />
              </div>
              <h3
                className="text-3xl font-bold mb-5 tracking-tight relative z-10"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Desarrollo Web en Riobamba
              </h3>
              <p
                className="text-lg mb-8 leading-relaxed relative z-10"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Creamos sitios web rápidos, modernos y optimizados para SEO
                local. Desde landing pages para captación de leads hasta
                e-commerce completos que venden 24/7.
              </p>
              <ul className="space-y-4 mb-10 relative z-10">
                {[
                  "Tiendas Online (E-commerce)",
                  "Sitios Web Corporativos",
                  "SEO Local y Posicionamiento",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-lg font-medium"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <CheckCircle2
                      size={22}
                      style={{ color: "hsl(var(--primary))" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/servicios"
                className="inline-flex items-center text-lg font-bold hover:underline transition-all relative z-10 hover:translate-x-2"
                style={{ color: "hsl(var(--primary))" }}
              >
                Conocer más sobre web <ArrowRight size={20} className="ml-2" />
              </Link>
            </SpotlightCard>

            {/* Bloque 2: Sistemas de Gestión */}
            <SpotlightCard className="p-10 md:p-14 rounded-[2rem] h-full">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-10 transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))",
                  color: "white",
                  boxShadow: "0 10px 25px -5px hsl(var(--accent)/0.5)",
                }}
              >
                <Database size={40} />
              </div>
              <h3
                className="text-3xl font-bold mb-5 tracking-tight relative z-10"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Sistemas de Gestión para Negocios en Ecuador
              </h3>
              <p
                className="text-lg mb-8 leading-relaxed relative z-10"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Automatiza tu empresa con software a medida. Sistemas de
                inventario, facturación, CRM y ERP adaptados a la realidad
                comercial ecuatoriana.
              </p>
              <ul className="space-y-4 mb-10 relative z-10">
                {[
                  "Sistemas de Inventario y Ventas",
                  "Dashboards y Reportes en Tiempo Real",
                  "Aplicaciones Web a Medida",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-lg font-medium"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <CheckCircle2
                      size={22}
                      style={{ color: "hsl(var(--accent))" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/servicios"
                className="inline-flex items-center text-lg font-bold hover:underline transition-all relative z-10 hover:translate-x-2"
                style={{ color: "hsl(var(--accent))" }}
              >
                Conocer más sobre sistemas{" "}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ── ROADMAP: CÓMO COMPRAR ── */}
      <HowToBuyTimeline />

      {/* ── PROYECTOS DESTACADOS ── */}
      <section className="py-32 header-glow">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2
                className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <TextGlow>Proyectos</TextGlow> Destacados
              </h2>
              <p
                className="text-xl"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Soluciones reales que han impulsado el crecimiento y las ventas
                de nuestros clientes.
              </p>
            </div>
            <Link
              href="/portafolio"
              className="btn-secondary rounded-full px-8 py-3 whitespace-nowrap hidden sm:inline-flex text-lg hover:-translate-y-1 transition-transform"
            >
              Ver todos los proyectos
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Chakana Ecuador",
                type: "Catálogo Digital",
                desc: "Sitio web corporativo y catálogo optimizado para SEO, destacando servicios y productos con una navegación intuitiva.",
                color: "var(--primary)",
                icon: Layout,
                url: "https://chakanaecuador.com/",
              },
              {
                title: "Lipoescultura Ecuador",
                type: "Plataforma Médica",
                desc: "Plataforma web médica diseñada para captación de leads y agendamiento de citas, con alto enfoque en UX.",
                color: "var(--secondary)",
                icon: Stethoscope,
                url: "https://lipoesculturaecuador.com/",
              },
              {
                title: "Fibra Express",
                type: "Telecomunicaciones",
                desc: "Sitio web corporativo ágil para servicios de internet, diseñado para la conversión rápida de clientes.",
                color: "var(--accent)",
                icon: Zap,
                url: "https://www.fibraexpress.net.ec/",
              },
            ].map((project, i) => {
              const Icon = project.icon;
              return (
                <SpotlightCard
                  key={i}
                  className="rounded-3xl flex flex-col h-full group"
                >
                  <div
                    className="h-56 relative flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, hsl(${project.color} / 0.15), hsl(${project.color} / 0.05))`,
                    }}
                  >
                    <Icon
                      size={80}
                      style={{ color: `hsl(${project.color})` }}
                      className="transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-700 opacity-60"
                    />
                    <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white/90 text-slate-900 shadow-md backdrop-blur-sm">
                      {project.type}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3
                      className="text-2xl font-bold mb-4"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-base mb-8 flex-1 leading-relaxed"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {project.desc}
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold flex items-center hover:opacity-80 transition-opacity"
                      style={{ color: `hsl(${project.color})` }}
                    >
                      Visitar Proyecto{" "}
                      <ArrowRight
                        size={18}
                        className="ml-2 transform group-hover:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link
              href="/portafolio"
              className="btn-secondary rounded-full px-8 py-3 inline-flex text-lg"
            >
              Ver todos los proyectos
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN DE NEWSLETTER / MARKETING ── */}
      <NewsletterSection />

      {/* ── CTA FINAL WHATSAPP ── */}
      <section className="py-32 relative overflow-hidden header-glow">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <SpotlightCard className="p-12 md:p-20 text-center rounded-[3rem]">
            <div className="relative z-10">
              <h2
                className="text-4xl md:text-6xl font-display font-extrabold mb-8 tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                ¿Listo para dar el{" "}
                <span className="gradient-text">siguiente paso?</span>
              </h2>
              <p
                className="mb-12 text-xl max-w-3xl mx-auto leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Escríbenos por WhatsApp y cuéntanos sobre tu negocio. Te
                asesoramos sin costo para encontrar la solución digital
                perfecta.
              </p>

              <a
                href="https://wa.me/593982650929?text=Hola,%20quisiera%20más%20información%20sobre%20sus%20servicios%20de%20desarrollo."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-bold text-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)]"
                style={{ background: "#25D366" }}
              >
                <MessageCircle size={28} />
                Hablar por WhatsApp
              </a>

              <p
                className="mt-8 text-base font-medium flex items-center justify-center gap-3"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <CheckCircle2 size={20} className="text-green-500" />
                Atención rápida y personalizada
              </p>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
