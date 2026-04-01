"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ExternalLink,
  GitBranch,
  Calendar,
  Users,
  Building2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  Plus,
  FolderKanban,
  X,
  Info,
  Loader2,
  CheckCircle2,
  Save,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { updateProject, deleteProject } from "@/app/actions/projects";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  status: "design" | "development" | "qa" | "live";
  start_date: string | null;
  end_date: string | null;
  repo_url: string | null;
  created_at: string;
  company_name: string;
  developers: string[];
};

/* ─────────────────────────────────────────
   CONFIGURACIÓN DE ESTADOS
───────────────────────────────────────── */
const STATUS_CONFIG = {
  design: {
    label: "Diseño",
    bg: "hsl(var(--secondary) / 0.15)",
    color: "hsl(var(--secondary))",
    border: "hsl(var(--secondary) / 0.35)",
    dot: "hsl(var(--secondary))",
  },
  development: {
    label: "Desarrollo",
    bg: "hsl(var(--primary) / 0.15)",
    color: "hsl(var(--primary))",
    border: "hsl(var(--primary) / 0.35)",
    dot: "hsl(var(--primary))",
  },
  qa: {
    label: "QA / Pruebas",
    bg: "hsl(var(--warning) / 0.15)",
    color: "hsl(var(--warning))",
    border: "hsl(var(--warning) / 0.35)",
    dot: "hsl(var(--warning))",
  },
  live: {
    label: "En Vivo",
    bg: "hsl(var(--success) / 0.15)",
    color: "hsl(var(--success))",
    border: "hsl(var(--success) / 0.35)",
    dot: "hsl(var(--success))",
  },
} as const;

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>;

/* ─────────────────────────────────────────
   BADGE DE ESTADO
───────────────────────────────────────── */
function StatusBadge({ status }: { status: ProjectRow["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.design;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────
   AVATAR STACK DE DEVELOPERS
───────────────────────────────────────── */
function DeveloperAvatars({ developers }: { developers: string[] }) {
  if (developers.length === 0) {
    return (
      <span className="text-xs italic" style={{ color: "hsl(var(--muted-foreground))" }}>
        Sin asignar
      </span>
    );
  }

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {developers.slice(0, 3).map((name, i) => (
        <div
          key={name}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
          style={{
            background: `${colors[i % colors.length].replace(")", " / 0.12)")}`,
            color: colors[i % colors.length],
            border: `1px solid ${colors[i % colors.length].replace(")", " / 0.3)")}`,
          }}
          title={name}
        >
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{
              background: colors[i % colors.length],
              fontSize: "9px",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          {name.split(" ")[0]}
        </div>
      ))}
      {developers.length > 3 && (
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          +{developers.length - 3}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FORMATO DE FECHA
───────────────────────────────────────── */
function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─────────────────────────────────────────
   ÍCONO DE ORDENAMIENTO
───────────────────────────────────────── */
type SortDir = "asc" | "desc" | null;
function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp size={13} />;
  if (dir === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
}

/* ─────────────────────────────────────────
   ESTADO VACÍO
───────────────────────────────────────── */
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "hsl(var(--muted))" }}
      >
        <Filter size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
      </div>
      <h3
        className="font-display font-semibold text-lg mb-1"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {filtered ? "Sin resultados" : "No hay proyectos"}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
        {filtered
          ? "Prueba ajustando los filtros de búsqueda o estado."
          : "Aún no tienes proyectos registrados. Crea el primero."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   TABLA DE PROYECTOS (CLIENT COMPONENT)
───────────────────────────────────────── */
type Props = { projects: ProjectRow[] };

export function ProyectosTable({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; company_name: string | null }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [developersList, setDevelopersList] = useState<{ id: string; full_name: string | null }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    customer_id: "",
    status: "design",
    start_date: "",
    end_date: "",
    repo_url: "",
    developer_ids: [] as string[],
  });

  const openNewModal = async () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      customer_id: "",
      status: "design",
      start_date: "",
      end_date: "",
      repo_url: "",
      developer_ids: [],
    });
    setIsModalOpen(true);
    setFetchingCustomers(true);
    try {
      const [customersRes, devsRes] = await Promise.all([
        supabase.from('customers').select('id, company_name').order('company_name'),
        supabase.from('profiles').select('id, full_name').eq('role', 'dev').order('full_name')
      ]);
      setCustomers(customersRes.data || []);
      setDevelopersList(devsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingCustomers(false);
    }
  };

  const openEditModal = async (project: ProjectRow) => {
    // Necesitamos el customer_id que no viene en ProjectRow (viene company_name)
    // Buscamos el proyecto completo para tener el customer_id
    setLoading(true);
    try {
      const { data: fullProj } = await supabase.from('projects').select('customer_id').eq('id', project.id).single();
      
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || "",
        customer_id: fullProj?.customer_id || "",
        status: project.status,
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        repo_url: project.repo_url || "",
        developer_ids: [], // Se llenará abajo
      });
      setIsModalOpen(true);
      
      setFetchingCustomers(true);
      const [customersRes, devsRes, currentDevsRes] = await Promise.all([
        supabase.from('customers').select('id, company_name').order('company_name'),
        supabase.from('profiles').select('id, full_name').eq('role', 'dev').order('full_name'),
        supabase.from('project_assignments').select('profile_id').eq('project_id', project.id)
      ]);

      setCustomers(customersRes.data || []);
      setDevelopersList(devsRes.data || []);
      
      const currentDevIds = (currentDevsRes.data || [])
        .map(d => d.profile_id)
        .filter((id): id is string => id !== null);
      setFormData(prev => ({ ...prev, developer_ids: currentDevIds }));
    } catch (err) {
      console.error(err);
      alert("Error al cargar datos del proyecto.");
    } finally {
      setLoading(false);
      setFetchingCustomers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProject) {
        // UPDATE
        const res = await updateProject(editingProject.id, {
          name: formData.name,
          description: formData.description,
          status: formData.status as any,
          repo_url: formData.repo_url,
          customer_id: formData.customer_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          developer_ids: formData.developer_ids
        });

        if (!res.success) throw new Error(res.message || "Error al actualizar proyecto");

        const newCustomer = customers.find(c => c.id === formData.customer_id);
        
        setProjects(prev => prev.map(p => p.id === editingProject.id ? { 
          ...p, 
          name: formData.name, 
          description: formData.description,
          status: formData.status as any,
          repo_url: formData.repo_url,
          start_date: formData.start_date,
          end_date: formData.end_date,
          company_name: newCustomer?.company_name || '—',
          developers: developersList
            .filter(d => formData.developer_ids.includes(d.id))
            .map(d => d.full_name || 'Dev')
        } : p));
      } else {
        // CREATE
        const res = await fetch("/api/admin/create-project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al crear el proyecto");
        
        const customer = customers.find(c => c.id === formData.customer_id);
        
        const newProject: ProjectRow = {
          id: data.project.id,
          name: data.project.name,
          description: data.project.description,
          status: data.project.status as any,
          start_date: data.project.start_date,
          end_date: data.project.end_date,
          repo_url: data.project.repo_url,
          created_at: data.project.created_at,
          company_name: customer?.company_name || '—',
          developers: developersList
            .filter(d => formData.developer_ids.includes(d.id))
            .map(d => d.full_name || 'Dev')
        };
        
        setProjects(prev => [newProject, ...prev]);
      }
      
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    
    setLoading(true);
    try {
      const res = await deleteProject(id);
      if (!res.success) throw new Error(res.message || "Error al eliminar proyecto");
      
      setProjects(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const [sortKey, setSortKey] = useState<keyof ProjectRow>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  /* ── Filtrar ── */
  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.company_name.toLowerCase().includes(q) ||
      p.developers.some((d) => d.toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ── Ordenar ── */
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  function toggleSort(key: keyof ProjectRow) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function getSortDir(key: keyof ProjectRow): SortDir {
    if (sortKey !== key) return null;
    return sortDir;
  }

  /* ── Estadísticas rápidas ── */
  const countByStatus = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: projects.filter((p) => p.status === s).length }),
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {/* ── Resumen de estados ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className="text-left p-3 rounded-xl border transition-all duration-150"
              style={{
                background:
                  statusFilter === s ? cfg.bg : "hsl(var(--card))",
                borderColor:
                  statusFilter === s ? cfg.border : "hsl(var(--border))",
              }}
            >
              <div
                className="text-2xl font-display font-bold"
                style={{ color: cfg.color }}
              >
                {countByStatus[s] ?? 0}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {cfg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Controles ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
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
            placeholder="Buscar por nombre, cliente o desarrollador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 min-w-0"
            style={{ color: "hsl(var(--foreground))" }}
          />
        </div>

        {/* Filtro de estado */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input text-sm"
          style={{ width: "auto", minWidth: "160px" }}
        >
          <option value="all">Todos los estados</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>

        <button onClick={openNewModal} className="btn-primary gap-2 h-auto py-2 whitespace-nowrap">
          <Plus size={16} />
          Nuevo Proyecto
        </button>
      </div>

      {/* ── Tabla ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid hsl(var(--border))" }}
      >
        {sorted.length === 0 ? (
          <EmptyState filtered={search !== "" || statusFilter !== "all"} />
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              {/* ── THEAD ── */}
              <thead>
                <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
                  {[
                    { key: "name" as const, label: "Proyecto", icon: null },
                    { key: "company_name" as const, label: "Cliente", icon: Building2 },
                    { key: "status" as const, label: "Estado", icon: null },
                    { key: null, label: "Desarrolladores", icon: Users },
                    { key: "start_date" as const, label: "Inicio", icon: Calendar },
                    { key: "end_date" as const, label: "Entrega", icon: Calendar },
                    { key: null, label: "Repo", icon: GitBranch },
                    { key: null, label: "Acciones", icon: null },
                  ].map(({ key, label, icon: Icon }) => (
                    <th
                      key={label}
                      onClick={key ? () => toggleSort(key) : undefined}
                      style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 600,
                        color: "hsl(var(--muted-foreground))",
                        cursor: key ? "pointer" : "default",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon size={13} />}
                        {label}
                        {key && <SortIcon dir={getSortDir(key)} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ── TBODY ── */}
              <tbody>
                {sorted.map((project, idx) => (
                  <tr
                    key={project.id}
                    style={{
                      borderBottom:
                        idx < sorted.length - 1
                          ? "1px solid hsl(var(--border) / 0.5)"
                          : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        "hsl(var(--muted) / 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        "transparent";
                    }}
                  >
                    {/* Proyecto */}
                    <td style={{ padding: "0.875rem 1rem", maxWidth: "220px" }}>
                      <div
                        className="font-semibold truncate"
                        style={{ color: "hsl(var(--foreground))" }}
                        title={project.name}
                      >
                        {project.name}
                      </div>
                      {project.description && (
                        <div
                          className="text-xs truncate mt-0.5"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                          title={project.description}
                        >
                          {project.description}
                        </div>
                      )}
                    </td>

                    {/* Cliente */}
                    <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                      <span style={{ color: "hsl(var(--foreground))" }}>
                        {project.company_name}
                      </span>
                    </td>

                    {/* Estado */}
                    <td style={{ padding: "0.875rem 1rem", whiteSpace: "nowrap" }}>
                      <StatusBadge status={project.status} />
                    </td>

                    {/* Desarrolladores */}
                    <td style={{ padding: "0.875rem 1rem", minWidth: "200px" }}>
                      <DeveloperAvatars developers={project.developers} />
                    </td>

                    {/* Inicio */}
                    <td
                      style={{
                        padding: "0.875rem 1rem",
                        whiteSpace: "nowrap",
                        color: "hsl(var(--muted-foreground))",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {formatDate(project.start_date)}
                    </td>

                    {/* Entrega */}
                    <td
                      style={{
                        padding: "0.875rem 1rem",
                        whiteSpace: "nowrap",
                        fontSize: "0.8125rem",
                      }}
                    >
                      {project.end_date ? (
                        <span
                          style={{
                            color:
                              new Date(project.end_date) < new Date() &&
                              project.status !== "live"
                                ? "hsl(var(--destructive))"
                                : "hsl(var(--muted-foreground))",
                            fontWeight:
                              new Date(project.end_date) < new Date() &&
                              project.status !== "live"
                                ? 600
                                : 400,
                          }}
                        >
                          {formatDate(project.end_date)}
                        </span>
                      ) : (
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>—</span>
                      )}
                    </td>

                    {/* Repositorio */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      {project.repo_url ? (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          <GitBranch size={13} />
                          Repo
                        </a>
                      ) : (
                        <span
                          className="text-xs"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td style={{ padding: "0.875rem 1rem", textAlign: "right" }}>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/produccion/proyectos/${project.id}`}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Ver detalle"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Footer de la tabla ── */}
        {sorted.length > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3 text-xs border-t"
            style={{
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--muted-foreground))",
              background: "hsl(var(--muted) / 0.3)",
            }}
          >
            <span>
              Mostrando {sorted.length} de {projects.length} proyecto
              {projects.length !== 1 ? "s" : ""}
            </span>
            <span>
              Ordenado por <strong style={{ color: "hsl(var(--foreground))" }}>{sortKey}</strong>{" "}
              ({sortDir === "asc" ? "↑ ascendente" : "↓ descendente"})
            </span>
          </div>
        )}
      </div>

      {/* ── MODAL DE NUEVO PROYECTO ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="card w-full max-w-2xl animate-scale-in p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                {editingProject ? <Edit2 size={18} className="text-primary" /> : <FolderKanban size={18} className="text-primary" />}
                {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nombre y Descripción */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <FolderKanban size={14} className="text-primary" />
                      Nombre del Proyecto
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ej: Rediseño E-commerce Guambra"
                      className="input w-full"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Info size={14} className="text-primary" />
                      Descripción del Proyecto
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve descripción del alcance y objetivos..."
                      className="input w-full py-3 resize-none text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Cliente (Select dinámico) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Building2 size={14} className="text-primary" />
                    Cliente (Empresa)
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="input w-full appearance-none pr-10 text-sm"
                      value={formData.customer_id}
                      onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                      disabled={fetchingCustomers}
                    >
                      <option value="">Selecciona un cliente...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company_name || "Sin nombre de empresa"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      {fetchingCustomers ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} className="opacity-0" />}
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Estado Inicial</label>
                  <select
                    className="input w-full text-sm"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="design">🎨 Diseño</option>
                    <option value="development">💻 Desarrollo</option>
                    <option value="qa">🧪 QA / Pruebas</option>
                    <option value="live">🚀 En Vivo (Live)</option>
                  </select>
                </div>

                {/* Fechas */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    className="input w-full text-sm"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    Fecha de Entrega Estimada
                  </label>
                  <input
                    type="date"
                    className="input w-full text-sm"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>

                {/* Repo URL */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <GitBranch size={14} className="text-primary" />
                    URL del Repositorio (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/usuario/repo"
                    className="input w-full text-sm"
                    value={formData.repo_url}
                    onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                  />
                </div>

                {/* Selección de Desarrolladores */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Users size={14} className="text-primary" />
                    Equipo de Desarrollo
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 rounded-xl border bg-muted/20" style={{ borderColor: "hsl(var(--border))" }}>
                    {developersList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic col-span-2">No se encontraron perfiles con rol 'dev'.</p>
                    ) : (
                      developersList.map((dev) => (
                        <label key={dev.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            checked={formData.developer_ids.includes(dev.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...formData.developer_ids, dev.id]
                                : formData.developer_ids.filter(id => id !== dev.id);
                              setFormData({ ...formData, developer_ids: newIds });
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                              {dev.full_name?.charAt(0) || 'D'}
                            </div>
                            <span className="text-xs font-medium group-hover:text-primary transition-colors">
                              {dev.full_name}
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    * Puedes seleccionar uno o varios desarrolladores para este proyecto.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Guardar Proyecto
                    </>
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
