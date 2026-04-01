"use client";

import { ShoppingCart, Zap, Globe, Code2, Shield, Star } from "lucide-react";

const SERVICES = [
  {
    icon: ShoppingCart,
    title: "Tienda Online",
    desc: "E-commerce completo con carrito, pagos y gestión de inventario.",
    color: "var(--primary)",
  },
  {
    icon: Code2,
    title: "Apps a Medida",
    desc: "Sistemas de gestión, dashboards y herramientas personalizadas.",
    color: "var(--secondary)",
  },
  {
    icon: Globe,
    title: "Sitios Web",
    desc: "Landing pages y portafolios optimizados para Google.",
    color: "var(--accent)",
  },
  {
    icon: Shield,
    title: "Soporte & Mantenimiento",
    desc: "Planes de hosting, dominio y actualizaciones continuas.",
    color: "var(--success)",
  },
  {
    icon: Star,
    title: "Gestión de Proyectos",
    desc: "Kanban, hitos y seguimiento en tiempo real de tu proyecto.",
    color: "var(--warning)",
  },
  {
    icon: Zap,
    title: "Optimización SEO",
    desc: "Posicionamiento local en Google para clientes en Ecuador.",
    color: "var(--primary)",
  },
];

export function ServicesGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.map((service) => {
        const Icon = service.icon;
        return (
          <div
            key={service.title}
            className="card-highlight p-6 cursor-pointer"
            style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 12px 30px hsl(var(--primary) / 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "";
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: `hsl(${service.color} / 0.15)`,
                color: `hsl(${service.color})`,
              }}
            >
              <Icon size={22} />
            </div>
            <h3
              className="font-display font-semibold text-lg mb-2"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {service.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {service.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
