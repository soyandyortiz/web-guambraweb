"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { usePathname } from "next/navigation";

/* Mapa de rutas a títulos de página */
const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  // Ventas
  "/admin/ventas/pedidos": "Pedidos",
  "/admin/ventas/productos": "Productos",
  "/admin/ventas/categorias": "Categorías de Productos",
  "/admin/ventas/cupones": "Cupones",
  // Clientes
  "/admin/clientes": "Gestión de Clientes",
  // Equipo
  "/admin/equipo": "Equipo de Desarrollo",
  // Producción
  "/admin/produccion/proyectos": "Proyectos",
  "/admin/produccion/kanban": "Kanban",
  // Soporte
  "/admin/soporte/tickets": "Tickets",
  "/admin/soporte/assets": "IT Assets",
  // Finanzas
  "/admin/finanzas/facturas": "Facturas",
  "/admin/finanzas/suscripciones": "Suscripciones",
  "/admin/finanzas/planes": "Planes de Suscripción",
  "/admin/ventas/proformas": "Proformas",
  "/admin/ventas/proformas/nueva": "Emitir Proforma",
  // Bio Links
  "/admin/bio-links": "Bio Links",
  "/admin/portafolio": "Portafolio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader
          onMenuClick={() => setMobileOpen(true)}
          title={pageTitle}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
