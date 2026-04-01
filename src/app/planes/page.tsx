import type { Metadata } from "next";
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Star, 
  Rocket, 
  ShieldCheck,
  Globe,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { DecorativeAnimation } from "@/components/ui/DecorativeAnimation";
import { getActivePlans } from "@/app/actions/subscription-plans";
import { PlanesContent } from "@/components/tienda/PlanesContent";
import ServiceSchema from "@/components/seo/ServiceSchema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Planes de Suscripción y Precios | GuambraWeb",
  description: "Elige el plan que mejor se adapte a tu negocio. Soluciones web escalables, mantenimiento proactivo y soporte experto en Riobamba, Ecuador.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export default async function PlanesPage() {
  const plans = await getActivePlans();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      <PublicNav />

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
           <DecorativeAnimation type="binary" count={20} />
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
               <Zap size={12} className="fill-current" />
               Tarifas Transparentes
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-6 tracking-tight">
               Impulsa tu presencia digital con <span className="gradient-text">Planes a Medida</span>
             </h1>
             <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
               Desde startups hasta empresas consolidadas. Pagos mensuales flexibles para que tu inversión tecnológica crezca contigo.
             </p>
             <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-success/5 border border-success/20 text-success text-xs font-semibold">
                   <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                   ¿Compraste un producto? Tienes 6 meses de cortesía incluidos.
                </div>
             </div>
          </div>
        </section>

        {/* ── PRICING GRID ── */}
        <section className="py-20 md:py-32 bg-muted/20">
          <div className="container max-w-7xl mx-auto px-6">
            {plans.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground italic">No hay planes públicos disponibles en este momento.</p>
              </div>
            ) : (
              <>
                {plans.map((plan) => (
                  <ServiceSchema 
                    key={plan.id}
                    name={plan.name}
                    description={plan.description || `Plan de suscripción ${plan.name} en GuambraWeb.`}
                    price={plan.price_monthly}
                    url="https://guambraweb.com/planes"
                    features={plan.features as string[]}
                  />
                ))}
                <PlanesContent initialPlans={plans} />
              </>
            )}
          </div>
        </section>

        {/* ── FAQ SIMPLIFIED ── */}
        <section className="py-24 border-t" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
           <div className="container max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                 <h2 className="text-4xl font-display font-bold mb-4">Preguntas Frecuentes</h2>
                 <p className="text-muted-foreground italic">Todo lo que necesitas saber sobre nuestras suscripciones.</p>
              </div>

              <div className="space-y-8">
                 <div className="p-6 rounded-3xl border bg-card/50" style={{ borderColor: 'hsl(var(--border))' }}>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                       <Star size={16} className="text-warning fill-current" />
                       ¿Puedo cambiar de plan en cualquier momento?
                    </h4>
                    <p className="text-sm text-muted-foreground">Sí, puedes subir o bajar de nivel según tus necesidades. Ajustaremos la diferencia en tu próxima factura automáticamente.</p>
                 </div>
                 <div className="p-6 rounded-3xl border bg-card/50" style={{ borderColor: 'hsl(var(--border))' }}>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                       <ShieldCheck size={16} className="text-success fill-current" />
                       ¿Qué incluye la supervisión técnica?
                    </h4>
                    <p className="text-sm text-muted-foreground">Incluye actualizaciones de seguridad, copias de respaldo, hosting optimizado, dominio y soporte técnico. Si adquieres un producto directamente, te regalamos 6 meses de este servicio completamente gratis.</p>
                 </div>
                 <div className="p-6 rounded-3xl border bg-card/50" style={{ borderColor: 'hsl(var(--border))' }}>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                       <AlertCircle size={16} className="text-warning fill-current" />
                       ¿Qué pasa si no renuevo mi plan?
                    </h4>
                    <p className="text-sm text-muted-foreground">Tu sistema seguirá funcional, pero pasará al estado "Sin Supervisión". Esto significa que el hosting, dominio y soporte técnico dejarán de estar cubiertos, y deberás gestionarlos externamente para que tu web no se apague.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
