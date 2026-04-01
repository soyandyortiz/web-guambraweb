"use client";

import { useState, useTransition, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateAdmin } from "@/app/actions/admin";
import {
  Search,
  Plus,
  Server,
  Globe,
  Calendar,
  AlertTriangle,
  Loader2,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Cpu,
  ShieldCheck,
  Layout,
} from "lucide-react";

/* ─────────────────────────────────────────
   TIPOS
───────────────────────────────────────── */
export type ITAsset = {
  id: string;
  project_id: string | null;
  domain_name: string | null;
  hosting_provider: string | null;
  renewal_date: string | null;
  tech_stack: Record<string, any> | null;
  // Denormalizado
  project_name: string;
};

export type SimpleProject = {
  id: string;
  name: string;
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(d: string | null) {
  if (!d) return "Sin fecha";
  return new Date(d).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isDueSoon(dateStr: string | null) {
  if (!dateStr) return false;
  const now = new Date();
  const due = new Date(dateStr);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
}

function parseTechStack(stack: any): string[] {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack;
  if (typeof stack === "object") {
    return Object.entries(stack).map(([k, v]) => `${k}: ${v}`);
  }
  return [String(stack)];
}

/* ─────────────────────────────────────────
   COMPONENTE: AssetsTable
───────────────────────────────────────── */
type Props = {
  initialAssets: ITAsset[];
  projects: SimpleProject[];
};

export function AssetsTable({ initialAssets, projects }: Props) {
  const [assets, setAssets] = useState<ITAsset[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Estado del formulario
  const [formData, setFormData] = useState({
    project_id: "",
    domain_name: "",
    hosting_provider: "",
    renewal_date: "",
    tech_stack: "", // Lo pediremos como texto separado por comas para simplificar
  });

  /* ── Filtrado ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assets.filter(
      (a) =>
        a.project_name.toLowerCase().includes(q) ||
        (a.domain_name ?? "").toLowerCase().includes(q) ||
        (a.hosting_provider ?? "").toLowerCase().includes(q)
    );
  }, [assets, search]);

  /* ── Registro ── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id) return;

    startTransition(async () => {
      const supabase = createClient();
      const stackArray = formData.tech_stack
        ? formData.tech_stack.split(",").map((s) => s.trim())
        : [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("assets_it")
        .insert([
          {
            project_id: formData.project_id,
            domain_name: formData.domain_name || null,
            hosting_provider: formData.hosting_provider || null,
            renewal_date: formData.renewal_date || null,
            tech_stack: stackArray,
          },
        ])
        .select();

      if (!error && data) {
        // Encontrar nombre del proyecto para actualizar UI localmente
        const proj = projects.find((p) => p.id === formData.project_id);
        const newAsset: ITAsset = {
          ...data[0],
          project_name: proj?.name ?? "Proyecto desconocido",
        };
        setAssets([newAsset, ...assets]);
        setIsModalOpen(false);
        setFormData({
          project_id: "",
          domain_name: "",
          hosting_provider: "",
          renewal_date: "",
          tech_stack: "",
        });
        await revalidateAdmin();
      }
    });
  };

  /* ── Eliminar ── */
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro técnico?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("assets_it").delete().eq("id", id);
    if (!error) {
      setAssets(assets.filter((a) => a.id !== id));
      await revalidateAdmin();
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Barra de herramientas ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1"
          style={{ background: "hsl(var(--input))", border: "1px solid hsl(var(--border))" }}
        >
          <Search size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Buscar por proyecto, dominio..."
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
          <Plus size={16} />
          Registrar Activo
        </button>
      </div>

      {/* ── Tabla ── */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Proyecto</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Dominio</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Hosting</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Stack</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Renovación</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground italic">
                    No se encontraron activos IT.
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => {
                  const dueSoon = isDueSoon(asset.renewal_date);
                  const stackList = parseTechStack(asset.tech_stack);

                  return (
                    <tr
                      key={asset.id}
                      className="group transition-colors border-b"
                      style={{ borderColor: "hsl(var(--border) / 0.5)" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(var(--muted) / 0.3)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Layout size={16} className="text-primary" />
                          <span className="font-medium">{asset.project_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Globe size={13} />
                          {asset.domain_name || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Server size={13} />
                          {asset.hosting_provider || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {stackList.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight"
                              style={{ background: "hsl(var(--secondary) / 0.1)", color: "hsl(var(--secondary))", border: "1px solid hsl(var(--secondary) / 0.2)" }}
                            >
                              {tag}
                            </span>
                          ))}
                          {stackList.length === 0 && <span className="text-muted-foreground text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${dueSoon ? "text-destructive" : "text-muted-foreground"}`}>
                            <Calendar size={13} />
                            {formatDate(asset.renewal_date)}
                            {dueSoon && <AlertTriangle size={14} className="animate-pulse" />}
                          </div>
                          {dueSoon && asset.renewal_date && (
                            <span className="text-[10px] text-destructive font-bold uppercase">
                              Vence pronto
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Registrar Activo ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="card w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <ShieldCheck className="text-primary" />
                Registrar Activo Técnico
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-4 space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Vincular Proyecto</label>
                <select
                  required
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-input outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                >
                  <option value="">Selecciona un proyecto...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Dominio</label>
                  <input
                    type="text"
                    placeholder="ej. miweb.com"
                    value={formData.domain_name}
                    onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-input outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Hosting</label>
                  <input
                    type="text"
                    placeholder="ej. Vercel, AWS"
                    value={formData.hosting_provider}
                    onChange={(e) => setFormData({ ...formData, hosting_provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-input outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Fecha de Renovación</label>
                <input
                  type="date"
                  value={formData.renewal_date}
                  onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-input outline-none focus:ring-2 ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Tech Stack (comas)</label>
                <input
                  type="text"
                  placeholder="ej. Next.js, Supabase, Tailwind"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-input outline-none focus:ring-2 ring-primary/20 transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary flex-1 gap-2"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  Guardar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
