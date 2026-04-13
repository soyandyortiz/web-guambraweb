"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GuambraLogo } from "@/components/ui/GuambraLogo";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Zap, ChevronDown, Monitor, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/como-comprar", label: "Cómo Comprar" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [plansHover, setPlansHover] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Cierra el menú al presionar Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => { 
      if (typeof document !== "undefined") {
        document.body.style.overflow = ""; 
      }
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 border-b"
        style={{
          background: "hsl(var(--card))",
          backdropFilter: "blur(16px)",
          borderColor: "hsl(var(--border) / 0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="transition-transform duration-300 group-hover:scale-105">
              <GuambraLogo size="md" />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold transition-colors duration-200 hover:text-primary"
                style={{
                  color: isActive(link.href)
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground))",
                }}
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
                className="text-sm font-bold flex items-center gap-1.5 transition-all duration-300 px-4 py-2 rounded-xl relative group overflow-hidden"
                style={{
                  background: isActive('/planes') 
                    ? 'linear-gradient(135deg, #ef4444, #f59e0b)' 
                    : 'transparent',
                  color: isActive('/planes') ? '#fff' : 'hsl(var(--primary))',
                  boxShadow: isActive('/planes') ? '0 4px 15px -3px rgba(239, 68, 68, 0.4)' : 'none'
                }}
              >
                {/* Gradient Background for Hover state if not active */}
                {!isActive('/planes') && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))' }} />
                )}
                
                <span className={cn(
                  "relative z-10",
                  !isActive('/planes') && "bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent hover:brightness-110 motion-safe:animate-pulse"
                )}>
                  Planes
                </span>
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 border border-red-500/20 rounded-xl group-hover:border-red-500/50 transition-colors duration-300" />
              </button>

              {/* Dropdown Panel */}
              {plansHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="w-56 bg-card border rounded-2xl shadow-2xl overflow-hidden p-2">
                    <Link 
                      href="/planes"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover/item:scale-110 transition-transform">
                        <CreditCard size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Ver Planes</span>
                        <span className="text-[10px] text-muted-foreground">Precios y Suscripciones</span>
                      </div>
                    </Link>
                    <Link 
                      href="/mi-suscripcion"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover/item:scale-110 transition-transform">
                        <Zap size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Mi Servicio</span>
                        <span className="text-[10px] text-muted-foreground">Estado y Renovaciones</span>
                      </div>
                    </Link>
                    
                    <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                       <p className="text-[9px] leading-tight text-muted-foreground italic">
                          * 6 meses de cortesía en productos.
                       </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ── Desktop Right: Tienda ── */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/tienda"
              className="btn-primary btn-sm rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingCart size={16} className="mr-1.5" />
              Tienda
            </Link>
          </div>

          {/* ── Mobile Right: Hamburger ── */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen((o) => !o)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                background: isOpen
                  ? "hsl(var(--primary) / 0.12)"
                  : "hsl(var(--muted) / 0.6)",
                color: isOpen
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border) / 0.5)",
              }}
            >
              <span
                className="transition-transform duration-300"
                style={{ display: "block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="h-20" aria-hidden="true" />

      {/* ── Mobile Drawer Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Panel ── */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: "min(320px, 85vw)",
          background: "hsl(var(--card))",
          borderLeft: "1px solid hsl(var(--border))",
          boxShadow: isOpen ? "-8px 0 40px rgba(0,0,0,0.25)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <GuambraLogo size="sm" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted) / 0.5)" }}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col px-4 py-6 gap-1 flex-1 overflow-y-auto">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 transform"
              style={{
                color: isActive(link.href)
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground))",
                background: isActive(link.href)
                  ? "hsl(var(--primary) / 0.1)"
                  : "transparent",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(20px)",
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ background: "hsl(var(--primary))" }}
                />
              )}
            </Link>
          ))}

          {/* Mobile Planes section */}
          <div 
            className="mt-4 pt-4 border-t border-border/50 px-4 transition-all duration-500 transform"
            style={{ 
              borderColor: 'hsl(var(--border) / 0.5)',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${NAV_LINKS.length * 50}ms`
            }}
          >
             <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">Suscripciones</p>
             <div className="grid grid-cols-1 gap-2">
                <Link 
                  href="/planes" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center p-3 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 font-bold active:scale-95 transition-transform"
                >
                  Ver Planes
                </Link>
                <Link 
                  href="/mi-suscripcion" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center p-3 rounded-xl bg-amber-500/5 text-amber-500 border border-amber-500/10 font-bold active:scale-95 transition-transform"
                >
                  Mi Servicio
                </Link>
             </div>
          </div>
        </nav>

        {/* Drawer Footer: Botón Tienda */}
        <div
          className="px-6 py-6 border-t flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <a
            href="/tienda"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base shadow-lg"
          >
            <ShoppingCart size={20} />
            Abrir Tienda Online
          </a>
          <p
            className="text-xs text-center mt-3"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Riobamba, Ecuador 🇪🇨
          </p>
        </div>
      </div>
    </>
  );
}
