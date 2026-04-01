"use client";

import Link from "next/link";
import { GuambraLogo, GuambraIcon } from "@/components/ui/GuambraLogo";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Ticket,
  FolderKanban,
  HeadphonesIcon,
  Server,
  ReceiptText,
  CreditCard,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp,
  Cpu,
  X,
  Zap,
  Users,
  Users2,
  Tags,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
type NavChild = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: NavChild[];
  accent?: string; // CSS variable name, e.g. "var(--primary)"
};

/* ─────────────────────────────────────────
   ESTRUCTURA DE NAVEGACIÓN
───────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    accent: "var(--primary)",
  },
  {
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/ventas/pedidos",
    accent: "var(--warning)",
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/admin/clientes",
    accent: "var(--primary)",
  },
  {
    label: "Equipo",
    icon: Users2,
    href: "/admin/equipo",
    accent: "var(--success)",
  },
  {
    label: "Ventas",
    icon: TrendingUp,
    accent: "var(--accent)",
    children: [
      { label: "Productos", href: "/admin/ventas/productos",  icon: Package },
      { label: "Categorías", href: "/admin/ventas/categorias", icon: Tags },
      { label: "Cupones",   href: "/admin/ventas/cupones",    icon: Ticket },
    ],
  },
  {
    label: "Suscripción",
    icon: Zap,
    accent: "var(--primary)",
    children: [
      { label: "Suscripciones", href: "/admin/finanzas/suscripciones", icon: CreditCard },
      { label: "Planes", href: "/admin/finanzas/planes", icon: Tags },
    ],
  },
  {
    label: "Producción",
    icon: Cpu,
    accent: "var(--secondary)",
    children: [
      { label: "Proyectos", href: "/admin/produccion/proyectos", icon: FolderKanban },
      { label: "Kanban",    href: "/admin/produccion/kanban",    icon: FolderKanban },
    ],
  },
  {
    label: "Soporte",
    icon: HeadphonesIcon,
    accent: "var(--success)",
    children: [
      { label: "Tickets",   href: "/admin/soporte/tickets",    icon: HeadphonesIcon },
      { label: "IT Assets", href: "/admin/soporte/assets",  icon: Server },
    ],
  },
  {
    label: "Emisor de PDF",
    icon: ReceiptText,
    accent: "var(--warning)",
    children: [
      { label: "Comprobantes", href: "/admin/finanzas/facturas", icon: ReceiptText },
      { label: "Proformas", href: "/admin/ventas/proformas", icon: ReceiptText },
    ],
  },
  {
    label: "Marketing",
    icon: TrendingUp,
    accent: "var(--primary)",
    children: [
      { label: "Leads", href: "/admin/marketing/leads", icon: Users },
    ],
  },
  {
    label: "Bio Links",
    icon: Link2,
    href: "/admin/bio-links",
    accent: "var(--accent)",
  },
];

/* ─────────────────────────────────────────
   HOOK: detectar ruta activa
───────────────────────────────────────── */
function useActiveSection(items: NavItem[], pathname: string) {
  const active: Record<string, boolean> = {};
  for (const item of items) {
    if (item.href && pathname === item.href) {
      active[item.label] = true;
    }
    if (item.children) {
      for (const child of item.children) {
        if (pathname.startsWith(child.href)) {
          active[item.label] = true;
        }
      }
    }
  }
  return active;
}

/* ─────────────────────────────────────────
   SUBCOMPONENTE: Item individual del menú
───────────────────────────────────────── */
function NavSection({
  item,
  collapsed,
  isOpen,
  onToggle,
  pathname,
}: {
  item: NavItem;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const accent = item.accent ?? "var(--primary)";
  const isChildActive = item.children?.some((c) =>
    pathname.startsWith(c.href)
  );
  const isDirectActive = item.href && pathname === item.href;
  const isActive = isChildActive || isDirectActive;

  // Si es un enlace directo (sin hijos)
  if (item.href && !item.children) {
    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          "sidebar-item group relative",
          isActive && "active"
        )}
        style={
          isActive
            ? {
                background: `linear-gradient(135deg, hsl(var(--sidebar-accent) / 0.2), hsl(var(--secondary) / 0.1))`,
                color: `hsl(${accent.replace("var(", "").replace(")", "")})`,
                borderLeft: `3px solid hsl(${accent.replace("var(", "").replace(")", "")})`,
              }
            : {}
        }
      >
        <Icon
          size={18}
          className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ color: isActive ? `hsl(${accent.replace("var(", "").replace(")", "")})` : undefined }}
        />
        {!collapsed && (
          <span className="truncate transition-all duration-200">{item.label}</span>
        )}
        {/* Tooltip cuando está colapsado */}
        {collapsed && (
          <div
            className="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-medium rounded-lg
                       pointer-events-none opacity-0 group-hover:opacity-100 whitespace-nowrap
                       z-50 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
            style={{
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {item.label}
          </div>
        )}
      </Link>
    );
  }

  // Con hijos (submenú)
  return (
    <div>
      <button
        onClick={onToggle}
        title={collapsed ? item.label : undefined}
        className={cn(
          "sidebar-item w-full group relative",
          isActive && !collapsed && "text-foreground"
        )}
        style={
          isActive
            ? { color: `hsl(${accent.replace("var(", "").replace(")", "")})` }
            : {}
        }
      >
        <Icon
          size={18}
          className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ color: isActive ? `hsl(${accent.replace("var(", "").replace(")", "")})` : undefined }}
        />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            <ChevronRight
              size={14}
              className="flex-shrink-0 transition-transform duration-300"
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                opacity: 0.6,
              }}
            />
          </>
        )}
        {/* Dot indicador cuando colapsado y activo */}
        {collapsed && isActive && (
          <span
            className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: `hsl(${accent.replace("var(", "").replace(")", "")})` }}
          />
        )}
        {/* Tooltip cuando está colapsado */}
        {collapsed && (
          <div
            className="absolute left-full ml-3 px-2.5 min-w-max z-50
                       pointer-events-none opacity-0 group-hover:opacity-100
                       transition-all duration-200 translate-x-1 group-hover:translate-x-0"
          >
            <div
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg mb-1"
              style={{
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {item.label}
            </div>
            {/* Submenú flotante en modo colapsado */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {item.children?.map((child) => {
                const ChildIcon = child.icon;
                const childActive = pathname.startsWith(child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium
                                pointer-events-auto transition-colors duration-150"
                    style={{
                      color: childActive
                        ? `hsl(${accent.replace("var(", "").replace(")", "")})`
                        : "hsl(var(--sidebar-foreground))",
                      background: childActive ? `hsl(${accent.replace("var(", "").replace(")", "")} / 0.1)` : "transparent",
                    }}
                  >
                    <ChildIcon size={13} />
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </button>

      {/* Submenú expandible (solo cuando no colapsado) */}
      {!collapsed && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? `${(item.children?.length ?? 0) * 44}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="ml-4 mt-0.5 mb-1 space-y-0.5 border-l pl-3"
               style={{ borderColor: "hsl(var(--sidebar-border))" }}>
            {item.children?.map((child) => {
              const ChildIcon = child.icon;
              const childActive = pathname.startsWith(child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                             transition-all duration-150 group/child"
                  style={{
                    color: childActive
                      ? `hsl(${accent.replace("var(", "").replace(")", "")})`
                      : "hsl(var(--sidebar-foreground))",
                    background: childActive
                      ? `hsl(${accent.replace("var(", "").replace(")", "")} / 0.12)`
                      : "transparent",
                    fontWeight: childActive ? 600 : 400,
                  }}
                >
                  <ChildIcon
                    size={14}
                    className="flex-shrink-0 transition-transform duration-150 group-hover/child:scale-110"
                  />
                  <span className="truncate">{child.label}</span>
                  {childActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: `hsl(${accent.replace("var(", "").replace(")", "")})` }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL: Sidebar
───────────────────────────────────────── */
type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const activeSection = useActiveSection(NAV_ITEMS, pathname);

  // Auto-abrir la sección activa al montar
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    for (const item of NAV_ITEMS) {
      if (activeSection[item.label]) {
        initial[item.label] = true;
      }
    }
    setOpenSections(initial);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const sidebarContent = (
    <div
      className="sidebar flex flex-col h-full"
      style={{ width: collapsed ? "72px" : "260px", transition: "width 0.3s ease" }}
    >
      {/* ── LOGO ── */}
      <div
        className="flex items-center px-3 h-16 flex-shrink-0 border-b"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        {collapsed ? (
          /* Icono cuadrado cuando colapsado */
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <GuambraIcon className="h-9 w-auto" />
          </div>
        ) : (
          /* Logo completo cuando expandido */
          <Link href="/admin" className="flex-1 overflow-hidden flex items-center">
            <GuambraLogo size="sm" />
          </Link>
        )}
      </div>

      {/* ── NAVEGACIÓN ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavSection
            key={item.label}
            item={item}
            collapsed={collapsed}
            isOpen={openSections[item.label] ?? false}
            onToggle={() => toggleSection(item.label)}
            pathname={pathname}
          />
        ))}
      </nav>

      {/* ── DIVIDER ── */}
      <div className="section-divider mx-2" />

      {/* ── VERSIÓN / ESTADO ── */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            <Zap size={12} style={{ color: "hsl(var(--primary))" }} />
            <span>GuambraWeb v1.0</span>
            <span
              className="ml-auto px-1.5 py-0.5 rounded text-xs font-medium"
              style={{
                background: "hsl(var(--success) / 0.15)",
                color: "hsl(var(--success))",
              }}
            >
              Live
            </span>
          </div>
        </div>
      )}

      {/* ── BOTÓN COLAPSAR ── */}
      <div
        className="px-2 pb-4 pt-2"
        style={{ borderTop: "1px solid hsl(var(--sidebar-border))" }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
          title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <>
              <PanelLeftClose size={18} />
              <span className="flex-1 text-left text-sm">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: Sidebar fijo ── */}
      <aside className="hidden lg:flex flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* ── MOBILE: Overlay + Drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside
            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex animate-slide-up"
            style={{ transform: "none" }}
          >
            <div className="relative">
              {sidebarContent}
              {/* Botón cerrar en móvil */}
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                style={{
                  color: "hsl(var(--sidebar-foreground))",
                  background: "hsl(var(--sidebar-border))",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
