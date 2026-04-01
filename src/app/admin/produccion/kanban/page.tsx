export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/admin/kanban/KanbanBoard";
import type { KanbanTask, KanbanColumn } from "@/components/admin/kanban/KanbanBoard";
import { LayoutDashboard, AlertCircle, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanban | Producción — GuambraWeb",
  description: "Tablero Kanban dinámico para la gestión de tareas del equipo.",
};

const VALID_COLUMNS: KanbanColumn[] = ["To Do", "Doing", "Done"];

function sanitizeColumn(raw: string | null): KanbanColumn {
  if (raw && (VALID_COLUMNS as string[]).includes(raw)) {
    return raw as KanbanColumn;
  }
  return "To Do";
}

type RawTask = {
  id: string;
  title: string;
  description: string | null;
  column_name: string | null;
  priority: string | null;
  due_date: string | null;
  assigned_to: string | null;
  profiles: { full_name: string } | null;
  created_at: string;
};

export default async function KanbanPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData, error } = await (supabase as any)
    .from("tasks_kanban")
    .select(
      "id, title, description, column_name, priority, due_date, assigned_to, profiles(full_name), created_at"
    )
    .order("created_at", { ascending: false });

  const tasks: KanbanTask[] = ((rawData ?? []) as RawTask[]).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    column_name: sanitizeColumn(t.column_name),
    priority: (["low", "medium", "high"].includes(t.priority ?? "")
      ? t.priority
      : null) as KanbanTask["priority"],
    due_date: t.due_date,
    assigned_to_id: t.assigned_to,
    assigned_to: t.profiles?.full_name || null,
    created_at: t.created_at,
  }));

  /* Conteos por columna */
  const counts = {
    todo:  tasks.filter((t) => t.column_name === "To Do").length,
    doing: tasks.filter((t) => t.column_name === "Doing").length,
    done:  tasks.filter((t) => t.column_name === "Done").length,
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "hsl(var(--primary) / 0.15)",
              color: "hsl(var(--primary))",
            }}
          >
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h2
              className="font-display font-bold text-xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Tablero Kanban
            </h2>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {error
                ? "Error al cargar tareas"
                : `${tasks.length} tarea${tasks.length !== 1 ? "s" : ""} · 📋 ${counts.todo} · ⚡ ${counts.doing} · ✅ ${counts.done}`}
            </p>
          </div>
        </div>

        {/* Acceso rápido para nueva tarea (se abre el modal desde el tablero) */}
        {!error && (
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{
              background: "hsl(var(--muted) / 0.5)",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            <Plus size={12} />
            Usa el botón <strong>+</strong> de cada columna para agregar tareas
          </div>
        )}
      </div>

      {/* ── Error de Supabase ── */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "hsl(var(--destructive) / 0.1)",
            border: "1px solid hsl(var(--destructive) / 0.3)",
            color: "hsl(var(--destructive))",
          }}
        >
          <AlertCircle size={16} />
          Error cargando tareas: {(error as { message: string }).message}
        </div>
      )}

      {/* ── Tablero Kanban ── */}
      {!error && <KanbanBoard initialTasks={tasks} />}
    </div>
  );
}
