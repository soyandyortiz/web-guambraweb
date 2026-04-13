import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Target,
  Zap,
  TrendingUp,
  HeartHandshake,
  ShoppingCart,
  Settings2,
  Package,
  Search,
  FileText,
  Code2,
  Rocket,
  Wrench,
  Github,
  Terminal,
  Cpu,
  Eye,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { AnimateOnScroll } from "@/components/home/AnimateOnScroll";
import { CounterStat } from "@/components/home/CounterStat";
import { FAQAccordion } from "@/components/home/FAQAccordion";

const WA_LINK =
  "https://wa.me/593982650929?text=Hola%2C%20vi%20la%20p%C3%A1gina%20de%20Nosotros%20y%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20soluciones.";

export const metadata: Metadata = {
  title: "Nosotros — GuambraWeb | Software a medida en Riobamba, Ecuador",
  description:
    "Conoce a GuambraWeb: el equipo detrás de los sistemas de gestión, tiendas online y software a medida para negocios en Ecuador. Con sede en Riobamba, desarrollamos soluciones que generan resultados reales.",
  keywords: [
    "software a medida Ecuador",
    "desarrollo de sistemas Riobamba",
    "automatización de negocios Ecuador",
    "agencia de software Ecuador",
    "quiénes somos GuambraWeb",
  ],
};

const team = [
  {
    name: "Andy O.",
    role: "Fullstack Developer & Founder",
    focus: "Arquitecturas escalables, backend y liderazgo de proyectos.",
    github: "https://github.com/soyandyortiz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andy&backgroundColor=b6e3f4",
    icon: Terminal,
  },
  {
    name: "Carlos M.",
    role: "Frontend Engineer",
    focus: "Interfaces modernas y experiencias de usuario rápidas con React y Next.js.",
    github: "https://github.com/carlosdev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=c0aede",
    icon: Code2,
  },
  {
    name: "Diana S.",
    role: "UI/UX Designer",
    focus: "Diseño centrado en el usuario que convierte visitas en clientes.",
    github: "https://github.com/dianadesign",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana&backgroundColor=ffdfbf",
    icon: Eye,
  },
  {
    name: "Luis F.",
    role: "Backend & Cloud",
    focus: "Rendimiento, seguridad e infraestructura cloud para aplicaciones robustas.",
    github: "https://github.com/luiscloud",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis&backgroundColor=d1f0b1",
    icon: Cpu,
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ background: "hsl(var(--background))" }}>
      <PublicNav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, hsl(var(--primary) / 0.07) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center relative z-10">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-8 animate-fade-in"
              style={{
                background: "hsl(var(--primary) / 0.09)",
                border: "1px solid hsl(var(--primary) / 0.2)",
                color: "hsl(var(--primary))",
              }}
            >
              <MapPin size={13} />
              GuambraWeb · Riobamba, Ecuador
            </div>

            <h1
              className="text-4xl md:text-5xl xl:text-6xl font-display font-extrabold leading-[1.07] tracking-tighter mb-6 animate-slide-up"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Creamos software que ayuda a negocios a{" "}
              <span className="gradient-text">crecer y automatizar</span>{" "}
              sus procesos
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed mb-10 animate-slide-up"
              style={{ color: "hsl(var(--muted-foreground))", animationDelay: "80ms" }}
            >
              En GuambraWeb desarrollamos sistemas a medida enfocados en resultados reales:
              más control, más ventas y menos errores para negocios en Ecuador.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "160ms" }}>
              <Link
                href="/portafolio"
                className="btn-primary rounded-full px-8 py-4 text-base font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                Ver nuestro trabajo
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
                Hablemos
              </a>
            </div>
          </div>

          {/* Right: team avatars + code card */}
          <div className="hidden lg:flex flex-col gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Avatar row */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {team.map((m) => (
                  <div
                    key={m.name}
                    className="w-14 h-14 rounded-full border-4 overflow-hidden bg-card"
                    style={{ borderColor: "hsl(var(--background))" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                  El equipo GuambraWeb
                </p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Riobamba, Ecuador 🇪🇨
                </p>
              </div>
            </div>

            {/* Code card */}
            <div
              className="rounded-3xl overflow-hidden shadow-xl"
              style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <div
                className="flex items-center gap-2 px-5 py-3 border-b"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
              >
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                  guambraweb.ts
                </span>
              </div>
              <div className="p-6">
                <code className="text-sm font-mono block leading-7" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <span style={{ color: "hsl(var(--primary))" }}>const</span>{" "}
                  <span style={{ color: "hsl(262 83% 55%)" }}>GuambraWeb</span> = {"{"}
                  <br />
                  &nbsp;&nbsp;ubicacion:{" "}
                  <span style={{ color: "hsl(142 71% 40%)" }}>&quot;Riobamba, EC&quot;</span>,
                  <br />
                  &nbsp;&nbsp;especialidad:{" "}
                  <span style={{ color: "hsl(142 71% 40%)" }}>&quot;Software a medida&quot;</span>,
                  <br />
                  &nbsp;&nbsp;enfoque:{" "}
                  <span style={{ color: "hsl(142 71% 40%)" }}>&quot;Resultados reales&quot;</span>,
                  <br />
                  &nbsp;&nbsp;soporte:{" "}
                  <span style={{ color: "hsl(var(--primary))" }}>true</span>
                  <br />
                  {"}"};
                  <br />
                  <br />
                  <span style={{ color: "hsl(var(--primary))" }}>function</span>{" "}
                  <span style={{ color: "hsl(262 83% 55%)" }}>resolverProblemas</span>() {"{"}
                  <br />
                  &nbsp;&nbsp;<span style={{ color: "hsl(var(--primary))" }}>return</span>{" "}
                  <span style={{ color: "hsl(142 71% 40%)" }}>&quot;Tu negocio automatizado 🚀&quot;</span>;
                  <br />
                  {"}"}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. HISTORIA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll>
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Nuestra historia
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-10" style={{ color: "hsl(var(--foreground))" }}>
              Por qué empezamos
            </h2>
          </AnimateOnScroll>

          <div className="space-y-6">
            {[
              {
                text: "Vimos muchos negocios en Ecuador perder ventas y tiempo porque no tenían las herramientas digitales adecuadas. Dueños de tiendas controlando su inventario en cuadernos. Negocios de alquiler coordinando fechas por WhatsApp. Emprendedores sin presencia online porque las soluciones existentes eran demasiado caras o complicadas.",
                delay: 0,
              },
              {
                text: "Esa frustración fue el motor. Decidimos que en lugar de esperar a que alguien lo resolviera, íbamos a construirlo nosotros. GuambraWeb nació en Riobamba con una misión clara: hacer tecnología accesible, simple y enfocada en resolver problemas reales de negocios reales.",
                delay: 100,
              },
              {
                text: "Hoy creamos sistemas de inventario, tiendas online, plataformas de gestión y software a medida para negocios que quieren crecer sin depender de hojas de cálculo o mensajes de WhatsApp. Cada proyecto que entregamos está construido pensando en una sola pregunta: ¿esto va a ayudar al negocio a vender más o a funcionar mejor?",
                delay: 200,
              },
            ].map(({ text, delay }, i) => (
              <AnimateOnScroll key={i} delay={delay} animation="fade-left">
                <p className="text-lg leading-relaxed pl-5 border-l-2" style={{
                  color: "hsl(var(--muted-foreground))",
                  borderColor: "hsl(var(--primary) / 0.3)",
                }}>
                  {text}
                </p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. ENFOQUE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Nuestra diferencia
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Nuestro enfoque
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              No somos una agencia genérica. Aquí lo que nos diferencia.
            </p>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Target,
                title: "Soluciones reales",
                desc: "No vendemos software genérico. Construimos exactamente lo que tu negocio necesita para funcionar mejor.",
                color: "hsl(var(--primary))",
                delay: 0,
              },
              {
                icon: Zap,
                title: "Simplicidad",
                desc: "Sistemas fáciles de usar desde el primer día. Sin manuales de 100 páginas ni capacitación complicada.",
                color: "hsl(38 92% 42%)",
                delay: 100,
              },
              {
                icon: TrendingUp,
                title: "Enfoque en resultados",
                desc: "Cada línea de código que escribimos tiene un objetivo: más ventas, más control o menos errores para tu negocio.",
                color: "hsl(142 71% 40%)",
                delay: 200,
              },
              {
                icon: HeartHandshake,
                title: "Acompañamiento",
                desc: "No te dejamos solo después de entregar. Estamos aquí para soporte, mejoras y lo que tu negocio vaya necesitando.",
                color: "hsl(262 83% 55%)",
                delay: 300,
              },
            ].map(({ icon: Icon, title, desc, color, delay }) => (
              <AnimateOnScroll key={title} delay={delay}>
                <div
                  className="flex flex-col h-full p-7 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "hsl(var(--foreground))" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. QUÉ HACEMOS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Servicios
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Cómo ayudamos a los negocios
            </h2>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: "Sistemas de gestión",
                subtitle: "sistema de inventario · software de alquiler",
                desc: "Controla tu inventario, registra ventas, gestiona alquileres y fechas. Todo en un solo sistema diseñado para tu negocio.",
                cta: "Ver sistemas",
                href: "/tienda",
                delay: 0,
                animation: "fade-left" as const,
              },
              {
                icon: ShoppingCart,
                title: "Plataformas de venta online",
                subtitle: "tienda online · e-commerce Ecuador",
                desc: "Vende 24/7 sin depender de Instagram o WhatsApp. Tu propia tienda con pagos integrados y panel de control.",
                cta: "Ver tienda online",
                href: "/tienda",
                delay: 120,
                animation: "fade-up" as const,
              },
              {
                icon: Settings2,
                title: "Automatización",
                subtitle: "automatización de negocios",
                desc: "Elimina tareas manuales y repetitivas. Reportes automáticos, alertas, flujos de trabajo que corren solos.",
                cta: "Ver soluciones",
                href: "/servicios",
                delay: 240,
                animation: "fade-right" as const,
              },
            ].map(({ icon: Icon, title, subtitle, desc, cta, href, delay, animation }) => (
              <AnimateOnScroll key={title} delay={delay} animation={animation}>
                <div
                  className="flex flex-col h-full p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {subtitle}
                  </p>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {desc}
                  </p>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all duration-200"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {cta} <ChevronRight size={15} />
                  </Link>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. EXPERIENCIA / MÉTRICAS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Nuestra experiencia
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Números que respaldan nuestro trabajo
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: 15, suffix: "+", label: "Proyectos desarrollados", delay: 0 },
              { value: 3, suffix: "+", label: "Años de experiencia", delay: 100 },
              { value: 3, suffix: "+", label: "Tipos de negocios atendidos", delay: 200 },
              { value: 100, suffix: "%", label: "Proyectos personalizados", delay: 300 },
            ].map(({ value, suffix, label, delay }) => (
              <AnimateOnScroll key={label} delay={delay}>
                <div
                  className="text-center p-8 rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                >
                  <p className="text-4xl md:text-5xl font-extrabold mb-2 gradient-text">
                    <CounterStat value={value} suffix={suffix} />
                  </p>
                  <p className="text-sm font-medium leading-snug" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {label}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. METODOLOGÍA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Proceso
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Cómo trabajamos
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Un proceso claro y transparente para que sepas exactamente en qué etapa está tu proyecto.
            </p>
          </AnimateOnScroll>

          <div className="relative">
            {/* Vertical line on desktop */}
            <div
              className="absolute left-6 top-0 bottom-0 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.05))" }}
            />

            <div className="space-y-5 md:pl-16">
              {[
                { icon: Search, step: "01", title: "Análisis del negocio", desc: "Entendemos tu negocio, tus procesos actuales y los problemas que necesitás resolver antes de escribir una sola línea de código.", delay: 0 },
                { icon: FileText, step: "02", title: "Propuesta de solución", desc: "Te presentamos un plan claro: qué vamos a construir, en cuánto tiempo y a qué costo. Sin sorpresas.", delay: 80 },
                { icon: Code2, step: "03", title: "Desarrollo del sistema", desc: "Construimos tu solución con actualizaciones periódicas para que veas el avance y puedas darnos retroalimentación.", delay: 160 },
                { icon: Rocket, step: "04", title: "Implementación y pruebas", desc: "Ponemos el sistema en marcha, capacitamos a tu equipo y hacemos pruebas exhaustivas antes de lanzar.", delay: 240 },
                { icon: Wrench, step: "05", title: "Soporte y mejora continua", desc: "El proyecto entregado no es el final. Estamos disponibles para soporte, ajustes y nuevas funcionalidades.", delay: 320 },
              ].map(({ icon: Icon, step, title, desc, delay }) => (
                <AnimateOnScroll key={step} delay={delay} animation="fade-left">
                  <div className="flex gap-6 items-start group">
                    {/* Step dot (desktop) */}
                    <div
                      className="hidden md:flex absolute -left-0 w-12 h-12 rounded-full items-center justify-center font-extrabold text-xs flex-shrink-0 transition-all duration-300 group-hover:scale-110 -translate-x-1/2"
                      style={{
                        background: "hsl(var(--primary))",
                        color: "white",
                        left: "calc(1.5rem + 0px)",
                        position: "absolute",
                        marginTop: "0.25rem",
                      }}
                    />
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: "hsl(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div
                      className="flex-1 p-6 rounded-2xl transition-all duration-200 hover:shadow-md"
                      style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-extrabold" style={{ color: "hsl(var(--primary))" }}>
                          Paso {step}
                        </span>
                        <h3 className="font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
                          {title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. EQUIPO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              El equipo
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Quién está detrás
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Las personas concretas que van a trabajar en tu proyecto. Sin intermediarios.
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, focus, github, avatar, icon: Icon }, i) => (
              <AnimateOnScroll key={name} delay={i * 80}>
                <div
                  className="group flex flex-col items-center text-center rounded-3xl p-7 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                >
                  {/* Avatar */}
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden mb-5 ring-4 transition-all duration-300 group-hover:ring-primary/40"
                    style={{ ringColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  </div>

                  <h3 className="text-lg font-extrabold mb-1" style={{ color: "hsl(var(--foreground))" }}>
                    {name}
                  </h3>

                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
                    style={{ background: "hsl(var(--primary) / 0.09)", color: "hsl(var(--primary))" }}
                  >
                    <Icon size={13} />
                    {role}
                  </div>

                  <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {focus}
                  </p>

                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    <Github size={14} />
                    Ver GitHub
                  </a>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          8. CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "hsl(var(--card))" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 80% at 50% 50%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <AnimateOnScroll>
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "hsl(var(--primary))" }}>
              Da el primer paso
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-6" style={{ color: "hsl(var(--foreground))" }}>
              Cuéntanos tu negocio y vemos cómo ayudarte
            </h2>
            <p className="text-lg mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
              Una conversación sin costo ni compromiso. Solo queremos entender tu problema y mostrarte la solución.
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
                }}
              >
                Ver productos
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {["Sin costo inicial de consultoría", "Respuesta en menos de 24h", "100% personalizado"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <CheckCircle2 size={15} style={{ color: "hsl(142 71% 40%)" }} />
                  {t}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          9. FAQ
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateOnScroll className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Preguntas frecuentes
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4" style={{ color: "hsl(var(--foreground))" }}>
              Lo que más nos preguntan
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80}>
            <FAQAccordion />
          </AnimateOnScroll>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
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
