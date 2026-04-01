"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  UserPlus,
  Mail,
  Calendar,
  Code2,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  MoreHorizontal,
  Trash2,
  X,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────
   TIPOS
    ───────────────────────────────────────── */
export type DevRow = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  role: string;
  project_count: number;
};

type Props = {
  devs: DevRow[];
};

/* ─────────────────────────────────────────
   HELPERS
    ───────────────────────────────────────── */
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────
   COMPONENTE: EquipoTable
    ───────────────────────────────────────── */
export function EquipoTable({ devs: initialDevs }: Props) {
  const [devs, setDevs] = useState<DevRow[]>(initialDevs);

  useEffect(() => {
    setDevs(initialDevs);
  }, [initialDevs]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const fetchDevs = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        email,
        created_at,
        role,
        project_assignments ( count )
      `,
      )
      .in("role", ["dev", "admin"])
      .order("created_at", { ascending: false });

    console.log("Datos cargados (EquipoTable):", data);

    if (error) {
      console.error("Error updating team list:", error);
      return;
    }

    const normalized = (data || []).map((dev) => ({
      id: dev.id,
      full_name: dev.full_name,
      email: dev.email,
      created_at: dev.created_at,
      role: dev.role ?? "",
      project_count: dev.project_assignments?.[0]?.count || 0,
    }));

    setDevs(normalized);
  }, [supabase]);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "dev",
  });

  const handleCreateDev = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Error al crear desarrollador");

      alert("¡Desarrollador registrado exitosamente!");

      const newDev = {
        id: data.user.id,
        full_name: data.user.full_name,
        email: data.user.email,
        created_at: new Date().toISOString(),
        role: data.user.role,
        project_count: 0,
      };

      setDevs((prev) => [newDev, ...prev]);

      setIsModalOpen(false);
      setFormData({ full_name: "", email: "", password: "", role: "dev" });
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteDev = async (id: string, name: string) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar a ${name}? Esta acción borrará su acceso y su perfil definitivamente.`,
      )
    )
      return;

    setIsPending(true);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");

      alert("Usuario eliminado con éxito.");
      await fetchDevs();
      setRefreshKey((prev) => prev + 1);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const filtered = devs.filter(
    (d) =>
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* ── Controles ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
          style={{
            background: "hsl(var(--input))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 min-w-0"
            style={{ color: "hsl(var(--foreground))" }}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary gap-2"
        >
          <UserPlus size={16} />
          Registrar Desarrollador
        </button>
      </div>

      {/* ── Grid de Devs ── */}
      <div
        key={refreshKey}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center card bg-muted/20 border-dashed">
            <Code2 size={40} className="mx-auto mb-4 opacity-20" />
            <h3 className="font-semibold text-lg">
              No se encontraron desarrolladores
            </h3>
            <p className="text-sm text-muted-foreground">
              Prueba con otro término o invita a un nuevo miembro.
            </p>
          </div>
        ) : (
          filtered.map((dev) => (
            <div
              key={dev.id}
              className="card group hover:border-primary/50 transition-all duration-300 overflow-hidden"
              style={{ background: "hsl(var(--card))" }}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl ring-4 ring-primary/5">
                      {dev.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {dev.full_name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <ShieldCheck
                          size={12}
                          className={
                            dev.role === "admin"
                              ? "text-destructive"
                              : "text-success"
                          }
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {dev.role === "admin" ? "Administrador" : "Developer"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteDev(dev.id, dev.full_name)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Eliminar desarrollador"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail size={14} className="text-primary/60" />
                    {dev.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} className="text-primary/60" />
                    Miembro desde: {formatDate(dev.created_at)}
                  </div>
                </div>

                <div
                  className="pt-4 border-t flex items-center justify-between"
                  style={{ borderColor: "hsl(var(--border) / 0.5)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                      <Briefcase size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {dev.project_count}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">
                        Proyectos Activos
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/admin/produccion/proyectos"
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-2 transition-all"
                  >
                    Ver Proyectos
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── MODAL DE REGISTRO ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="card w-full max-w-md animate-scale-in p-6 space-y-6">
            <div
              className="flex items-center justify-between border-b pb-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <UserPlus size={18} className="text-primary" />
                Registrar Nuevo Dev
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDev} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nombre Completo
                  </label>
                  <input
                    required
                    type="text"
                    className="input text-sm"
                    placeholder="Ej. Alan Turing"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Correo Institucional
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-2.5 text-muted-foreground"
                      size={14}
                    />
                    <input
                      required
                      type="email"
                      className="input text-sm pl-9"
                      placeholder="dev@guambraweb.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Contraseña Temporal
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-2.5 text-muted-foreground"
                      size={14}
                    />
                    <input
                      required
                      type="password"
                      className="input text-sm pl-9"
                      placeholder="Min. 6 caracteres"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    * El desarrollador podrá cambiarla tras su primer acceso.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Rol de Acceso
                  </label>
                  <select
                    className="input text-sm"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                  >
                    <option value="dev">Desarrollador (Limitado)</option>
                    <option value="admin">Administrador (Total)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary flex-1 bg-primary gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Crear Acceso"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
