"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "¿El software es personalizado para mi negocio?",
    a: "Sí, cada sistema que desarrollamos parte desde cero según tus procesos, productos y necesidades específicas. No vendemos plantillas genéricas: construimos lo que tu negocio realmente necesita.",
  },
  {
    q: "¿Cuánto cuesta un sistema de gestión o tienda online?",
    a: "El precio depende de la complejidad del proyecto. Tenemos opciones desde soluciones básicas hasta sistemas completos. Contáctanos por WhatsApp y en menos de 24 horas te enviamos una propuesta sin compromiso.",
  },
  {
    q: "¿Cuánto tiempo tarda en estar listo mi sistema?",
    a: "Un sistema de gestión básico puede estar listo en 2 a 4 semanas. Proyectos más complejos pueden tomar de 4 a 8 semanas. Te damos un cronograma claro desde el inicio.",
  },
  {
    q: "¿Incluye soporte técnico después de la entrega?",
    a: "Sí. Todos nuestros proyectos incluyen un período de acompañamiento técnico. Además, ofrecemos planes de mantenimiento mensual para garantizar que tu sistema funcione perfecto en todo momento.",
  },
  {
    q: "¿Funciona en celular y tablet?",
    a: "Absolutamente. Todos nuestros sistemas son diseño responsivo: funcionan en computadoras, celulares y tablets sin necesidad de instalar ninguna aplicación.",
  },
  {
    q: "¿Qué pasa si necesito agregar funciones después?",
    a: "No hay problema. Nuestros sistemas están construidos para crecer contigo. Puedes solicitar nuevas funcionalidades en cualquier momento y las cotizamos por separado según lo que necesites.",
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden transition-all duration-200"
          style={{
            border: "1px solid hsl(var(--border))",
            background: open === i ? "hsl(var(--card))" : "hsl(var(--background))",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
          >
            <span className="font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>
              {faq.q}
            </span>
            <ChevronDown
              size={18}
              className="flex-shrink-0 transition-transform duration-300"
              style={{
                color: "hsl(var(--primary))",
                transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? "200px" : "0px" }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
