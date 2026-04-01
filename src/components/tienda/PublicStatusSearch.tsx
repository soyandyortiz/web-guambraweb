"use client";

import { useState } from "react";
import { 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  Package,
  ArrowRight,
  Clock,
  Zap,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getSubscriptionStatus } from "@/app/actions/public-status";

export function PublicStatusSearch() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await getSubscriptionStatus(identifier);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.message || "No se encontraron resultados.");
      }
    } catch (err) {
      setError("Error al realizar la búsqueda. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string, projectStatus?: string) => {
    if (projectStatus === 'unsupervised') {
      return { 
        color: 'hsl(var(--warning))', 
        label: 'Sin Supervisión', 
        icon: AlertCircle, 
        bg: 'hsl(var(--warning) / 0.1)',
        description: 'Tu servicio ya no cuenta con soporte técnico preventivo.'
      };
    }

    switch (status) {
      case 'gratis': return { 
        color: 'hsl(var(--primary))', 
        label: 'Cortesía (Gratis)', 
        icon: Zap, 
        bg: 'hsl(var(--primary) / 0.1)',
        description: 'Disfrutas de 6 meses de mantenimiento premium por tu compra.'
      };
      case 'active': return { 
        color: 'hsl(var(--success))', 
        label: 'Plan Activo', 
        icon: CheckCircle2, 
        bg: 'hsl(var(--success) / 0.1)',
        description: 'Tu plan está al día y con supervisión total.'
      };
      case 'past_due': return { 
        color: 'hsl(var(--warning))', 
        label: 'Pago Pendiente', 
        icon: Clock, 
        bg: 'hsl(var(--warning) / 0.1)',
        description: 'Realiza tu pago para evitar la pérdida de supervisión.'
      };
      case 'expired': return { 
        color: 'hsl(var(--destructive))', 
        label: 'Expirado', 
        icon: AlertCircle, 
        bg: 'hsl(var(--destructive) / 0.1)',
        description: 'Tu periodo de cobertura ha finalizado.'
      };
      case 'cancelled': return { 
        color: 'hsl(var(--destructive))', 
        label: 'Cancelada', 
        icon: AlertCircle, 
        bg: 'hsl(var(--destructive) / 0.1)',
        description: 'Servicio suspendido por solicitud o falta de pago.'
      };
      default: return { 
        color: 'hsl(var(--muted-foreground))', 
        label: status, 
        icon: Clock, 
        bg: 'hsl(var(--muted) / 0.1)',
        description: 'Estado del servicio bajo revisión.'
      };
    }
  };

  const getTimeRemaining = (dateStr: string) => {
    const now = new Date();
    const end = new Date(dateStr);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { label: 'Expirado', urgent: true };
    if (diffDays <= 7) return { label: `${diffDays} días restantes`, urgent: true };
    if (diffDays <= 30) return { label: `${diffDays} días restantes`, urgent: false };
    
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    if (months > 0) {
      return { label: `${months} m ${days} d restantes`, urgent: false };
    }
    return { label: `${diffDays} días restantes`, urgent: false };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Buscador Card */}
      <div className="card p-6 md:p-8 bg-card border-2 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Search size={120} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-extrabold mb-2">Consulta tu Suscripción</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md">
            Ingresa tu correo electrónico o número de cédula/RUC para ver el estado real de tus servicios y periodo gratuito.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="Email o Cédula/RUC..."
                className="input w-full py-4 px-5 text-sm md:text-base pr-12 focus:ring-primary/20"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <ShieldCheck size={20} className="text-primary/40" />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading || !identifier}
              className="btn-primary py-4 px-8 font-bold flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              {loading ? "Buscando..." : "Consultar Estado"}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-destructive text-sm font-medium animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Resultados */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between border-b pb-4 border-border/50">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Package size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold font-display">{result.customer.name}</h3>
                  <p className="text-xs text-muted-foreground">{result.customer.email}</p>
               </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground mb-1">Servicios Activos</p>
              <p className="text-2xl font-black">{result.subscriptions.filter((s:any) => s.is_active).length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.subscriptions.map((sub: any) => {
              const cfg = getStatusConfig(sub.status, sub.project_status);
              const time = getTimeRemaining(sub.next_billing_date);
              const isFreeTrial = sub.status === 'gratis';
              
              return (
                <div key={sub.id} className="card p-6 bg-card border-2 hover:border-primary/30 transition-all hover:shadow-2xl relative overflow-hidden">
                    {/* Alerta de urgencia de fondo */}
                    {time.urgent && (
                      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-destructive/10 rounded-full blur-2xl" />
                    )}

                    <div className="flex items-start justify-between mb-4 relative z-10">
                       <div>
                          <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">{sub.plan_name}</p>
                          <h4 className="font-bold text-lg font-display">{sub.project_name || "Servicio Digital"}</h4>
                       </div>
                       <div className="px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                          <cfg.icon size={12} />
                          {cfg.label}
                       </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                      {cfg.description}
                    </p>

                    <div className="space-y-3 py-4 border-y border-dashed border-border/60 mb-6 relative z-10">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Calendar size={14}/> Próximo Vencimiento</span>
                           <span className={`font-bold ${time.urgent ? 'text-destructive' : ''}`}>
                             {new Date(sub.next_billing_date).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Clock size={14}/> Tiempo de Cobertura</span>
                           <div className="flex flex-col items-end">
                              <span className={`font-bold ${time.urgent ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                                {time.label}
                              </span>
                              {time.urgent && (
                                <span className="text-[10px] font-black text-destructive uppercase tracking-widest">¡Acción Requerida!</span>
                              )}
                           </div>
                        </div>
                    </div>

                    {/* Mensajes Personalizados según Lógica */}
                    {isFreeTrial && time.urgent && (
                      <div className="mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-[11px] font-medium leading-relaxed">
                          ⚠️ Tu periodo de cortesía está por terminar. Contrata un <span className="font-bold">Plan de Mantenimiento</span> para evitar que tu sistema pase al estado <span className="text-warning font-bold">Sin Supervisión</span>.
                        </p>
                      </div>
                    )}

                    {sub.project_status === 'unsupervised' && (
                      <div className="mb-6 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                        <p className="text-[11px] font-medium leading-relaxed text-destructive">
                          ❌ El soporte técnico ha sido suspendido. Activa un plan ahora para recuperar la garantía y supervisión técnica.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between relative z-10">
                       <span className="text-2xl font-black font-display tracking-tight">
                         ${sub.monthly_fee}
                         <span className="text-xs text-muted-foreground font-medium ml-1">
                           /{sub.billing_cycle === 'monthly' ? 'mes' : 'año'}
                         </span>
                       </span>
                       <Link 
                         href="/planes" 
                         className={`btn-sm gap-2 px-6 rounded-full font-bold transition-all ${time.urgent ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-secondary'}`}
                       >
                          {time.urgent ? 'Renovar Ahora' : 'Detalles Plan'}
                          <ExternalLink size={12} />
                       </Link>
                    </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center py-10">
            <p className="text-sm text-muted-foreground italic max-w-lg mx-auto leading-relaxed">
              ¿Ves algún error o necesitas ayuda con tu soporte técnico? <br />
              Explora nuestros <Link href="/planes" className="text-primary font-bold hover:underline">planes de mantenimiento</Link> o 
              <Link href="/contacto" className="text-primary font-bold hover:underline ml-1">contáctanos</Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
