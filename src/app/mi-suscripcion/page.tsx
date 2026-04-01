import type { Metadata } from "next";
import { PublicNav } from "@/components/ui/PublicNav";
import { LegalFooterLinks } from "@/components/ui/LegalModals";
import { FooterLogo } from "@/components/ui/FooterLogo";
import { PublicStatusSearch } from "@/components/tienda/PublicStatusSearch";
import { ShieldCheck, Lock, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Estado de Mi Suscripción | GuambraWeb",
  description: "Consulta el estado actual de tu servicio, fechas de pago y detalles de tu plan contratado de forma rápida y segura.",
};

export default function MiSuscripcionPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      <PublicNav />

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, hsl(var(--secondary) / 0.05) 0%, transparent 40%)",
            }}
          />
          <div className="container max-w-5xl mx-auto px-6 text-center relative z-10">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                  style={{ background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))', border: '1px solid hsl(var(--primary) / 0.2)' }}>
               <ShieldCheck size={12} className="fill-current" />
               Acceso Seguro
             </div>
             <h1 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight">
               Gestión de <span className="gradient-text">Mis Servicios</span>
             </h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
               Consulta tu estado de cuenta, próximas fechas de renovación y descarga tus comprobantes sin necesidad de contraseñas complejas.
             </p>
          </div>
        </section>

        {/* ── SEARCH AREA ── */}
        <section className="pb-32 px-6">
          <PublicStatusSearch />
        </section>

        {/* ── SECURITY INFO ── */}
        <section className="py-20 bg-muted/30 border-y" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
          <div className="container max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto md:mx-0">
                  <Lock size={24} />
                </div>
                <h3 className="font-bold text-lg">Privacidad de Datos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Solo mostramos información general del servicio. Los datos sensibles de pago y facturación detallada quedan protegidos bajo cifrado.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mx-auto md:mx-0">
                  <Smartphone size={24} />
                </div>
                <h3 className="font-bold text-lg">Notificaciones Proactivas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cualquier cambio en tu estado de suscripción te llegará instantáneamente por correo electrónico y WhatsApp de soporte.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success mx-auto md:mx-0">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-lg">Garantía GuambraWeb</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tu suscripción garantiza soporte técnico 24/7 y mantenimiento proactivo de todos tus activos digitales contratados.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="border-t py-12 transition-colors duration-300 mt-auto"
        style={{
          borderColor: "hsl(var(--border))",
          background: "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 w-full">
            <div className="flex justify-center md:justify-start">
              <FooterLogo />
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <p className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                © {new Date().getFullYear()} GuambraWeb
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                Riobamba, Chimborazo, Ecuador 🇪🇨
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <LegalFooterLinks />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
