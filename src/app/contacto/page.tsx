import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Youtube,
  Video
} from "lucide-react";
import { ContactForm } from "./ContactForm";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { DecorativeAnimation } from "@/components/ui/DecorativeAnimation";

export const metadata: Metadata = {
  title: "Contacto — Presupuestos y Asesoría | GuambraWeb",
  description:
    "Comunícate con nuestro equipo en Riobamba. Llámanos al +593982650929, escríbenos a guambraweb@gmail.com o visítanos. Asesoría digital sin costo.",
};

export default function ContactPage() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-primary/20 flex flex-col"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <PublicNav />

      {/* ── HEADER CONTACTO ── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <DecorativeAnimation type="nodes" count={10} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, hsl(var(--secondary) / 0.08) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-6 tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Hablemos de tu <span className="gradient-text">Proyecto</span>
          </h1>
          <p
            className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Estamos aquí para ayudarte a escalar tu negocio en Ecuador. Contáctanos por el medio que prefieras y recibe asesoría profesional.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* IZQUIERDA: Info de contacto y Redes */}
            <div className="space-y-12">
              <div
                className="p-10 rounded-[2rem] border shadow-xl relative overflow-hidden"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-primary rounded-bl-full pointer-events-none"
                ></div>
                
                <h3
                  className="text-2xl font-bold mb-8"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Información de Contacto
                </h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "hsl(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      <Phone size={24} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold uppercase tracking-wider mb-1"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Llámanos
                      </p>
                      <p
                        className="text-lg font-medium"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        +593 98 265 0929
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "hsl(var(--secondary) / 0.1)",
                        color: "hsl(var(--secondary))",
                      }}
                    >
                      <Mail size={24} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold uppercase tracking-wider mb-1"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Correo Electrónico
                      </p>
                      <a
                        href="mailto:guambraweb@gmail.com"
                        className="text-lg font-medium hover:underline transition-all"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        guambraweb@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "hsl(var(--accent) / 0.1)",
                        color: "hsl(var(--accent))",
                      }}
                    >
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold uppercase tracking-wider mb-1"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Ubicación
                      </p>
                      <p
                        className="text-lg font-medium mb-3"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        Riobamba, Ecuador
                      </p>
                      <a
                        href="https://maps.app.goo.gl/GFEyWfizs7cjjNJZ9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-bold hover:underline transition-all"
                        style={{ color: "hsl(var(--accent))" }}
                      >
                        Abrir en Google Maps &rarr;
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                   <a
                    href="https://wa.me/593982650929?text=Hola,%20busco%20asesoría%20para%20un%20desarrollo%20web/sistema."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(37,211,102,0.8)]"
                    style={{ background: "#25D366" }}
                  >
                    <MessageCircle size={24} />
                    Chat directo en WhatsApp
                  </a>
                </div>
              </div>

              {/* REDES SOCIALES */}
              <div
                className="p-8 rounded-[2rem] border bg-card text-center"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                 <h3
                  className="text-lg font-bold mb-6"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Síguenos en nuestras redes
                </h3>
                <div className="flex justify-center gap-6">
                  <a
                    href="https://www.facebook.com/guambraweb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-background border hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors text-muted-foreground shadow-sm"
                    style={{ borderColor: "hsl(var(--border))" }}
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@guambraweb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-background border hover:bg-black hover:border-black hover:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-black transition-colors text-muted-foreground shadow-sm"
                    style={{ borderColor: "hsl(var(--border))" }}
                    aria-label="TikTok"
                  >
                    {/* TikTok icon fallback using lucide generic video or custom SVG */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-music-4"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@guambraweb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-background border hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors text-muted-foreground shadow-sm"
                    style={{ borderColor: "hsl(var(--border))" }}
                    aria-label="YouTube"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* DERECHA: Formulario de Contacto */}
            <div
              className="p-10 md:p-14 rounded-[2.5rem] border shadow-2xl relative bg-card"
              style={{
                borderColor: "hsl(var(--border))",
              }}
            >
              <h2
                className="text-3xl font-display font-bold mb-4"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Envíanos un Mensaje
              </h2>
              <p
                className="text-base mb-10"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Completa el formulario y nos pondremos en contacto contigo a la brevedad posible.
              </p>

              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
