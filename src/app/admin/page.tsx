"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  ShoppingCart,
  FolderKanban,
  Users,
  DollarSign,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  Loader2,
} from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  paid: "badge-success",
  pending: "badge-warning",
  cancelled: "badge-destructive",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  cancelled: "Cancelado",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // 1. Ventas del Mes: Sumar total_amount donde status sea 'paid'
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        
        const { data: salesData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'paid')
          .gte('created_at', firstDay);
        
        const totalSales = (salesData as any[])?.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) || 0;

        // 2. Proyectos Activos: Contar registros en projects donde status NO sea 'live'
        const { count: activeProjectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'live');

        // 3. Tickets Pendientes: Contar en tickets donde status sea 'open'
        const { count: pendingTicketsCount } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');

        // 4. Suscripciones: Contar en subscriptions donde is_active sea true
        const { count: activeSubsCount } = await supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // 5. Pedidos Recientes (para que el Dashboard no sea estático)
        const { data: recentOrdersData } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            customers (
              company_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Actualizar Estadísticas
        setStats([
          {
            label: "Ventas del Mes",
            value: `$${totalSales.toLocaleString()}`,
            change: "+12.5%",
            up: true,
            icon: DollarSign,
            color: "var(--primary)",
          },
          {
            label: "Proyectos Activos",
            value: (activeProjectsCount || 0).toString(),
            change: "En curso",
            up: true,
            icon: FolderKanban,
            color: "var(--accent)",
          },
          {
            label: "Tickets Pendientes",
            value: (pendingTicketsCount || 0).toString(),
            change: "Abiertos",
            up: false,
            icon: Ticket,
            color: "var(--warning)",
          },
          {
            label: "Suscripciones",
            value: (activeSubsCount || 0).toString(),
            change: "Planes activos",
            up: true,
            icon: CreditCard,
            color: "var(--success)",
          },
        ]);

        if (recentOrdersData) {
          setRecentOrders((recentOrdersData as any[]).map(order => ({
            id: `#${order.id.toString().slice(0, 8)}`,
            cliente: order.customers?.company_name || 'Particular',
            producto: 'Servicio / Plan', 
            monto: `$${order.total_amount}`,
            estado: order.status
          })));
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const today = new Intl.DateTimeFormat('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground animate-pulse">Cargando métricas en tiempo real...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* ── Saludo ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2
            className="text-2xl font-display font-bold capitalize"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Bienvenido de vuelta 👋
          </h2>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem" }} className="first-letter:uppercase">
            Aquí tienes el resumen del día — {today}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
             style={{
               background: "hsl(var(--success) / 0.1)",
               color: "hsl(var(--success))",
               border: "1px solid hsl(var(--success) / 0.3)",
             }}>
          <Activity size={12} />
          Conectado a Producción
        </div>
      </div>

      {/* ── Estadísticas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="stat-card"
              style={{ padding: "1.25rem 1.5rem" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-1"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-display font-bold"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {stat.value}
                  </p>
                  <div
                    className="flex items-center gap-1 mt-1 text-xs font-medium"
                    style={{
                      color: stat.up
                        ? "hsl(var(--success))"
                        : "hsl(var(--destructive))",
                    }}
                  >
                    {stat.up ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `hsl(${stat.color.replace("var(", "").replace(")", "")} / 0.15)`,
                    color: `hsl(${stat.color.replace("var(", "").replace(")", "")})`,
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pedidos Recientes ── */}
      <div className="card overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <h3
            className="font-display font-semibold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Últimos Pedidos
          </h3>
          <a
            href="/admin/ventas/pedidos"
            className="text-xs font-medium flex items-center gap-1 transition-colors"
            style={{ color: "hsl(var(--primary))" }}
          >
            Ver todos <ArrowUpRight size={13} />
          </a>
        </div>

        <div className="table-wrapper" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-mono text-xs" style={{ color: "hsl(var(--primary))" }}>
                        {order.id}
                      </span>
                    </td>
                    <td className="font-medium">{order.cliente}</td>
                    <td style={{ color: "hsl(var(--muted-foreground))" }}>{order.producto}</td>
                    <td className="font-semibold">{order.monto}</td>
                    <td>
                      <span className={STATUS_STYLE[order.estado] || "badge-secondary"}>
                        {STATUS_LABEL[order.estado] || order.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay pedidos recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

