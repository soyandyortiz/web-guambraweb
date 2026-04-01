"use client";

import { useState } from "react";
import { Footer } from "@/components/ui/Footer";
import { PublicNav } from "@/components/ui/PublicNav";
import { DecorativeAnimation } from "@/components/ui/DecorativeAnimation";
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  CreditCard, 
  Rocket, 
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle2,
  Circle
} from "lucide-react";
import Link from "next/link";

const ROADMAP_STEPS = [
  {
    id: 1,
    title: "Descubrimiento",
    description: "Explora nuestro portafolio y tienda online para encontrar la solución tecnológica que tu negocio necesita.",
    icon: Users,
    color: "hsl(var(--primary))",
    details: [
      "Explora categorías de software",
      "Mira demos en vivo si están disponibles",
      "Consulta nuestras tarifas transparentes"
    ]
  },
  {
    id: 2,
    title: "Selección del Producto",
    description: "Elige el sistema o sitio web base. Cada producto está diseñado para ser escalable y profesional.",
    icon: ShoppingBag,
    color: "hsl(var(--secondary))",
    details: [
      "Añade productos al carrito",
      "Revisa las especificaciones técnicas",
      "Claridad total en el precio final"
    ]
  },
  {
    id: 3,
    title: "Asesoría y Checkout",
    description: "Una vez elegido, procesamos tu pago. Si necesitas ajustes personalizados, estamos a un mensaje de distancia.",
    icon: MessageSquare,
    color: "hsl(var(--accent))",
    details: [
      "Pago seguro mediante transferencia o tarjeta",
      "Recibes una factura y confirmación inmediata",
      "Coordinamos el despliegue de tu sistema"
    ]
  },
  {
    id: 4,
    title: "Implementación y Cortesía",
    description: "Desplegamos tu sistema en 24-48h. ¡Aquí empieza tu viaje! Recibes 6 meses de supervisión técnica gratis.",
    icon: Rocket,
    color: "hsl(var(--success))",
    details: [
      "Instalación en servidor optimizado",
      "Configuración de hosting y dominio",
      "6 meses de soporte preventivo incluido"
    ]
  },
  {
    id: 5,
    title: "Supervisión Digital",
    description: "Tras los 6 meses, tú decides. Mantén tu garantía proactiva con uno de nuestros planes de mantenimiento.",
    icon: ShieldCheck,
    color: "hsl(var(--warning))",
    details: [
      "Eliges un plan: Basic, Pro o Enterprise",
      "Garantía continua de seguridad",
      "Soporte técnico prioritario"
    ]
  }
];

export default function ComoComprarPage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      
      <main className="flex-1 py-12 md:py-24">
        <DecorativeAnimation type="binary" count={15} />

        <div className="container max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
               Guía del Cliente
             </div>
             <h1 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tight">
               Tu Camino al <span className="gradient-text">Éxito Digital</span>
             </h1>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
               Comprar en GuambraWeb es simple, seguro y transparente. Sigue nuestro roadmap interactivo para entender cómo transformamos tu idea en realidad.
             </p>
          </div>

          {/* Interactive Roadmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Steps Navigation */}
            <div className="lg:col-span-5 space-y-4">
              {ROADMAP_STEPS.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-card border-primary/50 shadow-2xl shadow-primary/10 -translate-x-2' 
                        : 'bg-muted/30 border-transparent hover:border-border/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 ${
                        isActive ? 'scale-110' : 'scale-100'
                      }`}
                      style={{ 
                        background: isActive ? step.color : 'hsl(var(--muted))',
                        color: isActive ? '#fff' : 'hsl(var(--muted-foreground))'
                      }}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Paso 0{step.id}</span>
                          {isActive && <ChevronRight size={16} className="text-primary animate-bounce-x" />}
                        </div>
                        <h3 className="font-bold text-lg">{step.title}</h3>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Display */}
            <div className="lg:col-span-7 sticky top-32">
              <div className="card p-8 md:p-12 relative overflow-hidden bg-card/50 backdrop-blur-xl border-primary/20 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                {ROADMAP_STEPS.map((step) => {
                  if (activeStep !== step.id) return null;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="relative z-10">
                       <div className="inline-flex items-center gap-2 mb-8">
                          <div className="w-16 h-1 bg-primary rounded-full" />
                          <span className="text-xs font-bold uppercase tracking-widest text-primary">Detalles del Proceso</span>
                       </div>

                       <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                             <Icon size={40} />
                          </div>
                          <div>
                             <h2 className="text-3xl font-black mb-2">{step.title}</h2>
                             <p className="text-muted-foreground leading-relaxed italic">"{step.description}"</p>
                          </div>
                       </div>

                       <div className="space-y-4 mb-10">
                          {step.details.map((detail, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-left-4" style={{ transitionDelay: `${i * 100}ms` }}>
                               <CheckCircle2 size={20} className="text-success shrink-0" />
                               <span className="text-sm font-semibold">{detail}</span>
                            </div>
                          ))}
                       </div>

                       <div className="flex flex-col sm:flex-row gap-4">
                          {activeStep < 5 ? (
                            <button 
                              onClick={() => setActiveStep(prev => prev + 1)}
                              className="btn-primary rounded-2xl px-8 h-12 font-bold gap-2 group"
                            >
                               Siguiente Paso
                               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          ) : (
                            <Link 
                              href="/tienda"
                              className="btn-primary rounded-2xl px-8 h-12 font-bold gap-2 animate-pulse-glow"
                            >
                               Ir a la Tienda
                               <ShoppingBag size={18} />
                            </Link>
                          )}
                          <Link href="/contacto" className="btn-secondary rounded-2xl px-8 h-12 font-bold">
                             Consultar Asesor
                          </Link>
                       </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Indicator */}
              <div className="mt-8 flex justify-center gap-3">
                 {ROADMAP_STEPS.map((s) => (
                   <div 
                    key={s.id} 
                    className={`h-2 transition-all duration-300 rounded-full ${activeStep === s.id ? 'w-12 bg-primary' : 'w-2 bg-muted'}`} 
                   />
                 ))}
              </div>
            </div>

          </div>

          {/* Bottom Call to Action */}
          <div className="mt-32 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 relative overflow-hidden text-center">
             <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
             <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">¿Listo para empezar tu <span className="gradient-text">Transformación?</span></h2>
             <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg relative z-10">
                No importa en qué etapa te encuentres, nuestro equipo está listo para impulsarte al siguiente nivel del mercado digital.
             </p>
             <div className="flex flex-wrap gap-4 justify-center relative z-10">
                <Link href="/tienda" className="btn-primary btn-lg rounded-2xl px-12 font-black shadow-2xl shadow-primary/30">
                   Explorar Catálogo
                </Link>
                <Link href="/planes" className="btn-secondary btn-lg rounded-2xl px-12 font-black">
                   Ver Planes
                </Link>
             </div>
          </div>

        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
}
