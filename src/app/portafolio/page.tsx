import type { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  ShoppingCart,
  Zap,
  Layout,
  Smartphone,
  CheckCircle2,
  Database,
  Coffee,
  Users,
  Shirt,
  Stethoscope,
  Dumbbell,
  ArrowRight,
  MonitorPlay,
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { DecorativeAnimation } from "@/components/ui/DecorativeAnimation";

export const metadata: Metadata = {
  title: "Portafolio de Proyectos Web y Sistemas | GuambraWeb",
  description:
    "Descubre nuestro portafolio de proyectos web y sistemas de gestión a medida desarrollados en Riobamba y todo Ecuador. Experiencia comprobada en resultados digitales.",
};

const WEB_PROJECTS = [
  {
    name: "Chakana Ecuador",
    url: "https://chakanaecuador.com/",
    desc: "Sitio web corporativo y catálogo optimizado para SEO, destacando servicios y productos con una navegación intuitiva y un diseño profesional.",
    tags: ["Sitio Web", "Catálogo", "SEO Local"],
    color: "var(--primary)",
    icon: Layout,
  },
  {
    name: "Lipoescultura Ecuador",
    url: "https://lipoesculturaecuador.com/",
    desc: "Plataforma web médica diseñada para captación de leads y agendamiento de citas, con alto enfoque en experiencia de usuario y posicionamiento.",
    tags: ["Salud y Estética", "Captación de Leads", "Landing Page"],
    color: "var(--secondary)",
    icon: Stethoscope,
  },
  {
    name: "Fibra Express",
    url: "https://www.fibraexpress.net.ec/",
    desc: "Sitio web corporativo ágil para servicios de internet, diseñado para la conversión rápida de clientes y la disponibilidad de información 24/7.",
    tags: ["Telecomunicaciones", "Sitio Corporativo", "Conversión"],
    color: "var(--accent)",
    icon: Zap,
  },
  {
    name: "Qori Menu",
    url: "https://qorimenu.glide.page/dl/74c4fe",
    desc: "Aplicación de menú digital interactivo y dinámico. Permite a los clientes navegar por las opciones del restaurante de forma rápida y moderna.",
    tags: ["Web App", "Restaurantes", "Menú Digital"],
    color: "var(--warning)",
    icon: Smartphone,
  },
];

const MANAGEMENT_SYSTEMS = [
  {
    title: "Sistema de Gestión de Cafetería",
    desc: "Plataforma integral para control de inventario de insumos, gestión de pedidos en tiempo real, facturación ágil y reportes de ventas diarios. Diseñado para optimizar flujos de atención y minimizar tiempos de espera.",
    icon: Coffee,
    color: "var(--primary)",
    features: ["Control de Inventario", "Punto de Venta (POS)", "Reportes"],
  },
  {
    title: "Sistema Médico Odontológico",
    desc: "Software especializado para clínicas dentales. Incluye historias clínicas digitales, agenda de citas inteligente, control de tratamientos por paciente y gestión de pagos. Cumple con los estándares de privacidad.",
    icon: Stethoscope,
    color: "var(--secondary)",
    features: ["Historias Clínicas", "Agendamiento", "Facturación"],
  },
  {
    title: "Sistema de Gestión de Gimnasio",
    desc: "Administración completa de socios, control de asistencias, gestión de membresías y pagos recurrentes. Incluye perfiles de usuarios y alertas de vencimiento para maximizar la retención de clientes.",
    icon: Dumbbell,
    color: "var(--accent)",
    features: ["Control de Acceso", "Membresías", "Notificaciones"],
  },
  {
    title: "Sistema de Gestión de Grupos de Baile",
    desc: "Herramienta organizativa para academias y agrupaciones de danza. Permite al administrador controlar ensayos, asistencia de bailarines, gestión de vestuarios y organización de presentaciones o eventos.",
    icon: Users,
    color: "var(--success)",
    features: ["Asistencia", "Eventos", "Perfiles Deportivos"],
  },
  {
    title: "Software de Alquiler de Trajes Típicos",
    desc: "Sistema enfocado en el control preciso del catálogo de trajes. Gestiona disponibilidad, reservas, multas por retrasos, cobros y devoluciones, asegurando la integridad del inventario en todo momento.",
    icon: Shirt,
    color: "var(--warning)",
    features: ["Catálogo de Inventario", "Reservas", "Control de Multas"],
  },
];

export default function PortfolioPage() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-primary/20"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <PublicNav />

      {/* ── HEADER PORTAFOLIO ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <DecorativeAnimation type="icons" count={12} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% -20%, hsl(var(--primary) / 0.1) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-6 tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Nuestro <span className="gradient-text">Portafolio</span>
          </h1>
          <p
            className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Explora una selección de los proyectos web y sistemas a medida que
            hemos desarrollado para transformar negocios reales.
          </p>
        </div>
      </section>

      {/* ── PROYECTOS WEB (SITIOS PUBLICADOS) ── */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 flex items-center justify-between">
            <div>
              <h2
                className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight flex items-center gap-4"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <MonitorPlay className="hidden sm:block text-primary" size={36} />
                Proyectos Web Realizados
              </h2>
              <p
                className="text-lg"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Sitios web corporativos, catálogos y landing pages optimizadas
                para la conversión de ventas.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {WEB_PROJECTS.map((project, i) => {
              const Icon = project.icon;
              return (
                <div
                  key={i}
                  className="group flex flex-col sm:flex-row gap-6 p-8 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden bg-card"
                  style={{
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-bl-[100px] pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, hsl(${project.color}), transparent)`,
                    }}
                  />
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 z-10"
                    style={{
                      background: `linear-gradient(135deg, hsl(${project.color} / 0.15), hsl(${project.color} / 0.05))`,
                      color: `hsl(${project.color})`,
                    }}
                  >
                    <Icon size={36} />
                  </div>
                  <div className="flex-1 flex flex-col z-10">
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {project.name}
                    </h3>
                    <p
                      className="text-base mb-6 leading-relaxed flex-1"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-semibold rounded-full border bg-background/50 backdrop-blur-sm"
                          style={{
                            color: "hsl(var(--foreground))",
                            borderColor: "hsl(var(--border))",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 w-full sm:w-auto hover:scale-105"
                        style={{
                          background: `hsl(${project.color})`,
                          color: "#ffffff",
                          boxShadow: `0 8px 20px -5px hsl(${project.color} / 0.4)`,
                        }}
                      >
                        Visitar Sitio <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SISTEMAS DE GESTIÓN (A MEDIDA) ── */}
      <section
        className="py-32 mt-10 relative"
        style={{ background: "hsl(var(--card) / 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 flex items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                  color: "white",
                  boxShadow: "0 10px 30px -10px hsl(var(--primary)/0.5)",
                }}
              >
                <Database size={32} />
              </div>
            </div>
            <h2
              className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Sistemas de Gestión Desarrollados
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Aplicaciones de software complejas y a medida, diseñadas
              estrictamente para resolver problemas operativos reales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MANAGEMENT_SYSTEMS.map((sys, i) => {
              const Icon = sys.icon;
              return (
                <div
                  key={i}
                  className="group bg-card rounded-[2rem] border p-8 flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  {/* Decorative faint background element */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-700"
                  >
                    <Icon size={192} style={{ color: `hsl(${sys.color})` }} />
                  </div>
                  
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10"
                    style={{
                      background: `hsl(${sys.color} / 0.1)`,
                      color: `hsl(${sys.color})`,
                    }}
                  >
                    <Icon size={28} />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4 relative z-10"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {sys.title}
                  </h3>
                  <p
                    className="text-base mb-8 flex-1 leading-relaxed relative z-10"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {sys.desc}
                  </p>
                  
                  <div className="space-y-3 relative z-10">
                    <h4
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Módulos Principales:
                    </h4>
                    {sys.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm font-medium"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <CheckCircle2
                          size={16}
                          style={{ color: `hsl(${sys.color})` }}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA CONTACTO ── */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="p-12 sm:p-16 rounded-[3rem] border shadow-xl relative overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-20"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--secondary)/0.2))",
              }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl md:text-5xl font-display font-extrabold mb-6"
                style={{ color: "hsl(var(--foreground))" }}
              >
                ¿Quieres que tu empresa sea el próximo <span className="gradient-text">caso de éxito?</span>
              </h2>
              <p
                className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Desarrollamos tecnología orientada a resultados. Cuéntanos tu
                idea y diseñaremos una solución a la medida de tu presupuesto.
              </p>
              <Link
                href="/contacto"
                className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-primary/30 transition-shadow"
              >
                Inicia tu proyecto hoy <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
