"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { revalidateAdmin } from "@/app/actions/admin";
import { 
  Headphones, 
  ArrowLeft, 
  Save, 
  FolderKanban, 
  MessageSquare, 
  Info,
  Loader2,
  CheckCircle2,
  Building2
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  customer_id: string;
  customers: {
    company_name: string;
  } | null;
}

export default function NuevoTicketPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    project_id: "",
    status: "open",
  });

  useEffect(() => {
    async function getProjects() {
      try {
        // Obtenemos proyectos y sus clientes asociados
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('projects')
          .select('id, name, customer_id, customers(company_name)')
          .order('name');
        
        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setFetchingProjects(false);
      }
    }
    getProjects();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Buscamos el customer_id del proyecto seleccionado
      const selectedProject = projects.find(p => p.id === formData.project_id);
      
      const { error } = await (supabase as any)
        .from('tickets')
        .insert([{
          subject: formData.subject,
          description: formData.description,
          project_id: formData.project_id || null,
          customer_id: selectedProject?.customer_id || null,
          status: formData.status,
        }]);

      if (error) throw error;
      
      await revalidateAdmin();
      router.push("/admin/soporte/tickets");
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Error al crear el ticket. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/soporte/tickets"
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
            <h2 className="text-2xl font-display font-bold">Nuevo Ticket de Soporte</h2>
            <p className="text-sm text-muted-foreground">Registra un nuevo problema o solicitud.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Asunto */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare size={14} className="text-destructive" />
              Asunto / Título
            </label>
            <input
              required
              type="text"
              placeholder="Ej: Error al procesar pago en carrito"
              className="input w-full"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          {/* Proyecto (Select dinámico) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <FolderKanban size={14} className="text-destructive" />
              Vincular a Proyecto
            </label>
            <div className="relative">
              <select
                required
                className="input w-full appearance-none pr-10"
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                disabled={fetchingProjects}
              >
                <option value="">Selecciona un proyecto...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {(p.customers as any)?.company_name || 'Particular'}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                {fetchingProjects ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} className="opacity-0" />}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Prioridad / Estado Inicial</label>
            <select
              className="input w-full"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="open">🔴 Abierto / Urgente</option>
              <option value="in_progress">🟡 En Proceso</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Info size={14} className="text-destructive" />
              Descripción detallada
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe el problema, pasos para reproducir o detalles de la solicitud..."
              className="input w-full py-3 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <Link href="/admin/soporte/tickets" className="btn-secondary">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary bg-destructive hover:bg-destructive/90"
            style={{ background: "hsl(var(--destructive))", borderColor: "hsl(var(--destructive))" }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Crear Ticket
              </>
            )}
          </button>
        </div>
      </form>

      {/* Helper info */}
      <div className="p-4 rounded-xl flex gap-3 text-xs" style={{ background: "hsl(var(--muted)/0.4)", border: "1px solid hsl(var(--border))" }}>
        <Building2 size={14} className="text-muted-foreground flex-shrink-0" />
        <p className="text-muted-foreground">
          Al seleccionar un proyecto, el ticket se vinculará automáticamente al cliente dueño de dicho proyecto para mantener la trazabilidad.
        </p>
      </div>
    </div>
  );
}
