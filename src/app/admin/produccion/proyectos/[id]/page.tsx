"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { revalidateAdmin } from "@/app/actions/admin";
import { 
  FolderKanban, 
  ArrowLeft, 
  Users, 
  Plus, 
  Trash2, 
  Loader2, 
  Building2, 
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock
} from "lucide-react";
import Link from "next/link";
import { checkProjectAccess } from "@/app/actions/subscription";
import { 
  Edit, 
  Save, 
  X as XIcon, 
  GitBranch, 
  ExternalLink,
  Globe
} from "lucide-react";
import { updateProject } from "@/app/actions/projects";

interface DevProfile {
  id: string;
  full_name: string;
  email: string;
}

interface Assignment {
  id: string;
  profile_id: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  repo_url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  customers: {
    company_name: string;
  } | null;
  project_assignments: Assignment[];
}

export default function DetalleProyectoPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [availableDevs, setAvailableDevs] = useState<DevProfile[]>([]);
  const [selectedDevId, setSelectedDevId] = useState("");
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState({ allowAccess: true, isLimited: false, status: "active" });

  // Estado para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "",
    repo_url: "",
    start_date: "",
    end_date: "",
    developer_ids: [] as string[]
  });

  useEffect(() => {
    async function loadData() {
      try {
        // 0. Validar acceso por suscripción
        const accessCheck = await checkProjectAccess(id as string);
        setAccess({
          allowAccess: accessCheck.allowAccess,
          isLimited: accessCheck.isLimited,
          status: accessCheck.status || "active"
        });

        if (!accessCheck.allowAccess) {
          setLoading(false);
          return;
        }

        // 1. Cargar Proyecto y sus asignaciones actuales
        const { data: projData, error: projError } = await (supabase as any)
          .from("projects")
          .select(`
            id,
            name,
            description,
            status,
            repo_url,
            start_date,
            end_date,
            created_at,
            customers ( company_name ),
            project_assignments (
              id,
              profile_id,
              profiles ( full_name, email )
            )
          `)
          .eq("id", id)
          .single();

        if (projError) throw projError;
        setProject(projData);

        // 2. Cargar Perfiles con rol 'dev'
        const { data: devsData, error: devsError } = await (supabase as any)
          .from("profiles")
          .select("id, full_name, email")
          .eq("role", "dev")
          .order("full_name");

        if (devsError) throw devsError;
        setAvailableDevs(devsData || []);

      } catch (err) {
        console.error("Error loading project detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, supabase]);

  const handleOpenEdit = () => {
    if (!project) return;
    setEditForm({
      name: project.name,
      description: project.description || "",
      status: project.status || "design",
      repo_url: project.repo_url || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      developer_ids: project.project_assignments.map(a => a.profile_id)
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await updateProject(id as string, editForm);
        if (res.success) {
          // El proyecto básico se actualiza así:
          const { developer_ids, ...basicData } = editForm;
          
          // Pero para los assignments necesitamos los objetos completos con perfiles
          // Si hubo cambios en devs, lo más sano es recargar o reconstruir.
          // Como ya tenemos availableDevs, podemos reconstruir:
          const newAssignments = availableDevs
            .filter(d => editForm.developer_ids.includes(d.id))
            .map(d => ({
              id: Math.random().toString(), // id temporal o recargar
              profile_id: d.id,
              profiles: { full_name: d.full_name, email: d.email }
            }));

          setProject(prev => prev ? { 
            ...prev, 
            ...basicData, 
            project_assignments: newAssignments as any 
          } : null);
          
          setIsEditModalOpen(false);
          router.refresh();
        } else {
          alert("Error: " + res.message);
        }
      } catch (err) {
        console.error("Error updating project:", err);
      }
    });
  };

  const handleAssignDev = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevId) return;

    // Verificar si ya está asignado
    if (project?.project_assignments.some(a => a.profile_id === selectedDevId)) {
      alert("Este desarrollador ya está asignado al proyecto.");
      return;
    }

    startTransition(async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("project_assignments")
          .insert([{ project_id: id, profile_id: selectedDevId }])
          .select(`
            id,
            profile_id,
            profiles ( full_name, email )
          `)
          .single();

        if (error) throw error;

        // Actualizar estado local
        setProject(prev => prev ? {
          ...prev,
          project_assignments: [...prev.project_assignments, data]
        } : null);
        
        setSelectedDevId("");
        await revalidateAdmin();
        router.refresh(); // Refrescar para que se vea en la tabla maestra también
      } catch (err) {
        console.error("Error assigned dev:", err);
        alert("Error al asignar desarrollador.");
      }
    });
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm("¿Seguro que deseas remover a este desarrollador del equipo?")) return;

    try {
      const { error } = await supabase
        .from("project_assignments")
        .delete()
        .eq("id", assignmentId);

      if (error) throw error;

      // Actualizar estado local
      setProject(prev => prev ? {
        ...prev,
        project_assignments: prev.project_assignments.filter(a => a.id !== assignmentId)
      } : null);
      
      await revalidateAdmin();
      router.refresh();
    } catch (err) {
      console.error("Error removing assignment:", err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
      <Loader2 className="animate-spin" size={32} />
      <p>Cargando detalles del proyecto...</p>
    </div>
  );

  if (!access.allowAccess) return (
    <div className="text-center py-20 animate-slide-up">
      <div className="bg-destructive/10 text-destructive p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-destructive/20">
        <Lock size={32} />
      </div>
      <h2 className="text-2xl font-display font-bold">Acceso Bloqueado</h2>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
        La suscripción de este proyecto ha sido cancelada. Por favor, comunícate con soporte o realiza el pago correspondiente para recuperar el acceso.
      </p>
      <Link href="/admin/produccion/proyectos" className="btn-primary mt-6 inline-block px-6">
        Volver a la lista
      </Link>
    </div>
  );

  if (!project) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold">Proyecto no encontrado</h2>
      <Link href="/admin/produccion/proyectos" className="text-primary hover:underline mt-4 inline-block">
        Volver a la lista
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/produccion/proyectos"
            className="p-2 rounded-lg transition-colors border"
            style={{ 
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--card))",
              color: "hsl(var(--muted-foreground))"
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">{project.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 size={14} /> {(project.customers as any)?.company_name}
            </p>
          </div>
        </div>

        {access.isLimited && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
            <AlertTriangle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Acceso Limitado - Pago Pendiente</span>
          </div>
        )}

        <button 
          onClick={handleOpenEdit}
          className="btn-secondary btn-sm gap-2"
        >
          <Edit size={16} />
          Editar Detalles
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lado izquierdo: Info General */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <FolderKanban size={18} className="text-primary" />
              Descripción
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              {project.description || "Sin descripción proporcionada."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
               <div className="space-y-1">
                 <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Estado Actual</p>
                 <span className="text-sm font-semibold capitalize flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      background: project.status === 'live' ? 'hsl(var(--success))' : 
                                 project.status === 'qa' ? 'hsl(var(--warning))' :
                                 project.status === 'development' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                    }} />
                    {project.status}
                 </span>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Fecha de Creación</p>
                 <span className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                   <Calendar size={13} />
                   {new Date((project as any).created_at || Date.now()).toLocaleDateString()}
                 </span>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Repositorio</p>
                 {project.repo_url ? (
                   <a href={project.repo_url} target="_blank" rel="noreferrer" className="text-sm font-semibold flex items-center gap-1.5 text-primary hover:underline">
                     <GitBranch size={13} />
                     Git Repo
                     <ExternalLink size={10} />
                   </a>
                 ) : <span className="text-sm text-muted-foreground">No vinculado</span>}
               </div>
            </div>
          </div>
        </div>

        {/* Lado derecho: Gestión de Equipo */}
        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Users size={18} className="text-success" />
                Equipo Asignado
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                {project.project_assignments.length}
              </span>
            </div>

            {/* Formulario de asignación */}
            <form onSubmit={handleAssignDev} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Asignar Desarrollador
                </label>
                <div className="flex gap-2">
                  <select
                    className="input text-xs flex-1"
                    value={selectedDevId}
                    onChange={(e) => setSelectedDevId(e.target.value)}
                    disabled={isPending}
                  >
                    <option value="">Selecciona dev...</option>
                    {availableDevs.map(dev => (
                      <option key={dev.id} value={dev.id}>{dev.full_name}</option>
                    ))}
                  </select>
                  <button 
                    type="submit"
                    disabled={isPending || !selectedDevId}
                    className="btn-primary p-2 h-auto"
                    style={{ background: "hsl(var(--success))", borderColor: "hsl(var(--success))" }}
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {project.project_assignments.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed text-muted-foreground">
                  <p className="text-xs">No hay desarrolladores asignados aún.</p>
                </div>
              ) : (
                project.project_assignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="flex items-center justify-between p-3 rounded-xl border group transition-colors hover:bg-muted/30"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {assignment.profiles.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{assignment.profiles.full_name}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <ShieldCheck size={10} className="text-success" />
                          Developer
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <p className="text-[10px] text-muted-foreground italic leading-tight">
              * Solo se muestran perfiles con el rol 'dev'. Los cambios se reflejan instantáneamente en el Dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border animate-slide-up">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-display font-bold">Editar Proyecto</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <XIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre del Proyecto</label>
                <input 
                  type="text"
                  required
                  className="input w-full"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descripción</label>
                <textarea 
                  rows={4}
                  className="input w-full py-2"
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado</label>
                  <select 
                    className="input w-full"
                    value={editForm.status}
                    onChange={e => setEditForm({...editForm, status: e.target.value})}
                  >
                    <option value="design">Diseño</option>
                    <option value="development">Desarrollo</option>
                    <option value="qa">QA / Pruebas</option>
                    <option value="live">En Vivo (Entregado)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Repositorio URL</label>
                  <input 
                    type="url"
                    placeholder="https://github.com/..."
                    className="input w-full"
                    value={editForm.repo_url}
                    onChange={e => setEditForm({...editForm, repo_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha de Inicio</label>
                  <input 
                    type="date"
                    className="input w-full"
                    value={editForm.start_date}
                    onChange={e => setEditForm({...editForm, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fecha de Entrega</label>
                  <input 
                    type="date"
                    className="input w-full"
                    value={editForm.end_date}
                    onChange={e => setEditForm({...editForm, end_date: e.target.value})}
                  />
                </div>
              </div>

              {/* Selección de Desarrolladores */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Users size={14} className="text-primary" />
                  Equipo de Desarrollo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 rounded-2xl border bg-muted/20" style={{ borderColor: "hsl(var(--border))" }}>
                  {availableDevs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic col-span-2">No hay desarrolladores disponibles.</p>
                  ) : (
                    availableDevs.map((dev) => (
                      <label key={dev.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={editForm.developer_ids.includes(dev.id)}
                          onChange={(e) => {
                            const newIds = e.target.checked
                              ? [...editForm.developer_ids, dev.id]
                              : editForm.developer_ids.filter(id => id !== dev.id);
                            setEditForm({ ...editForm, developer_ids: newIds });
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
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary flex-1 py-3"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="btn-primary flex-1 py-3 gap-2"
                >
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
