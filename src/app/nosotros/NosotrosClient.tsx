"use client";

import Link from "next/link";
import { GuambraLogo } from "@/components/ui/GuambraLogo";
import { useState } from "react";
import { ShoppingCart, Video, ArrowRight, PlayCircle } from "lucide-react";

export default function NosotrosClient() {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [description, setDescription] = useState(
    "En GuambraWeb, somos más que una agencia de desarrollo de software; somos tus aliados tecnológicos. Fundados en Riobamba, Ecuador, nuestra misión es acompañar a los negocios locales y nacionales en su transformación digital mediante soluciones a medida, desde páginas web de alta conversión hasta sistemas backend robustos e innovadores."
  );

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      } else if (url.includes("youtube.com/watch")) {
        const id = new URLSearchParams(url.split("?")[1]).get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  return (
    <div
      className="min-h-screen font-sans selection:bg-primary/20"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <header
        className="sticky top-0 z-50 border-b transition-all duration-300"
        style={{
          background: "hsl(var(--card) / 0.85)",
          backdropFilter: "blur(16px)",
          borderColor: "hsl(var(--border) / 0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="transition-transform duration-300 group-hover:scale-105">
              <GuambraLogo size="md" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "Inicio" },
              { href: "/nosotros", label: "Nosotros", active: true },
              { href: "/portafolio", label: "Portafolio" },
              { href: "/servicios", label: "Servicios" },
              { href: "/contacto", label: "Contacto" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  link.active
                    ? "text-primary"
                    : "hover:text-primary"
                }`}
                style={{
                  color: link.active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/tienda"
              className="btn-primary btn-sm rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingCart size={16} className="mr-1.5" /> Tienda
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO COMPACTO ── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% -20%, hsl(var(--primary) / 0.1) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 text-primary">
             <Video size={36} />
          </div>
          <h1
            className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Quiénes <span className="gradient-text">Somos</span>
          </h1>
          <p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Conoce al equipo innovador que da vida a las mejores soluciones
            digitales del país.
          </p>
        </div>
      </section>

      {/* ── DESCRIPCIÓN EDITABLE & VIDEO ── */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
             
             {/* Text description editor */}
             <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-4">Nuestra Historia</h2>
                  <div className="p-1 mb-4 border rounded-[1.5rem] bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[260px] p-6 bg-transparent outline-none resize-y leading-relaxed text-lg"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                        placeholder="Escribe la descripción de la agencia aquí..."
                     />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground/80 pl-2">
                    * Puedes editar el texto en tiempo real para visualizar cómo queda en el diseño.
                  </p>
                </div>
             </div>

             {/* Youtube block */}
             <div className="space-y-6">
               <div className="bg-card p-6 md:p-8 border rounded-[2rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden">
                 <div
                   className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none rounded-bl-[100px]"
                   style={{
                     background: "linear-gradient(135deg, hsl(var(--primary)), transparent)",
                   }}
                 />
                 
                 <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <PlayCircle size={24} strokeWidth={2.5} />
                   </div>
                   Presentación en Video
                 </h3>
                 <div className="mb-8 relative z-10">
                    <label className="text-xs font-bold mb-2 block uppercase tracking-wider text-muted-foreground">URL del video de YouTube</label>
                    <input 
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="input w-full bg-background/80 shadow-inner"
                    />
                 </div>

                 {/* Video renderer */}
                 <div className="w-full aspect-video rounded-xl overflow-hidden bg-black/90 shadow-2xl border border-white/10 relative z-10 ring-4 ring-primary/20">
                    {embedUrl ? (
                      <iframe 
                        src={embedUrl} 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                         <Video size={48} className="opacity-30 mb-2" />
                         <p className="text-sm font-medium">Ingresa una URL válida de YouTube</p>
                      </div>
                    )}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="border-t py-12 transition-colors duration-300 mt-20"
        style={{
          borderColor: "hsl(var(--border))",
          background: "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 w-full">
            {/* Left: Logo */}
            <div className="flex justify-center md:justify-start">
              <GuambraLogo size="sm" />
            </div>

            {/* Center: Info */}
            <div className="flex flex-col items-center text-center gap-1">
              <p
                className="text-sm font-medium"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                © {new Date().getFullYear()} GuambraWeb
              </p>
              <p
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Riobamba, Chimborazo, Ecuador 🇪🇨
              </p>
            </div>

            {/* Right: Legal Info or empty (NosotrosClient doesn't have LegalFooterLinks imported currently, but I'll maintain the structure) */}
            <div className="flex justify-center md:justify-end text-xs text-muted-foreground">
              GuambraWeb · Tecnología y Resultados
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
