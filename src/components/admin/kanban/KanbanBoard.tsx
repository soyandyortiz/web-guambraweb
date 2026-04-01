"use client";

import {
  useState,
  useTransition,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { revalidateAdmin } from "@/app/actions/admin";
import {
  Plus,
  X,
  Check,
  AlertTriangle,
  GripVertical,
  Calendar,
  ChevronDown,
  Circle,
  Loader2,
  Pencil,
  Trash2,
  Flag,
  Clock,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export type KanbanColumn = "To Do" | "Doing" | "Done";

export type KanbanTask = {
  id: string;
  title: string;
  description: string | null;
  column_name: KanbanColumn;
  priority: "low" | "medium" | "high" | null;
  due_date: string | null;
  assigned_to: string | null;
  assigned_to_id?: string | null;
  created_at: string;
};

/* ─────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────── */
const COLUMNS: { key: KanbanColumn; label: string; emoji: string }[] = [
  { key: "To Do",  label: "To Do",  emoji: "📋" },
  { key: "Doing",  label: "Doing",  emoji: "⚡" },
  { key: "Done",   label: "Done",   emoji: "✅" },
];

const COLUMN_STYLES: Record<KanbanColumn, { header: string; border: string; bg: string; badge: string; badgeBg: string }> = {
  "To Do": {
    header: "hsl(var(--muted-foreground))",
    border: "hsl(var(--border))",
    bg: "hsl(var(--muted) / 0.3)",
    badge: "hsl(var(--muted-foreground))",
    badgeBg: "hsl(var(--muted))",
  },
  "Doing": {
    header: "hsl(var(--primary))",
    border: "hsl(var(--primary) / 0.4)",
    bg: "hsl(var(--primary) / 0.04)",
    badge: "hsl(var(--primary))",
    badgeBg: "hsl(var(--primary) / 0.12)",
  },
  "Done": {
    header: "hsl(var(--success))",
    border: "hsl(var(--success) / 0.4)",
    bg: "hsl(var(--success) / 0.04)",
    badge: "hsl(var(--success))",
    badgeBg: "hsl(var(--success) / 0.12)",
  },
};

const PRIORITY_CONFIG = {
  high:   { label: "Alta",  color: "hsl(var(--destructive))", bg: "hsl(var(--destructive) / 0.12)" },
  medium: { label: "Media", color: "hsl(var(--warning))",     bg: "hsl(var(--warning) / 0.12)"     },
  low:    { label: "Baja",  color: "hsl(var(--success))",     bg: "hsl(var(--success) / 0.12)"     },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
}

function isOverdue(d: string | null) {
  if (!d) return false;
  return new Date(d) < new Date();
}

/* ─────────────────────────────────────────
   TASK CARD
───────────────────────────────────────── */
function TaskCard({
  task,
  onMove,
  onEdit,
  onDelete,
  isDragging,
  dragHandlers,
}: {
  task: KanbanTask;
  onMove: (id: string, col: KanbanColumn) => void;
  onEdit: (task: KanbanTask) => void;
  onDelete: (task: KanbanTask) => void;
  isDragging: boolean;
  dragHandlers: React.DOMAttributes<HTMLDivElement>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overdue = isOverdue(task.due_date);
  const pCfg = task.priority ? PRIORITY_CONFIG[task.priority] : null;

  // Cierra el menú al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div
      {...dragHandlers}
      draggable
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        padding: "0.875rem",
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? "scale(0.98)" : "scale(1)",
        transition: "opacity 0.15s, transform 0.15s, box-shadow 0.15s",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (!isDragging)
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 16px hsl(var(--foreground) / 0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Cabecera de la tarjeta */}
      <div className="flex items-start gap-2 mb-2">
        <GripVertical
          size={14}
          style={{ color: "hsl(var(--muted-foreground))", marginTop: "2px", flexShrink: 0 }}
        />
        <p
          className="flex-1 text-sm font-medium leading-snug"
          style={{
            color: "hsl(var(--foreground))",
            textDecoration: task.column_name === "Done" ? "line-through" : "none",
            opacity: task.column_name === "Done" ? 0.65 : 1,
          }}
        >
          {task.title}
        </p>

        {/* Menú de acciones */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            className="p-1 rounded"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <ChevronDown size={13} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 z-20 rounded-xl overflow-hidden"
              style={{
                top: "calc(100% + 4px)",
                minWidth: "160px",
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mover a columna */}
              <div
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: "hsl(var(--muted-foreground))",
                  borderBottom: "1px solid hsl(var(--border))",
                }}
              >
                Mover a
              </div>
              {COLUMNS.filter((c) => c.key !== task.column_name).map((col) => (
                <button
                  key={col.key}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left"
                  style={{ color: "hsl(var(--foreground))" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--muted))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                  onClick={() => { onMove(task.id, col.key); setMenuOpen(false); }}
                >
                  <Circle size={8} style={{ color: COLUMN_STYLES[col.key].header, fill: COLUMN_STYLES[col.key].header }} />
                  {col.emoji} {col.label}
                </button>
              ))}

              {/* Acciones adicionales */}
              <div
                style={{ borderTop: "1px solid hsl(var(--border))" }}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left"
                  style={{ color: "hsl(var(--primary))" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary) / 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                >
                  <Pencil size={13} /> Editar
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left"
                  style={{ color: "hsl(var(--destructive))" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--destructive) / 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                  onClick={() => { onDelete(task); setMenuOpen(false); }}
                >
                  <Trash2 size={13} /> Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Descripción */}
      {task.description && (
        <p
          className="text-xs mb-2 leading-relaxed"
          style={{ color: "hsl(var(--muted-foreground))", paddingLeft: "22px" }}
        >
          {task.description}
        </p>
      )}

      {/* Meta: prioridad + fecha + responsable */}
      <div className="flex flex-wrap items-center gap-1.5" style={{ paddingLeft: "22px" }}>
        {pCfg && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium"
            style={{ background: pCfg.bg, color: pCfg.color }}
          >
            <Flag size={10} />
            {pCfg.label}
          </span>
        )}
        {task.due_date && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
            style={{
              background: overdue ? "hsl(var(--destructive) / 0.12)" : "hsl(var(--muted))",
              color: overdue ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))",
              fontWeight: overdue ? 600 : 400,
            }}
          >
            {overdue ? <AlertTriangle size={10} /> : <Clock size={10} />}
            {formatDate(task.due_date)}
          </span>
        )}
        {task.assigned_to && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
          >
            <User size={10} />
            {task.assigned_to}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL CREAR / EDITAR TAREA
───────────────────────────────────────── */
function TaskModal({
  defaultColumn,
  initialData,
  onClose,
  onSaved,
}: {
  defaultColumn: KanbanColumn;
  initialData: KanbanTask | null;
  onClose: () => void;
  onSaved: (task: KanbanTask) => void;
}) {
  const isEdit = !!initialData;
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [column, setColumn] = useState<KanbanColumn>(initialData?.column_name ?? defaultColumn);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">(
    (initialData?.priority as "low" | "medium" | "high" | "") ?? ""
  );
  const [dueDate, setDueDate] = useState(initialData?.due_date?.slice(0, 10) ?? "");
  const [assignedToId, setAssignedToId] = useState(initialData?.assigned_to_id ?? "");
  const [availableDevs, setAvailableDevs] = useState<{id: string, full_name: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchDevs() {
      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("id, full_name").eq("role", "dev").order("full_name");
      if (data) setAvailableDevs(data);
    }
    fetchDevs();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError("El título es obligatorio."); return; }

    startTransition(async () => {
      const supabase = createClient();
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        column_name: column,
        priority: priority || null,
        due_date: dueDate || null,
        assigned_to: assignedToId || null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = (supabase as any).from("tasks_kanban");
      const { data, error: err } = isEdit
        ? await q.update(payload).eq("id", initialData!.id).select("*, profiles(full_name)").single()
        : await q.insert(payload).select("*, profiles(full_name)").single();

      if (err || !data) { setError(err?.message ?? "Error al guardar."); return; }
      await revalidateAdmin();
      
      const savedTask: KanbanTask = {
        ...data,
        assigned_to_id: data.assigned_to,
        assigned_to: data.profiles?.full_name || null
      };

      onSaved(savedTask);
    });
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 500,
    marginBottom: "6px",
    color: "hsl(var(--foreground))",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card animate-scale-in w-full max-w-lg" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <h3 className="font-display font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>
            {isEdit ? "Editar Tarea" : "Nueva Tarea"}
          </h3>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg" style={{ color: "hsl(var(--muted-foreground))" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
              style={{ background: "hsl(var(--destructive) / 0.1)", border: "1px solid hsl(var(--destructive) / 0.3)", color: "hsl(var(--destructive))" }}
            >
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* Título */}
          <div>
            <label style={labelStyle}>Título <span style={{ color: "hsl(var(--destructive))" }}>*</span></label>
            <input type="text" className="input" placeholder="¿Qué hay que hacer?" value={title}
              onChange={(e) => setTitle(e.target.value)} maxLength={150} required />
          </div>

          {/* Descripción */}
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea className="input" rows={2} placeholder="Detalles opcionales..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "vertical", minHeight: "60px" }} />
          </div>

          {/* Fila: Columna + Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Columna</label>
              <select className="input" value={column} onChange={(e) => setColumn(e.target.value as KanbanColumn)}>
                {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prioridad</label>
              <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                <option value="">Sin prioridad</option>
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>
          </div>

          {/* Fila: Fecha + Responsable */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>
                <Calendar size={12} style={{ display: "inline", marginRight: "4px" }} />
                Fecha límite
              </label>
              <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>
                <User size={12} style={{ display: "inline", marginRight: "4px" }} />
                Responsable (Desarrollador)
              </label>
              <select 
                className="input" 
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
              >
                <option value="">Sin asignar</option>
                {availableDevs.map(dev => (
                  <option key={dev.id} value={dev.id}>
                    {dev.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1" disabled={isPending}>Cancelar</button>
            <button type="submit" className="btn-primary flex-1" disabled={isPending}>
              {isPending
                ? <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                : <><Check size={15} /> {isEdit ? "Guardar Cambios" : "Crear Tarea"}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL ELIMINAR
───────────────────────────────────────── */
function DeleteModal({
  task,
  onClose,
  onDeleted,
}: {
  task: KanbanTask;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (createClient() as any)
        .from("tasks_kanban").delete().eq("id", task.id);
      if (err) { setError(err.message); return; }
      await revalidateAdmin();
      onDeleted(task.id);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card animate-scale-in w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }}>
            <Trash2 size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold" style={{ color: "hsl(var(--foreground))" }}>Eliminar tarea</h3>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Esta acción no se puede deshacer.</p>
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}>
          &ldquo;{task.title}&rdquo;
        </div>
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1" disabled={isPending}>Cancelar</button>
          <button onClick={handleDelete} className="btn-destructive flex-1" disabled={isPending}>
            {isPending ? <><Loader2 size={14} className="animate-spin" /> Eliminando...</> : <><Trash2 size={14} /> Eliminar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COLUMNA KANBAN
───────────────────────────────────────── */
function KanbanColumnCard({
  column,
  tasks,
  onAddTask,
  onMove,
  onEdit,
  onDelete,
  draggingId,
  setDraggingId,
}: {
  column: typeof COLUMNS[number];
  tasks: KanbanTask[];
  onAddTask: (col: KanbanColumn) => void;
  onMove: (id: string, col: KanbanColumn) => void;
  onEdit: (task: KanbanTask) => void;
  onDelete: (task: KanbanTask) => void;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const cfg = COLUMN_STYLES[column.key];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData("taskId");
    if (id) onMove(id, column.key);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "280px",
        flex: "1 1 280px",
        maxWidth: "360px",
        borderRadius: "var(--radius)",
        border: `2px solid ${isDragOver ? cfg.header : cfg.border}`,
        background: isDragOver ? `hsl(var(--muted) / 0.6)` : cfg.bg,
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {/* Header de columna */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${cfg.border}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{column.emoji}</span>
          <h3 className="font-display font-bold text-sm" style={{ color: cfg.header }}>
            {column.label}
          </h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: cfg.badgeBg, color: cfg.badge }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.key)}
          className="p-1.5 rounded-lg transition-all"
          title="Agregar tarea"
          style={{ color: cfg.header }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = cfg.badgeBg;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Tarjetas */}
      <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto" style={{ minHeight: "120px" }}>
        {tasks.length === 0 && !isDragOver && (
          <div
            className="flex-1 flex flex-col items-center justify-center py-8 text-center rounded-xl border-2 border-dashed"
            style={{ borderColor: cfg.border, color: "hsl(var(--muted-foreground))" }}
          >
            <p className="text-xs">Arrastra aquí o</p>
            <button
              onClick={() => onAddTask(column.key)}
              className="text-xs mt-1 underline underline-offset-2"
              style={{ color: cfg.header, background: "transparent", border: "none", cursor: "pointer" }}
            >
              crea una tarea
            </button>
          </div>
        )}
        {isDragOver && tasks.length === 0 && (
          <div
            className="flex-1 rounded-xl border-2 border-dashed"
            style={{ borderColor: cfg.header, minHeight: "80px" }}
          />
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
            isDragging={draggingId === task.id}
            dragHandlers={{
              onDragStart: (e: React.DragEvent) => {
                e.dataTransfer.setData("taskId", task.id);
                setDraggingId(task.id);
              },
              onDragEnd: () => setDraggingId(null),
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE PRINCIPAL: KanbanBoard
───────────────────────────────────────── */
type Props = { initialTasks: KanbanTask[] };

export function KanbanBoard({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [modalColumn, setModalColumn] = useState<KanbanColumn | null>(null);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<KanbanTask | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  /* ── Supabase Realtime ── */
  useEffect(() => {
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel("kanban-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks_kanban" },
        (payload: { eventType: string; new: KanbanTask; old: { id: string } }) => {
          const { eventType, new: newRow, old } = payload;
          if (eventType === "INSERT") {
            setTasks((prev) => {
              if (prev.some((t) => t.id === newRow.id)) return prev;
              return [{...newRow, assigned_to_id: newRow.assigned_to, assigned_to: null}, ...prev]; // Missing join on realtime logic for now, handled via onSaved mostly
            });
          } else if (eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) => (t.id === newRow.id ? {...t, ...newRow, assigned_to_id: newRow.assigned_to, assigned_to: t.assigned_to} : t))
            );
          } else if (eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== old.id));
          }
        }
      )
      .subscribe((status: string) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  /* ── Mover tarea (DnD o menú) ── */
  const handleMove = useCallback(
    async (id: string, col: KanbanColumn) => {
      const task = tasks.find((t) => t.id === id);
      if (!task || task.column_name === col) return;

      // Actualización optimista
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, column_name: col } : t))
      );
      setMovingId(id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (createClient() as any)
        .from("tasks_kanban")
        .update({ column_name: col })
        .eq("id", id);

      setMovingId(null);

      // Revertir si hubo error
      if (error) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, column_name: task.column_name } : t))
        );
      } else {
        await revalidateAdmin();
      }
    },
    [tasks]
  );

  /* ── Guardar nueva / editada ── */
  const handleSaved = useCallback((saved: KanbanTask) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModalColumn(null);
    setEditingTask(null);
  }, []);

  /* ── Eliminar ── */
  const handleDeleted = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeletingTask(null);
  }, []);

  /* ── Métricas rápidas ── */
  const total = tasks.length;
  const done  = tasks.filter((t) => t.column_name === "Done").length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const overdue = tasks.filter(
    (t) => t.column_name !== "Done" && isOverdue(t.due_date)
  ).length;

  return (
    <>
      {/* Modals */}
      {(modalColumn || editingTask) && (
        <TaskModal
          defaultColumn={modalColumn ?? editingTask!.column_name}
          initialData={editingTask}
          onClose={() => { setModalColumn(null); setEditingTask(null); }}
          onSaved={handleSaved}
        />
      )}
      {deletingTask && (
        <DeleteModal
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="space-y-4">
        {/* ── Barra de métricas ── */}
        <div
          className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {/* Progreso */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none"
                  stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none"
                  stroke="hsl(var(--success))" strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeLinecap="round" />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: "hsl(var(--success))" }}
              >
                {pct}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {done} / {total} completadas
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                Progreso general del tablero
              </p>
            </div>
          </div>

          {/* Tareas vencidas */}
          {overdue > 0 && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "hsl(var(--destructive) / 0.12)",
                color: "hsl(var(--destructive))",
                border: "1px solid hsl(var(--destructive) / 0.3)",
              }}
            >
              <AlertTriangle size={12} />
              {overdue} tarea{overdue > 1 ? "s" : ""} vencida{overdue > 1 ? "s" : ""}
            </span>
          )}

          {/* Indicador Realtime */}
          <span
            className="ml-auto inline-flex items-center gap-1.5 text-xs"
            style={{ color: isConnected ? "hsl(var(--success))" : "hsl(var(--muted-foreground))" }}
          >
            {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isConnected ? "Tiempo real" : "Desconectado"}
          </span>

          {/* Spinner si hay movimiento pendiente */}
          {movingId && (
            <Loader2 size={16} className="animate-spin" style={{ color: "hsl(var(--primary))" }} />
          )}
        </div>

        {/* ── Tablero ── */}
        <div
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ alignItems: "flex-start" }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumnCard
              key={col.key}
              column={col}
              tasks={tasks.filter((t) => t.column_name === col.key)}
              onAddTask={(c) => { setEditingTask(null); setModalColumn(c); }}
              onMove={handleMove}
              onEdit={(t) => { setModalColumn(null); setEditingTask(t); }}
              onDelete={setDeletingTask}
              draggingId={draggingId}
              setDraggingId={setDraggingId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
