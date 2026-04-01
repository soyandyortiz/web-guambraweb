import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  MonitorPlay,
  Database,
  ArrowRight,
  TrendingUp,
  Globe2,
  Store,
  Search,
  LayoutDashboard,
  BarChart4,
  Boxes,
  Cpu,
  CheckCircle2,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { DecorativeAnimation } from "@/components/ui/DecorativeAnimation";

export const metadata: Metadata = {
  title: "Servicios de Desarrollo Web y Sistemas | GuambraWeb",
  description:
    "Descubre nuestros servicios de desarrollo web en Riobamba y sistemas de gestión para negocios en todo Ecuador. Soluciones a medida para aumentar tus ventas.",
};

const WEB_SERVICES = [
  {
    title: "Landing Pages de Alta Conversión",
    desc: "Diseñamos páginas de aterrizaje enfocadas en un solo objetivo: convertir visitantes en clientes. Perfectas para campañas de publicidad y captación de leads.",
    benefits: ["Diseño ultra-rápido", "Integración con WhatsApp/CRM", "Textos persuasivos"],
    icon: Zap,
    color: "var(--primary)",
  },
  {
    title: "Páginas Web Corporativas",
    desc: "Tu empresa merece una presencia digital profesional. Creamos sitios que transmiten confianza, autoridad y exponen tus servicios al mundo.",
    benefits: ["Diseño multidispositivo", "Autoadministrables", "Correos corporativos"],
    icon: Globe2,
    color: "var(--secondary)",
  },
  {
    title: "Tiendas Online (E-commerce)",
    desc: "Automatiza tus ventas 24/7. Desarrollamos tiendas virtuales completas con carritos de compra, gestión de inventario y pasarelas de pago locales.",
    benefits: ["Pasarela de pagos", "Gestión de stock", "Panel de administración"],
    icon: Store,
    color: "var(--accent)",
  },
  {
    title: "Optimización SEO Local",
    desc: "Haz que los clientes de Riobamba y Ecuador te encuentren en Google. Optimizamos tu sitio web para liderar los resultados de búsqueda en tu sector.",
    benefits: ["Auditoría técnica SEO", "Optimización de velocidad", "Google Mi Negocio"],
    icon: Search,
    color: "var(--warning)",
  },
];

const MANAGEMENT_SERVICES = [
  {
    title: "Sistemas Administrativos",
    desc: "Centraliza la información de tu empresa. Gestiona empleados, proveedores y clientes desde una única plataforma accesible en la nube.",
    benefits: ["Acceso 24/7 seguro", "Múltiples sucursales", "Perfiles de usuario"],
    icon: LayoutDashboard,
    color: "var(--primary)",
  },
  {
    title: "Sistemas de Gestión de Ventas",
    desc: "Lleva el control exacto de tus ingresos. Software de punto de venta (POS) rápido, facturación e historial de compras de tus clientes.",
    benefits: ["Reportes de ventas", "Historial de clientes", "Cierres de caja"],
    icon: BarChart4,
    color: "var(--secondary)",
  },
  {
    title: "Control de Inventario Preciso",
    desc: "Olvídate de las pérdidas por falta de stock. Sistemas para seguimiento de mercadería, alertas de escasez y gestión de múltiples bodegas.",
    benefits: ["Alertas automáticas", "Control de bodegas", "Trazabilidad de productos"],
    icon: Boxes,
    color: "var(--accent)",
  },
  {
    title: "Automatización de Procesos",
    desc: "Digitaliza tareas manuales repetitivas. Ahorra cientos de horas al mes automatizando la recolección de datos y la generación de reportes.",
    benefits: ["Ahorro de tiempo", "Reducción de errores", "Flujos de trabajo personalizados"],
    icon: Cpu,
    color: "var(--success)",
  },
];

const FAQS = [
  {
    question: "¿Cuánto cuesta desarrollar una página web en Riobamba?",
    answer: "El costo depende de la complejidad (landing page, web corporativa o tienda online). Ofrecemos soluciones desde sitios básicos hasta sistemas a medida. Contáctanos para un presupuesto sin compromiso adaptado a tus necesidades y objetivos comerciales reales."
  },
  {
    question: "¿En qué ciudades de Ecuador brindan sus servicios?",
    answer: "Nuestra oficina principal está en Riobamba, pero atendemos clientes en Quito, Guayaquil, Cuenca y todo Ecuador gracias a nuestras metodologías remotas de trabajo, reuniones por Zoom y soporte continuo en línea."
  },
  {
    question: "¿Cómo funciona un Sistema de Gestión a medida?",
    answer: "A diferencia de un software enlatado, un sistema a medida se construye para adaptarse a tus procesos exactos. Primero analizamos cómo funciona tu negocio (inventarios, ventas) y luego programamos una plataforma web a la que accederás de forma segura desde cualquier lugar."
  },
  {
    question: "¿Incluyen el hosting y el dominio en el servicio?",
    answer: "Sí, todos nuestros planes de desarrollo web inicial incluyen hosting rápido y seguro, dominio por un año (.com, .net) y certificados de seguridad SSL para garantizar que tu sitio sea confiable para Google y tus clientes."
  }
];

export default function ServicesPage() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-primary/20"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <PublicNav />

      {/* ── HEADER SERVICIOS ── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <DecorativeAnimation type="icons" count={10} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, hsl(var(--secondary) / 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm"
              style={{
                background: "hsl(var(--secondary) / 0.1)",
                border: "1px solid hsl(var(--secondary) / 0.2)",
                color: "hsl(var(--secondary))",
              }}
            >
              <TrendingUp size={14} /> Soluciones de Alto Impacto
            </div>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-6 tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Nuestros <span className="gradient-text">Servicios</span>
          </h1>
          <p
            className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Ofrecemos herramientas tecnológicas diseñadas específicamente para
            aumentar las ventas y optimizar las operaciones de tu negocio.
          </p>
        </div>
      </section>

      {/* ── 1) DESARROLLO WEB EN RIOBAMBA ── */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                color: "white",
                boxShadow: "0 10px 25px -5px hsl(var(--primary)/0.4)",
              }}
            >
              <MonitorPlay size={32} />
            </div>
            <div>
              <h2
                className="text-3xl md:text-5xl font-display font-bold tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Desarrollo Web en Riobamba
              </h2>
              <p
                className="text-lg mt-2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Tu escaparate digital 24/7 diseñado para generar confianza y conversiones.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WEB_SERVICES.map((srv, i) => {
              const Icon = srv.icon;
              return (
                <div
                  key={i}
                  className="group bg-card rounded-[2rem] border p-8 flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `hsl(${srv.color} / 0.1)`,
                      color: `hsl(${srv.color})`,
                    }}
                  >
                    <Icon size={28} />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {srv.title}
                  </h3>
                  <p
                    className="text-sm mb-6 flex-1 leading-relaxed"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {srv.desc}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {srv.benefits.map((benefit, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm font-medium"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <PlusCircle
                          size={16}
                          className="shrink-0 mt-0.5"
                          style={{ color: `hsl(${srv.color})` }}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 font-bold hover:underline transition-all text-lg"
              style={{ color: "hsl(var(--primary))" }}
            >
              Consultar por servicios web <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2) SISTEMAS DE GESTIÓN EN ECUADOR ── */}
      <section
        className="py-24 mt-20 relative"
        style={{ background: "hsl(var(--card) / 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16 flex-row-reverse md:flex-row text-right md:text-left">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 md:mr-0 ml-4 md:ml-0"
              style={{
                background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))",
                color: "white",
                boxShadow: "0 10px 25px -5px hsl(var(--accent)/0.4)",
              }}
            >
              <Database size={32} />
            </div>
            <div className="flex-1">
              <h2
                className="text-3xl md:text-5xl font-display font-bold tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Sistemas de Gestión para Negocios en Ecuador
              </h2>
              <p
                className="text-lg mt-2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                El motor de tu empresa. Software a medida para organizar y controlar tus operaciones.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {MANAGEMENT_SERVICES.map((srv, i) => {
              const Icon = srv.icon;
              return (
                <div
                  key={i}
                  className="group bg-card rounded-[2rem] border p-10 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div
                    className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none"
                  >
                    <Icon size={192} style={{ color: `hsl(${srv.color})` }} />
                  </div>
                  
                  <div
                    className="w-20 h-20 shrink-0 rounded-[1.5rem] flex items-center justify-center relative z-10"
                    style={{
                      background: `hsl(${srv.color} / 0.1)`,
                      color: `hsl(${srv.color})`,
                    }}
                  >
                    <Icon size={40} />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <h3
                      className="text-2xl font-bold mb-4"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {srv.title}
                    </h3>
                    <p
                      className="text-base mb-6 leading-relaxed"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {srv.desc}
                    </p>
                    <div className="space-y-3">
                      <h4
                        className="text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Resultados Clave:
                      </h4>
                      {srv.benefits.map((benefit, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-3 text-sm font-medium"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          <CheckCircle2
                            size={18}
                            style={{ color: `hsl(${srv.color})` }}
                          />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 font-bold hover:underline transition-all text-lg"
              style={{ color: "hsl(var(--accent))" }}
            >
              Potenciar mi negocio con software <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ OPTIMIZADO PARA SEO ── */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center bg-card border shadow-sm text-primary"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <HelpCircle size={32} />
              </div>
            </div>
            <h2
              className="text-4xl font-display font-bold mb-4 tracking-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Preguntas Frecuentes
            </h2>
            <p
              className="text-lg"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Resolvemos tus dudas principales para que des el paso con seguridad.
            </p>
          </div>

          <div className="space-y-6">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="p-8 rounded-[2rem] border bg-card transition-shadow hover:shadow-lg"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {faq.question}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Script de Datos Estructurados (Schema.org) para el FAQ SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 relative">
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
                ¿Listo para transformar <br /> tu presencia digital?
              </h2>
              <p
                className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Hablemos sobre las necesidades específicas de tu empresa en Ecuador. Te asesoramos sin costo ni compromiso.
              </p>
              <Link
                href="/contacto"
                className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-primary/30 transition-shadow"
              >
                Agendar Consultoría Gratuita <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
