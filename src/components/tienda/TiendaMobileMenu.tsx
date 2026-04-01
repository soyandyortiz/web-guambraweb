"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Home, Users, Briefcase, Star, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/nosotros", label: "Nosotros", Icon: Users },
  { href: "/portafolio", label: "Portafolio", Icon: Briefcase },
  { href: "/servicios", label: "Servicios", Icon: Star },
  { href: "/contacto", label: "Contacto", Icon: Phone },
];

export function TiendaMobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isTienda = pathname.startsWith("/tienda");

  return (
    <>
      {/* Hamburger Button — only on mobile */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
        style={{
          background: isOpen
            ? "hsl(var(--primary) / 0.12)"
            : "hsl(var(--muted) / 0.6)",
          color: isOpen ? "hsl(var(--primary))" : "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border) / 0.5)",
        }}
      >
        <span
          style={{
            display: "block",
            transition: "transform 0.3s",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full z-50 md:hidden flex flex-col"
        style={{
          width: "min(320px, 85vw)",
          background: "hsl(var(--card))",
          borderLeft: "1px solid hsl(var(--border))",
          boxShadow: isOpen ? "-8px 0 40px rgba(0,0,0,0.25)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              G
            </div>
            <span className="font-display font-bold text-base" style={{ color: "hsl(var(--foreground))" }}>
              Guambra<span className="gradient-text">Web</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted) / 0.5)" }}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tienda activa pill */}
        {isTienda && (
          <div className="px-4 pt-4">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                border: "1px solid hsl(var(--primary) / 0.2)",
              }}
            >
              <ShoppingCart size={16} />
              Tienda Online GuambraWeb
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex flex-col px-4 py-4 gap-1 flex-1 overflow-y-auto">
          {NAV_LINKS.map((link, i) => {
            const { Icon } = link;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 transform"
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
                <Icon size={18} style={{ opacity: isActive(link.href) ? 1 : 0.7 }} />
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full shadow-[0_0_8px_hsl(var(--primary))]"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Volver a tienda */}
        <div
          className="px-6 py-6 border-t flex-shrink-0"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Link
            href="/tienda"
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base shadow-lg"
          >
            <ShoppingCart size={20} />
            {isTienda ? "Ver productos" : "Ir a la Tienda"}
          </Link>
        </div>
      </div>
    </>
  );
}
