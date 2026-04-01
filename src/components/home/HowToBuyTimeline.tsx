"use client";

import { 
  Search, 
  CreditCard, 
  Settings, 
  Rocket, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { TextGlow } from "@/components/ui/SpotlightCard";

export function HowToBuyTimeline() {
  const steps = [
    {
      title: "Explora y Elige",
      description: "Navega por nuestra selección de planes y servicios digitales. Tenemos la solución ideal para cada etapa de tu negocio.",
      icon: Search,
      color: "var(--primary)",
      badge: "Paso 01"
    },
    {
      title: "Pago Seguro",
      description: "Realiza tu pago vía DeUna!, Transferencia Bancaria o Bitcoin. Proceso 100% cifrado y confiable.",
      icon: CreditCard,
      color: "var(--secondary)",
      badge: "Paso 02"
    },
    {
      title: "Configuración",
      description: "Una vez confirmado el pago, nuestro equipo se pone manos a la obra con la implementación y configuración de tu servicio.",
      icon: Settings,
      color: "var(--accent)",
      badge: "Paso 03"
    },
    {
      title: "Lanzamiento",
      description: "¡Listo! Tu proyecto sale al aire. Recibirás tus accesos y soporte continuo para asegurar tu éxito digital.",
      icon: Rocket,
      color: "var(--success)",
      badge: "Paso 04"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            ¿Cómo <TextGlow>Adquirir</TextGlow> tu Servicio?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un proceso transparente y ágil diseñado para que tu presencia online no tenga que esperar.
          </p>
        </div>

        <div className="relative">
          {/* Central Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden lg:block overflow-hidden">
             <div className="w-full h-full bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="group relative">
                  {/* Step Connector Dots (Desktop) */}
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-4 h-4 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors z-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                  </div>

                  <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2rem] p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative overflow-hidden">
                    {/* Step Badge */}
                    <div 
                      className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md opacity-50 bg-muted/50"
                      style={{ color: `hsl(${step.color.replace('var(', '').replace(')', '')})` }}
                    >
                      {step.badge}
                    </div>

                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300"
                      style={{ 
                        background: `hsl(${step.color.replace('var(', '').replace(')', '')} / 0.1)`, 
                        color: `hsl(${step.color.replace('var(', '').replace(')', '')})`,
                        border: `1px solid hsl(${step.color.replace('var(', '').replace(')', '')} / 0.2)`
                      }}
                    >
                      <Icon size={28} />
                    </div>

                    <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {index < steps.length - 1 && (
                      <ArrowRight 
                        size={20} 
                        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity hidden lg:block" 
                        style={{ color: `hsl(${step.color.replace('var(', '').replace(')', '')})` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info adicional sotto la timeline */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-60">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={16} className="text-success" />
            Activación rápida
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={16} className="text-success" />
            Asesoria personalizada
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={16} className="text-success" />
            Satisfacción garantizada
          </div>
        </div>
      </div>
    </section>
  );
}
