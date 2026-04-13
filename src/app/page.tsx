import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShoppingCart,
  BarChart3,
  Calendar,
  Package,
  Globe,
  Clock,
  AlertCircle,
  Smartphone,
  TrendingUp,
  Settings2,
  Wrench,
  Layout,
  Stethoscope,
  Zap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { AnimateOnScroll } from "@/components/home/AnimateOnScroll";
import { HowToBuyTimeline } from "@/components/home/HowToBuyTimeline";

const WA_LINK =
  "https://wa.me/593982650929?text=Hola%2C%20quisiera%20conocer%20m%C3%A1s%20sobre%20sus%20soluciones%20de%20software%20para%20mi%20negocio.";

export const metadata: Metadata = {
  title: "Software a medida para negocios en Ecuador | GuambraWeb — Riobamba",
  description:
    "Sistemas de inventario, tiendas online y software de alquiler diseñados para negocios reales en Ecuador. Automatiza tu negocio y aumenta tus ventas con GuambraWeb.",
  keywords: [
    "software a medida Ecuador",
    "sistema de inventario Riobamba",
    "tienda online Ecuador",
    "software de alquiler Ecuador",
    "desarrollo web Riobamba",
    "automatizar negocio Ecuador",
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "hsl(var(--background))" }}>
      <PublicNav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center py-16 md:py-24">
        {/* Background soft gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-8 animate-fade-in"
              style={{
                background: "hsl(var(--primary) / 0.09)",
                border: "1px solid hsl(var(--primary) / 0.2)",
                color: "hsl(var(--primary))",
              }}
            >
              <Zap size={13} className="animate-pulse" />
              Riobamba, Ecuador — Software a medida
            </div>

            <h1
              className="text-4xl md:text-5xl xl:text-6xl font-display font-extrabold leading-[1.07] tracking-tighter mb-6 animate-slide-up"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Software a medida para{" "}
              <span className="gradient-text">automatizar tu negocio</span>{" "}
              y aumentar tus ventas
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed mb-10 animate-slide-up"
              style={{
                color: "hsl(var(--muted-foreground))",
                animationDelay: "80ms",
              }}
            >
              Sistemas para inventario, alquileres y ventas online, diseñados
              para negocios reales en Ecuador.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "160ms" }}>
              <Link
                href="/tienda"
                className="btn-primary rounded-full px-8 py-4 text-base font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                Ver soluciones
                <ArrowRight size={18} />
              </Link>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "hsl(142 71% 45% / 0.1)",
                  color: "hsl(142 71% 38%)",
                  border: "2px solid hsl(142 71% 45% / 0.25)",
                }}
              >
                <MessageCircle size={18} />
                Solicitar demo
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 mt-10 animate-fade-in" style={{ animationDelay: "280ms" }}>
              {[
                { icon: CheckCircle2, text: "Entrega rápida" },
                { icon: CheckCircle2, text: "Soporte incluido" },
                { icon: CheckCircle2, text: "100% personalizado" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <Icon size={15} style={{ color: "hsl(142 71% 40%)" }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup CSS */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-5 py-3.5 border-b"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
              >
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div
                  className="ml-4 flex-1 h-5 rounded-md text-[10px] font-mono flex items-center px-2"
                  style={{ background: "hsl(var(--background))", color: "hsl(var(--muted-foreground))" }}
                >
                  guambraweb.com/dashboard
                </div>
              </div>
              {/* Dashboard body */}
              <div className="p-5 space-y-4">
                {/* Metric cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Ventas hoy", value: "$1,240", color: "hsl(var(--primary))" },
                    { label: "Pedidos", value: "38", color: "hsl(142 71% 40%)" },
                    { label: "Productos", value: "214", color: "hsl(38 92% 42%)" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl p-3"
                      style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                    >
                      <p className="text-[9px] font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{m.label}</p>
                      <p className="text-base font-extrabold" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>
                {/* Bar chart */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Ventas — últimos 7 días</p>
                  <div className="flex items-end gap-2 h-14">
                    {[35, 55, 40, 75, 60, 85, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i === 5 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* List */}
                <div className="space-y-1.5">
                  {["Inventario actualizado", "Nuevo pedido #0082", "Cliente registrado"].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                      style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(142 71% 40%)" }} />
                      <span className="text-[11px] font-medium" style={{ color: "hsl(var(--foreground))" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. PAIN POINTS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 relative" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Reconoce el problema
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              ¿Esto te está pasando en tu negocio?
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Si te identificas con alguno de estos problemas, tenemos la solución.
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Package, text: "Pierdes ventas por desorden en tu inventario", delay: 0 },
              { icon: MessageCircle, text: "Gestionas pedidos y clientes por WhatsApp", delay: 80 },
              { icon: BarChart3, text: "No tienes reportes claros de tus ventas diarias", delay: 160 },
              { icon: Calendar, text: "No controlas fechas ni alquileres de productos", delay: 240 },
              { icon: Clock, text: "Pierdes horas en tareas manuales y repetitivas", delay: 320 },
              { icon: Globe, text: "No tienes presencia digital para vender las 24 horas", delay: 400 },
            ].map(({ icon: Icon, text, delay }) => (
              <AnimateOnScroll key={text} delay={delay}>
                <div
                  className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "hsl(0 84% 50% / 0.08)", color: "hsl(0 84% 50%)" }}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-medium leading-snug pt-1.5" style={{ color: "hsl(var(--foreground))" }}>
                    {text}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12 text-center" delay={200}>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-sm hover:underline transition"
              style={{ color: "hsl(var(--primary))" }}
            >
              Tenemos la solución — Hablemos ahora
              <ArrowRight size={16} />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. SOLUCIONES POR TIPO DE NEGOCIO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Soluciones específicas
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Soluciones diseñadas para tu tipo de negocio
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              No vendemos software genérico. Construimos lo que tu negocio realmente necesita.
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "👗",
                title: "Para Tiendas",
                subtitle: "sistema de inventario",
                desc: "Controla tu stock, registra ventas y genera reportes en tiempo real. Sin hojas de cálculo, sin desorden.",
                features: ["Inventario en tiempo real", "Control de ventas", "Reportes automáticos"],
                href: "/tienda",
                delay: 0,
              },
              {
                emoji: "🎭",
                title: "Para Alquileres",
                subtitle: "software de alquiler",
                desc: "Gestiona fechas de entrega, devoluciones y clientes sin errores ni llamadas perdidas.",
                features: ["Calendario de reservas", "Control de devoluciones", "Alertas automáticas"],
                href: "/tienda",
                delay: 120,
              },
              {
                emoji: "🛒",
                title: "Para Ventas Online",
                subtitle: "tienda online",
                desc: "Vende 24/7 con tu propia tienda web. Pagos integrados, carrito y gestión de pedidos.",
                features: ["Tienda 24/7", "Pasarela de pagos", "Panel de pedidos"],
                href: "/tienda",
                delay: 240,
              },
            ].map(({ emoji, title, subtitle, desc, features, href, delay }) => (
              <AnimateOnScroll key={title} delay={delay}>
                <div
                  className="flex flex-col h-full rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="text-5xl mb-5">{emoji}</div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "hsl(var(--primary))" }}>
                    {subtitle}
                  </p>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {desc}
                  </p>
                  <ul className="space-y-2 mb-8 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
                        <CheckCircle2 size={15} style={{ color: "hsl(142 71% 40%)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 group-hover:gap-3"
                    style={{
                      background: "hsl(var(--primary) / 0.08)",
                      color: "hsl(var(--primary))",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                    }}
                  >
                    Ver solución
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. PRUEBA SOCIAL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Resultados reales
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Proyectos que ya generan resultados
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Negocios en Ecuador que confiaron en GuambraWeb para crecer.
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Layout,
                client: "Chakana Ecuador",
                type: "Catálogo Digital",
                result: "Mayor visibilidad online con SEO optimizado y catálogo profesional que genera contactos.",
                url: "https://chakanaecuador.com/",
                color: "hsl(var(--primary))",
                delay: 0,
              },
              {
                icon: Stethoscope,
                client: "Lipoescultura Ecuador",
                type: "Plataforma Médica",
                result: "Captación automática de leads y citas con UX diseñada para convertir visitantes en pacientes.",
                url: "https://lipoesculturaecuador.com/",
                color: "hsl(262 83% 55%)",
                delay: 120,
              },
              {
                icon: Zap,
                client: "Fibra Express",
                type: "Web Corporativa",
                result: "Sitio ágil para servicios de internet con conversión rápida y presencia digital sólida.",
                url: "https://www.fibraexpress.net.ec/",
                color: "hsl(38 92% 42%)",
                delay: 240,
              },
            ].map(({ icon: Icon, client, type, result, url, color, delay }) => (
              <AnimateOnScroll key={client} delay={delay}>
                <div
                  className="rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ background: `color-mix(in srgb, ${color} 8%, hsl(var(--background)))` }}
                  >
                    <Icon size={56} style={{ color, opacity: 0.7 }} />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color }}
                    >
                      {type}
                    </span>
                    <h3 className="text-xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
                      {client}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {result}
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-bold hover:gap-2.5 transition-all duration-200"
                      style={{ color }}
                    >
                      Visitar proyecto <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll className="mt-12 text-center" delay={100}>
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
              style={{ color: "hsl(var(--primary))" }}
            >
              Ver portafolio completo <ArrowRight size={15} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. CÓMO FUNCIONA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <HowToBuyTimeline />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. BENEFICIOS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Por qué elegirnos
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Lo que obtienes con nuestras soluciones
            </h2>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Clock, title: "Ahorro de tiempo", desc: "Automatiza tareas manuales y recupera horas productivas cada semana.", delay: 0 },
              { icon: AlertCircle, title: "Menos errores", desc: "Elimina el factor humano en operaciones críticas como inventario y facturación.", delay: 80 },
              { icon: BarChart3, title: "Más control", desc: "Reportes en tiempo real para saber exactamente cómo está tu negocio.", delay: 160 },
              { icon: TrendingUp, title: "Mejores decisiones", desc: "Datos claros y visuales para crecer con estrategia, no con suposiciones.", delay: 240 },
              { icon: Smartphone, title: "Funciona en celular", desc: "Accede a tu sistema desde cualquier dispositivo, en cualquier lugar.", delay: 320 },
              { icon: Wrench, title: "Soporte continuo", desc: "Acompañamiento técnico para que tu sistema siempre funcione perfecto.", delay: 400 },
            ].map(({ icon: Icon, title, desc, delay }) => (
              <AnimateOnScroll key={title} delay={delay}>
                <div
                  className="flex gap-4 p-6 rounded-2xl h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1" style={{ color: "hsl(var(--foreground))" }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. CTA FUERTE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated gradient bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <AnimateOnScroll>
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "hsl(var(--primary))" }}>
              Hablemos hoy
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-6" style={{ color: "hsl(var(--foreground))" }}>
              Cuéntanos tu negocio y te mostramos cómo ayudarte
            </h2>
            <p className="text-lg mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
              Sin costos ocultos, sin compromisos. Solo una conversación para entender tu problema y mostrarte la solución.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-white font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: "#25D366",
                  boxShadow: "0 8px 24px -4px rgba(37,211,102,0.4)",
                  animation: "pulseGlow 2.5s ease-in-out infinite",
                }}
              >
                <MessageCircle size={24} />
                Hablar por WhatsApp
              </a>
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-bold text-lg transition-all duration-200 hover:-translate-y-1"
                style={{
                  border: "2px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  background: "transparent",
                }}
              >
                <ShoppingCart size={20} />
                Ver productos
              </Link>
            </div>
            <p className="mt-8 text-sm flex items-center justify-center gap-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              <CheckCircle2 size={16} style={{ color: "hsl(142 71% 40%)" }} />
              Atención personalizada en menos de 24 horas
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          8. FAQ
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Preguntas frecuentes
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Resolvemos tus dudas
            </h2>
            <p className="text-lg" style={{ color: "hsl(var(--muted-foreground))" }}>
              Todo lo que necesitas saber antes de dar el paso.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <FAQAccordion />
          </AnimateOnScroll>
          <AnimateOnScroll className="mt-10 text-center" delay={200}>
            <p className="text-sm mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
              ¿Tienes otra pregunta?
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
              style={{ color: "hsl(142 71% 38%)" }}
            >
              <MessageCircle size={15} />
              Escríbenos por WhatsApp
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          9. FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Footer />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FLOATING WHATSAPP BUTTON
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 hover:scale-110"
        style={{
          background: "#25D366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          animation: "pulseGlow 2.5s ease-in-out infinite",
        }}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
