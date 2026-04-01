"use client";

import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import Link from "next/link";
import { GuambraLogo } from "@/components/ui/GuambraLogo";
import { CartBadge } from "@/components/tienda/CartBadge";
import { CartDrawer } from "@/components/tienda/CartDrawer";
import { Footer } from "@/components/ui/Footer";
import { ChevronDown, CreditCard, Zap } from "lucide-react";
import { useState } from "react";

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TiendaLayoutContent>{children}</TiendaLayoutContent>;
}

function TiendaLayoutContent({ children }: { children: React.ReactNode }) {
  const [plansHover, setPlansHover] = useState(false);
  
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* ── NAVBAR ── */}
      <header
        className="fixed top-0 left-0 w-full z-50 border-b"
        style={{
          background: "hsl(var(--card))",
          backdropFilter: "blur(12px)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center flex-shrink-0">
            <GuambraLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { href: "/", label: "Inicio" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/portafolio", label: "Portafolio" },
              { href: "/servicios", label: "Servicios" },
              { href: "/contacto", label: "Contacto" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold transition-colors duration-200 hover:text-primary"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Submenú Planes (Hover) */}
            <div 
              className="relative py-4"
              onMouseEnter={() => setPlansHover(true)}
              onMouseLeave={() => setPlansHover(false)}
            >
              <button 
                className="text-sm font-bold flex items-center gap-1.5 transition-all duration-300 px-3 py-1.5 rounded-xl relative group overflow-hidden"
                style={{
                  color: 'hsl(var(--primary))',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))' }} />
                
                <span className="relative z-10 bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent hover:brightness-110">
                  Planes
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 relative z-10 text-primary ${plansHover ? "rotate-180" : ""}`} />
                <div className="absolute inset-0 border border-red-500/20 rounded-xl group-hover:border-red-500/50 transition-colors duration-300" />
              </button>

              {/* Dropdown Panel */}
              {plansHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="w-52 bg-card border rounded-2xl shadow-2xl overflow-hidden p-2">
                    <Link 
                      href="/planes"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group/item text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover/item:scale-110 transition-transform flex-shrink-0">
                        <CreditCard size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Ver Planes</span>
                        <span className="text-[9px] text-muted-foreground">Precios</span>
                      </div>
                    </Link>
                    <Link 
                      href="/mi-suscripcion"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group/item text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover/item:scale-110 transition-transform flex-shrink-0">
                        <Zap size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Mi Servicio</span>
                        <span className="text-[9px] text-muted-foreground">Estado</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: theme + cart + mobile menu */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <CartBadge />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow pt-16">{children}</main>

      <Footer logoHref="/tienda" />

      {/* ── CART DRAWER ── */}
      <CartDrawer />
    </div>
  );
}
