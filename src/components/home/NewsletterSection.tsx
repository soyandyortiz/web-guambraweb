"use client";

import { useState } from "react";
import { MessageCircle, Mail, User, Send, CheckCircle2 } from "lucide-react";
import { saveMarketingLead } from "@/app/actions/marketing";

export function NewsletterSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await saveMarketingLead(formData);

    if (res.success) {
      setSuccess(true);
      setFormData({ name: "", email: "", whatsapp: "" });
    } else {
      setError("Hubo un error al guardar tus datos. Por favor intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorative element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary to-secondary blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-accent to-primary blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 md:p-16 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-6">
                <Send size={14} />
                Promociones Exclusivas
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-[1.1]">
                ¡No te pierdas de <span className="gradient-text">nada!</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Únete a nuestra lista de difusión para recibir cupones de descuento, 
                notificaciones de nuevos productos y consejos de marketing digital directamente en tu WhatsApp.
              </p>
              
              <div className="space-y-4">
                {[
                  "Cupones de hasta el 50% de descuento",
                  "Notificaciones vía WhatsApp",
                  "Contenido exclusivo de valor"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 size={18} className="text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form */}
            <div className="relative">
              {success ? (
                <div className="flex flex-col items-center justify-center text-center py-10 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-success mb-6 shadow-lg shadow-success/20">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">¡Registro Exitoso!</h3>
                  <p className="text-muted-foreground mb-6">
                    Bienvenido a GuambraWeb. Pronto recibirás nuestras mejores ofertas.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="btn-secondary rounded-full px-8 py-3 font-bold"
                  >
                    Volver a registrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground px-1">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Andy Ortiz"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground px-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="andy@ejemplo.com"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-muted-foreground px-1">WhatsApp</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="tel" 
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        placeholder="0999999999"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full btn-primary rounded-2xl py-4 font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        ¡Quiero mis descuentos!
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
