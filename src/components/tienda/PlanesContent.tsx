"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Rocket, 
  ShieldCheck,
  Globe,
  Clock,
  CalendarDays
} from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  features: any;
}

interface Props {
  initialPlans: Plan[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

const INTERVALS = [
  { value: 1, label: "1 Mes", multiplier: 1, renewalMultiplier: 1 },
  { value: 12, label: "12 Meses", multiplier: 0.4, renewalMultiplier: 0.87, promo: true },
  { value: 24, label: "24 Meses", multiplier: 0.27, renewalMultiplier: 0.83 },
];

export function PlanesContent({ initialPlans }: Props) {
  // Calculamos los precios basados en la estrategia de Hostinger (basada en el mensual como regular)
  const getPlanPricing = (basePrice: number, months: number) => {
    let multiplier = 1;
    let renewalMultiplier = 1;

    if (months === 12) {
      multiplier = 0.4; // 5.99 / 14.99
      renewalMultiplier = 0.87; // 12.99 / 14.99
    } else if (months === 24) {
      multiplier = 0.27; // 3.99 / 14.99
      renewalMultiplier = 0.83; 
    }

    const monthlyPrice = basePrice * multiplier;
    const renewalPrice = basePrice * renewalMultiplier;
    
    return {
      monthly: monthlyPrice,
      total: monthlyPrice * months,
      regularMonthly: basePrice,
      regularTotal: basePrice * months,
      renewal: renewalPrice
    };
  };

  return (
    <div className="space-y-16">
      {/* Grid de Planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialPlans.map((plan, i) => {
          const pricing = getPlanPricing(plan.price_monthly, 12);
          const isFeatured = i === 1;

          return (
            <div 
              key={plan.id}
              className={`group relative flex flex-col p-8 md:p-10 rounded-[2.5rem] border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden ${
                isFeatured ? 'ring-2 ring-primary/20' : ''
              }`}
              style={{ 
                borderColor: isFeatured ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))',
                boxShadow: isFeatured ? '0 15px 40px -10px hsl(var(--primary) / 0.15)' : 'none'
              }}
            >
              <div className="absolute top-6 right-6">
                 {i === 0 && <Globe size={24} className="text-secondary opacity-20" />}
                 {i === 1 && <Rocket size={24} className="text-primary opacity-20" />}
                 {i >= 2 && <ShieldCheck size={24} className="text-success opacity-20" />}
              </div>

              {isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 py-1.5 px-6 rounded-b-2xl bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap">
                  Más Popular
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                  {plan.description || "Solución digital escalable para tu negocio."}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground line-through mb-1">
                    {formatPrice(pricing.regularMonthly)}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold tracking-tighter">
                      {formatPrice(pricing.monthly)}
                    </span>
                    <span className="text-muted-foreground font-medium text-sm">
                      / mes
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-xs font-medium leading-relaxed">
                    Obtén 12 meses por <span className="text-primary font-bold">{formatPrice(pricing.total)}</span> (valorado en {formatPrice(pricing.regularTotal)}).
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">
                    Solo se aplica por promoción el primer año, después se renueva por {formatPrice(pricing.renewal)}/mes
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 mb-10">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4">Lo que incluye:</p>
                  <ul className="space-y-4">
                  {(plan.features as string[] | null)?.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  </ul>
              </div>

              {/* CTA */}
              <Link 
                href={`/tienda/checkout?plan_id=${plan.id}&months=24`}
                className={`w-full py-4 rounded-2xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 ${
                  isFeatured 
                  ? 'bg-primary text-white shadow-lg hover:shadow-primary/40' 
                  : 'bg-muted/50 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20'
                }`}
              >
                Elegir Plan
                <ArrowRight size={18} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
