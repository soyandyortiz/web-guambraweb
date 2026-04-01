"use client";

import { useState } from "react";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  LayoutGrid, User, Palette, BarChart2, GripVertical,
  Loader2, Eye, EyeOff,
} from "lucide-react";
import type { BioBlock, BioProfile } from "@/app/actions/bio-links";
import {
  createBioBlock, updateBioBlock, deleteBioBlock,
  reorderBioBlocks, updateBioProfile,
} from "@/app/actions/bio-links";
import { BlockEditor } from "./BlockEditor";
import { TemplatePicker, type BioTemplate } from "./TemplatePicker";
import { ProfileEditor } from "./ProfileEditor";
import { MobilePreview } from "./MobilePreview";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

type Tab = "blocks" | "profile" | "design" | "stats";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "blocks", label: "Bloques", Icon: LayoutGrid },
  { id: "profile", label: "Perfil", Icon: User },
  { id: "design", label: "Diseño", Icon: Palette },
  { id: "stats", label: "Estadísticas", Icon: BarChart2 },
];

const TYPE_LABELS: Record<string, string> = {
  button: "Botón",
  card: "Card",
  text: "Texto",
  video: "Video",
  divider: "Divisor",
};

interface Props {
  initialProfile: Partial<BioProfile>;
  initialBlocks: BioBlock[];
  totalVisits: number;
  analyticsBlocks: { id: string; title: string | null; type: string; clicks: number }[];
}

export function BioLinksManager({ initialProfile, initialBlocks, totalVisits, analyticsBlocks }: Props) {
  const [tab, setTab] = useState<Tab>("blocks");
  const [profile, setProfile] = useState<Partial<BioProfile>>(initialProfile);
  const [blocks, setBlocks] = useState<BioBlock[]>(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<Partial<BioBlock> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingDesign, setSavingDesign] = useState(false);
  const [designMsg, setDesignMsg] = useState<string | null>(null);

  async function handleSaveBlock(data: Partial<BioBlock>) {
    if (editingBlock?.id) {
      const res = await updateBioBlock(editingBlock.id, data);
      if (res.success) {
        setBlocks((prev) => prev.map((b) => (b.id === editingBlock.id ? { ...b, ...data } : b)));
      }
    } else {
      const nextOrder = blocks.length > 0 ? Math.max(...blocks.map((b) => b.sort_order)) + 1 : 0;
      const res = await createBioBlock({ ...data, sort_order: nextOrder } as Omit<BioBlock, "id" | "clicks" | "created_at">);
      if (res.success) window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este bloque?")) return;
    setDeletingId(id);
    const res = await deleteBioBlock(id);
    if (res.success) setBlocks((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  }

  async function handleToggle(block: BioBlock) {
    setTogglingId(block.id);
    const res = await updateBioBlock(block.id, { is_active: !block.is_active });
    if (res.success) {
      setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, is_active: !b.is_active } : b)));
    }
    setTogglingId(null);
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setBlocks(next);
    await reorderBioBlocks(next.map((b) => b.id));
  }

  async function handleMoveDown(index: number) {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setBlocks(next);
    await reorderBioBlocks(next.map((b) => b.id));
  }

  async function handleSaveDesign() {
    setSavingDesign(true);
    setDesignMsg(null);
    const res = await updateBioProfile({
      name: profile.name ?? "GuambraWeb",
      tagline: profile.tagline ?? "",
      description: profile.description ?? "",
      avatar_url: profile.avatar_url ?? undefined,
      template: profile.template ?? "minimal",
      cover_color: profile.cover_color ?? "#4361ee",
    });
    setSavingDesign(false);
    setDesignMsg(res.success ? "✓ Diseño guardado" : (res.message ?? "Error"));
    setTimeout(() => setDesignMsg(null), 3000);
  }

  const cardBase = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "1rem",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={
              tab === id
                ? { background: "hsl(var(--background))", color: "hsl(var(--foreground))", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                : { color: "hsl(var(--muted-foreground))" }
            }
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content + Preview */}
      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">

          {/* ── BLOQUES ─────────────────────────────────────── */}
          {tab === "blocks" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {blocks.length} bloque{blocks.length !== 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => { setEditingBlock({}); setIsCreating(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "hsl(var(--primary))", color: "#fff" }}
                >
                  <Plus size={15} /> Nuevo bloque
                </button>
              </div>

              {blocks.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 rounded-2xl text-center"
                  style={{ background: "hsl(var(--muted) / 0.5)", border: "2px dashed hsl(var(--border))" }}
                >
                  <LayoutGrid size={32} style={{ color: "hsl(var(--muted-foreground))" }} className="mb-3" />
                  <p className="text-sm font-medium mb-1" style={{ color: "hsl(var(--foreground))" }}>Sin bloques aún</p>
                  <p className="text-xs mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Agrega botones, cards, texto o videos
                  </p>
                  <button
                    type="button"
                    onClick={() => { setEditingBlock({}); setIsCreating(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: "hsl(var(--primary))", color: "#fff" }}
                  >
                    <Plus size={14} /> Agregar bloque
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {blocks.map((block, i) => (
                    <div
                      key={block.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ ...cardBase, opacity: block.is_active ? 1 : 0.55 }}
                    >
                      <GripVertical size={14} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                      >
                        {TYPE_LABELS[block.type] ?? block.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>
                          {block.title ?? "(sin título)"}
                        </p>
                        {block.url && (
                          <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                            {block.url}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {block.clicks} clics
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button type="button" onClick={() => handleMoveUp(i)} disabled={i === 0} className="p-1.5 rounded-lg hover:opacity-70 disabled:opacity-20">
                          <ChevronUp size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
                        </button>
                        <button type="button" onClick={() => handleMoveDown(i)} disabled={i === blocks.length - 1} className="p-1.5 rounded-lg hover:opacity-70 disabled:opacity-20">
                          <ChevronDown size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
                        </button>
                        <button type="button" onClick={() => handleToggle(block)} disabled={togglingId === block.id} className="p-1.5 rounded-lg hover:opacity-70 disabled:opacity-50">
                          {togglingId === block.id
                            ? <Loader2 size={13} className="animate-spin" style={{ color: "hsl(var(--muted-foreground))" }} />
                            : block.is_active
                              ? <Eye size={13} style={{ color: "hsl(var(--primary))" }} />
                              : <EyeOff size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
                          }
                        </button>
                        <button type="button" onClick={() => { setEditingBlock(block); setIsCreating(false); }} className="p-1.5 rounded-lg hover:opacity-70">
                          <Pencil size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
                        </button>
                        <button type="button" onClick={() => handleDelete(block.id)} disabled={deletingId === block.id} className="p-1.5 rounded-lg hover:opacity-70 disabled:opacity-50">
                          {deletingId === block.id
                            ? <Loader2 size={13} className="animate-spin" style={{ color: "hsl(0 84% 60%)" }} />
                            : <Trash2 size={13} style={{ color: "hsl(0 84% 60%)" }} />
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PERFIL ─────────────────────────────────────── */}
          {tab === "profile" && (
            <ProfileEditor profile={profile} onChange={setProfile} />
          )}

          {/* ── DISEÑO ─────────────────────────────────────── */}
          {tab === "design" && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: "hsl(var(--foreground))" }}>Template</p>
                <TemplatePicker
                  value={(profile.template as BioTemplate) ?? "minimal"}
                  onChange={(t) => setProfile((p) => ({ ...p, template: t }))}
                />
              </div>
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>Color de acento</p>
                <div className="flex items-center gap-3">
                  <input type="color" value={profile.cover_color ?? "#4361ee"} onChange={(e) => setProfile((p) => ({ ...p, cover_color: e.target.value }))} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" />
                  <input
                    className="flex-1 px-3 py-2 rounded-xl text-sm border outline-none"
                    style={{ background: "hsl(var(--muted))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                    value={profile.cover_color ?? "#4361ee"}
                    onChange={(e) => setProfile((p) => ({ ...p, cover_color: e.target.value }))}
                  />
                </div>
              </div>
              {designMsg && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  {designMsg}
                </p>
              )}
              <button
                type="button"
                onClick={handleSaveDesign}
                disabled={savingDesign}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "hsl(var(--primary))", color: "#fff" }}
              >
                {savingDesign && <Loader2 size={14} className="animate-spin" />}
                {savingDesign ? "Guardando…" : "Guardar diseño"}
              </button>
            </div>
          )}

          {/* ── ESTADÍSTICAS ───────────────────────────────── */}
          {tab === "stats" && (
            <AnalyticsDashboard totalVisits={totalVisits} blocks={analyticsBlocks} />
          )}
        </div>

        {/* Preview sidebar */}
        <div className="hidden lg:block sticky top-6 flex-shrink-0">
          <MobilePreview profile={profile} blocks={blocks} template={profile.template ?? "minimal"} />
        </div>
      </div>

      {/* Block editor modal */}
      {editingBlock !== null && (
        <BlockEditor
          block={isCreating ? undefined : editingBlock}
          onSave={handleSaveBlock}
          onClose={() => { setEditingBlock(null); setIsCreating(false); }}
        />
      )}
    </div>
  );
}
