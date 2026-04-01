import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  MapPin,
  Target,
  Eye,
  Github,
  Code2,
  Terminal,
  Cpu
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { DecorativeAnimation } from "@/components/ui/DecorativeAnimation";

export const metadata: Metadata = {
  title: "Quiénes Somos | GuambraWeb",
  description:
    "Conoce más sobre GuambraWeb, nuestra visión y nuestra pasión por desarrollar soluciones web y aplicaciones a medida en Ecuador.",
};

const team = [
  {
    name: "Andy O.",
    role: "Fullstack Developer & Founder",
    github: "https://github.com/Andyo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andy",
    icon: <Terminal size={20} />,
    bio: "Experto en arquitecturas escalables y desarrollo backend con Node.js y bases de datos relacionales."
  },
  {
    name: "Carlos M.",
    role: "Frontend Engineer",
    github: "https://github.com/carlosdev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    icon: <Code2 size={20} />,
    bio: "Apasionado por React, Next.js y crear interfaces de usuario pixel-perfect, interactivas y rápidas."
  },
  {
    name: "Diana S.",
    role: "UI/UX Designer",
    github: "https://github.com/dianadesign",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    icon: <Eye size={20} />,
    bio: "Especialista en experiencia de usuario. Transforma ideas complejas en diseños modernos, accesibles y hermosos."
  },
  {
    name: "Luis F.",
    role: "Backend & Cloud",
    github: "https://github.com/luiscloud",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
    icon: <Cpu size={20} />,
    bio: "Ingeniero cloud enfocado en optimizar el rendimiento y seguridad de nuestras aplicaciones y repositorios."
  }
];

export default function NosotrosPage() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-primary/20 flex flex-col"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <PublicNav />

      {/* ── HEADER NOSOTROS ── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <DecorativeAnimation type="nodes" count={8} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% -20%, hsl(var(--primary) / 0.1) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 text-primary">
             <MapPin size={36} />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-6 tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Nacimos en <span className="gradient-text">Riobamba, Ecuador</span>
          </h1>
          <p
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Somos un equipo de <strong style={{ color: "hsl(var(--foreground))" }}>jóvenes expertos</strong> apasionados por el desarrollo web y la creación de aplicaciones a medida. Convertimos desafíos complejos en soluciones digitales eficaces.
          </p>
        </div>
      </section>

      {/* ── HISTORIA, MISIÓN Y VISIÓN ── */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>
                  Nuestra Historia
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  GuambraWeb surgió de la iniciativa de jóvenes desarrolladores en el corazón del Ecuador, Riobamba. Al observar que muchas empresas locales y nacionales luchaban por adaptarse a la era digital con herramientas desactualizadas, decidimos unir fuerzas. Hoy, diseñamos y desarrollamos soluciones empresariales, páginas de alto impacto y sistemas escalables que resuelven problemas reales.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border shadow-sm bg-card transition-all hover:shadow-md" style={{ borderColor: 'hsl(var(--border))' }}>
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-primary/10 text-primary">
                    <Target size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>Misión</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Impulsar la transformación tecnológica de los negocios a través de software intuitivo, rápido y seguro. Queremos democratizar el acceso a tecnología de primer nivel para empresas de todos los tamaños.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border shadow-sm bg-card transition-all hover:shadow-md" style={{ borderColor: 'hsl(var(--border))' }}>
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-secondary/10 text-secondary">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>Visión</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Posicionarnos como la agencia de desarrollo web y aplicaciones referente en Ecuador y Latinoamérica, reconocidos por nuestro código limpio, nuestra innovación y los resultados de nuestros clientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-full min-h-[400px] rounded-[2rem] overflow-hidden border shadow-2xl" style={{ borderColor: 'hsl(var(--border))' }}>
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-secondary/20 z-0"></div>
               {/* Decorative floating code blocks pattern */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
                  <div className="bg-card w-full max-w-sm rounded-xl border shadow-2xl p-6" style={{ borderColor: 'hsl(var(--border))' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <code className="text-sm font-mono block whitespace-pre-wrap" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        <span className="text-primary">const</span> <span className="text-secondary">equipo</span> = {'{'}
                        <br/>
                        &nbsp;&nbsp;ubicacion: <span className="text-green-500">"Riobamba, EC"</span>,
                        <br/>
                        &nbsp;&nbsp;experiencia: <span className="text-primary">"Desarrollo Web"</span>,
                        <br/>
                        &nbsp;&nbsp;pasion: <span className="text-primary">true</span>
                        <br/>
                        {'}'};
                        <br/>
                        <br/>
                        <span className="text-primary">function</span> <span className="text-secondary">resolverProblemas</span>() {'{'}
                        <br/>
                        &nbsp;&nbsp;<span className="text-primary">return</span> <span className="text-green-500">"Sistemas a medida🚀"</span>;
                        <br/>
                        {'}'}
                      </code>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── EQUIPO DE PROGRAMADORES ── */}
      <section className="py-20 relative bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
              Nuestros <span className="gradient-text">Programadores</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Conoce a las mentes brillantes detrás de nuestras líneas de código. Trabajamos con tecnologías modernas para ofrecerte lo mejor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div 
                key={i} 
                className="group rounded-3xl p-6 bg-card border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center relative overflow-hidden" 
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="absolute top-0 w-full h-24 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Info y Foto */}
                <div className="relative z-10 w-28 h-28 mb-5 mt-4 rounded-full border-4 shadow-lg overflow-hidden bg-white flex items-center justify-center p-2" style={{ borderColor: "hsl(var(--card))" }}>
                   {/* Using img to avoid missing domain config issues in next.js Image */}
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                </div>
                
                <h3 className="text-xl font-extrabold mb-1" style={{ color: "hsl(var(--foreground))" }}>
                  {member.name}
                </h3>
                
                <div className="flex items-center justify-center gap-1.5 text-sm font-semibold mb-4 px-3 py-1 bg-muted rounded-full text-primary">
                  {member.icon}
                  {member.role}
                </div>
                
                <p className="text-sm mb-6 flex-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {member.bio}
                </p>
                
                {/* Github Link */}
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 mt-auto rounded-xl font-bold bg-background border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                >
                  <Github size={18} />
                  Ver Repositorio
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
