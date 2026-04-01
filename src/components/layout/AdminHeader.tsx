"use client";

import { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

type AdminHeaderProps = {
  onMenuClick: () => void;
  title?: string;
};

export function AdminHeader({ onMenuClick, title = "Dashboard" }: AdminHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ email: string; full_name: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Cargar info del usuario
  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", authUser.id)
          .single();
        setUser({
          email: authUser.email ?? "",
          full_name: profile?.full_name ?? "Administrador",
        });
      }
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const SEARCH_LINKS = [
    { label: "Proyectos", href: "/admin/produccion/proyectos" },
    { label: "Clientes", href: "/admin/clientes" },
    { label: "Pedidos", href: "/admin/ventas/pedidos" },
    { label: "Productos", href: "/admin/ventas/productos" },
    { label: "Tickets de Soporte", href: "/admin/soporte/tickets" },
    { label: "Facturas", href: "/admin/finanzas/facturas" },
    { label: "Suscripciones", href: "/admin/finanzas/suscripciones" },
    { label: "Cupones", href: "/admin/ventas/cupones" },
    { label: "Kanban", href: "/admin/produccion/kanban" },
    { label: "Equipo", href: "/admin/equipo" },
  ];

  const [searchResults, setSearchResults] = useState<{ label: string; href: string; type: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Búsqueda real en DB (Clientes y Proyectos) + Enlaces estáticos
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const [customersRes, projectsRes] = await Promise.all([
          supabase.from("customers").select("id, company_name").ilike("company_name", `%${searchQuery}%`).limit(3),
          supabase.from("projects").select("id, name").ilike("name", `%${searchQuery}%`).limit(3)
        ]);

        const dbResults = [
          ...(customersRes.data?.map(c => ({ 
            label: `Cliente: ${c.company_name}`, 
            href: `/admin/clientes`, // Podría ser a un detalle específico si existiera la ruta /admin/clientes/[id]
            type: "db" 
          })) || []),
          ...(projectsRes.data?.map(p => ({ 
            label: `Proyecto: ${p.name}`, 
            href: `/admin/produccion/proyectos`, 
            type: "db" 
          })) || [])
        ];

        const staticMatches = SEARCH_LINKS.filter(l => 
          l.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(l => ({ ...l, type: "nav" }));

        setSearchResults([...dbResults, ...staticMatches]);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, supabase]);

  return (
    <header
      className="sticky top-0 z-30 flex items-center h-16 px-4 lg:px-6 gap-4 border-b"
      style={{
        background: "hsl(var(--card) / 0.9)",
        backdropFilter: "blur(12px)",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* Botón menú móvil */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg btn-ghost"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Título de página */}
      <h1
        className="font-display font-semibold text-lg hidden sm:block"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {title}
      </h1>

      {/* Espaciador */}
      <div className="flex-1" />

      {/* Buscador */}
      <div className="hidden md:block relative max-w-xs w-full">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
             style={{
               background: "hsl(var(--input))",
               border: "1px solid hsl(var(--border))",
             }}>
          <Search size={14} className={isSearching ? "animate-pulse" : ""} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Buscar clientes, proyectos o ir a..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 min-w-0"
            style={{ color: "hsl(var(--foreground))" }}
          />
        </div>

        {/* Resultados de búsqueda */}
        {searchQuery.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl z-50 animate-scale-in"
               style={{
                 background: "hsl(var(--card))",
                 border: "1px solid hsl(var(--border))",
                 boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
               }}>
            <div className="px-2 py-1 mb-1 text-[10px] font-bold uppercase text-muted-foreground tracking-widest border-b">
              {isSearching ? "Buscando..." : "Resultados"}
            </div>
            
            {searchResults.length > 0 ? (
              searchResults.map((result, idx) => (
                <button
                  key={`${result.href}-${idx}`}
                  onClick={() => {
                    router.push(result.href);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 group"
                  style={{ color: "hsl(var(--foreground))" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--muted))")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="flex flex-col items-start">
                    <span>{result.label}</span>
                    {result.type === "nav" && <span className="text-[10px] text-primary/70">Módulo Administrativo</span>}
                  </div>
                  <ChevronDown size={12} className="-rotate-90 opacity-0 group-hover:opacity-40 transition-opacity" />
                </button>
              ))
            ) : !isSearching && (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-muted-foreground/80 italic">No se encontraron resultados</p>
                <p className="text-[10px] text-muted-foreground mt-1">Prueba con otras palabras clave</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        {/* Theme switcher */}
        <ThemeSwitcher />


        {/* Menú usuario */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={cn(
              "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-all duration-150",
            )}
            style={{
              background: userMenuOpen ? "hsl(var(--muted))" : "transparent",
              color: "hsl(var(--foreground))",
            }}
            aria-label="Menú usuario"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                color: "white",
              }}
            >
              {user?.full_name?.charAt(0) ?? "A"}
            </div>
            <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
              {user?.full_name ?? "Admin"}
            </span>
            <ChevronDown
              size={14}
              className="transition-transform duration-200"
              style={{
                transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "hsl(var(--muted-foreground))",
              }}
            />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl p-1.5 z-50 animate-scale-in"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* Info del usuario */}
                <div
                  className="px-3 py-2.5 mb-1 rounded-lg"
                  style={{ background: "hsl(var(--muted))" }}
                >
                  <p className="text-sm font-semibold truncate" style={{ color: "hsl(var(--foreground))" }}>
                    {user?.full_name ?? "Administrador"}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {user?.email ?? "Cargando..."}
                  </p>
                </div>

                {[
                  { icon: User, label: "Mi Perfil", href: "/admin/perfil" },
                  { icon: Settings, label: "Configuración", href: "/admin/config" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                               transition-colors duration-150"
                    style={{ color: "hsl(var(--foreground))" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "hsl(var(--muted))";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                    }}
                  >
                    <item.icon size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
                    {item.label}
                  </Link>
                ))}

                <div className="section-divider my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                             transition-colors duration-150"
                  style={{ color: "hsl(var(--destructive))" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "hsl(var(--destructive) / 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
