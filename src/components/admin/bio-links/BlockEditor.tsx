"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X, Upload, Loader2, Globe, Instagram, Facebook, Linkedin,
  Youtube, Mail, Phone, Github, ShoppingCart, MessageCircle,
  Music2, Video, Twitter, ExternalLink,
} from "lucide-react";
import type { BioBlock, BioBlockType } from "@/app/actions/bio-links";

const ICONS = [
  "Globe", "Instagram", "Facebook", "Linkedin", "Youtube", "Mail",
  "Phone", "Github", "ShoppingCart", "MessageCircle", "Music2",
  "Video", "Twitter", "ExternalLink",
] as const;

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Instagram, Facebook, Linkedin, Youtube, Mail, Phone,
  Github, ShoppingCart, MessageCircle, Music2, Video, Twitter, ExternalLink,
};

const BLOCK_TYPES: { id: BioBlockType; label: string; desc: string }[] = [
  { id: "button", label: "Botón", desc: "Enlace con ícono y color" },
  { id: "card", label: "Card", desc: "Imagen + título + descripción" },
  { id: "text", label: "Texto", desc: "Párrafo o encabezado" },
  { id: "video", label: "Video", desc: "Embed de YouTube / Vimeo" },
  { id: "divider", label: "Divisor", desc: "Separador visual" },
];

interface Props {
  block?: Partial<BioBlock>;
  onSave: (data: Partial<BioBlock>) => Promise<void>;
  onClose: () => void;
}

const DEFAULT: Partial<BioBlock> = {
  type: "button",
  title: "",
  subtitle: "",
  content: "",
  url: "",
  image_url: "",
  icon_name: "Globe",
  bg_color: "#4361ee",
  text_color: "#ffffff",
  is_active: true,
};

/* ── Rich Text Editor ──────────────────────────────────────────────── */

function isHtmlEmpty(html: string | null | undefined) {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").trim() === "";
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 100,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Initialize on mount only (uncontrolled after that)
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value ?? "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val ?? undefined);
    onChange(ref.current?.innerHTML ?? "");
  };

  const handleLink = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    // If selection is inside a link, remove it; otherwise add one
    const anchor = sel.anchorNode?.parentElement?.closest("a");
    if (anchor) {
      exec("unlink");
    } else {
      const url = window.prompt("URL del enlace:");
      if (url) exec("createLink", url);
    }
  };

  const btnCls =
    "w-7 h-6 flex items-center justify-center rounded text-xs font-bold hover:opacity-70 transition-opacity select-none";
  const btnStyle = {
    background: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
  };
  const sep = (
    <div
      style={{
        width: 1,
        height: 14,
        background: "hsl(var(--border))",
        margin: "0 3px",
      }}
    />
  );

  return (
    <div
      style={{
        border: "1px solid hsl(var(--border))",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "4px 8px",
          background: "hsl(var(--muted))",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
          className={btnCls}
          style={btnStyle}
          title="Negrita (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
          className={btnCls}
          style={btnStyle}
          title="Cursiva (Ctrl+I)"
        >
          <em style={{ fontStyle: "italic" }}>I</em>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("underline")}
          className={btnCls}
          style={btnStyle}
          title="Subrayado (Ctrl+U)"
        >
          <u>U</u>
        </button>
        {sep}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("insertUnorderedList")}
          className={btnCls}
          style={{ ...btnStyle, fontSize: 15 }}
          title="Lista de viñetas"
        >
          ≡
        </button>
        {sep}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          className={btnCls}
          style={btnStyle}
          title="Enlace (selecciona texto primero)"
        >
          🔗
        </button>
      </div>

      {/* Content area */}
      <div style={{ position: "relative", background: "hsl(var(--muted))" }}>
        {isHtmlEmpty(value) && placeholder && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "8px 12px",
              pointerEvents: "none",
              color: "hsl(var(--muted-foreground))",
              fontSize: 13,
            }}
          >
            {placeholder}
          </div>
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          style={{
            minHeight,
            padding: "8px 12px",
            outline: "none",
            color: "hsl(var(--foreground))",
            fontSize: 13,
            lineHeight: 1.6,
          }}
          className="bio-rich"
          onInput={() => onChange(ref.current?.innerHTML ?? "")}
        />
      </div>
    </div>
  );
}

/* ── Block Editor ──────────────────────────────────────────────────── */

export function BlockEditor({ block, onSave, onClose }: Props) {
  const [data, setData] = useState<Partial<BioBlock>>(block ?? DEFAULT);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof BioBlock, v: unknown) =>
    setData((d) => ({ ...d, [k]: v }));

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-bio-image", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      set("image_url", json.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.type) return;
    // Validate rich text blocks
    if (data.type === "text" && isHtmlEmpty(data.content)) {
      setError("El contenido es obligatorio");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 transition-all";
  const inputStyle = {
    background: "hsl(var(--muted))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--foreground))",
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label
      className="text-xs font-semibold block mb-1"
      style={{ color: "hsl(var(--muted-foreground))" }}
    >
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
        style={{
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(var(--background))",
          }}
        >
          <h2
            className="text-base font-bold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {block?.id ? "Editar bloque" : "Nuevo bloque"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
          >
            <X size={18} style={{ color: "hsl(var(--muted-foreground))" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          {/* Block type selector */}
          {!block?.id && (
            <div>
              <Label>Tipo de bloque</Label>
              <div className="grid grid-cols-5 gap-2">
                {BLOCK_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set("type", t.id)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      data.type === t.id
                        ? "ring-2 ring-[hsl(var(--primary))]"
                        : "opacity-60 hover:opacity-90"
                    }`}
                    style={{ background: "hsl(var(--muted))" }}
                    title={t.desc}
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {t.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── BUTTON ─────────────────────────────────────────── */}
          {data.type === "button" && (
            <>
              <div>
                <Label>Título *</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  required
                  value={data.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="WhatsApp"
                />
              </div>
              <div>
                <Label>URL *</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  required
                  type="url"
                  value={data.url ?? ""}
                  onChange={(e) => set("url", e.target.value)}
                  placeholder="https://wa.me/..."
                />
              </div>
              <div>
                <Label>Contenido desplegable (opcional)</Label>
                <p
                  className="text-xs mb-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Si agregas texto aparecerá una flecha para expandir el botón.
                </p>
                <RichTextEditor
                  value={data.content ?? ""}
                  onChange={(html) => set("content", html)}
                  placeholder="Información adicional que se verá al expandir…"
                  minHeight={80}
                />
              </div>
              <div>
                <Label>Ícono</Label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((name) => {
                    const Icon = ICON_MAP[name];
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => set("icon_name", name)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          data.icon_name === name
                            ? "ring-2 ring-[hsl(var(--primary))]"
                            : "opacity-50 hover:opacity-80"
                        }`}
                        style={{ background: "hsl(var(--muted))" }}
                      >
                        <Icon
                          size={14}
                          style={{ color: "hsl(var(--foreground))" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Color de fondo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.bg_color ?? "#4361ee"}
                      onChange={(e) => set("bg_color", e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      className={`${inputCls} flex-1`}
                      style={inputStyle}
                      value={data.bg_color ?? "#4361ee"}
                      onChange={(e) => set("bg_color", e.target.value)}
                      placeholder="#4361ee"
                    />
                  </div>
                </div>
                <div>
                  <Label>Color de texto</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.text_color ?? "#ffffff"}
                      onChange={(e) => set("text_color", e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      className={`${inputCls} flex-1`}
                      style={inputStyle}
                      value={data.text_color ?? "#ffffff"}
                      onChange={(e) => set("text_color", e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── CARD ────────────────────────────────────────────── */}
          {data.type === "card" && (
            <>
              <div>
                <Label>Título *</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  required
                  value={data.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="MisTrajes"
                />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={data.subtitle ?? ""}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="Software de alquiler"
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <textarea
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                  rows={2}
                  value={data.content ?? ""}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Descripción breve del proyecto…"
                />
              </div>
              <div>
                <Label>URL (opcional)</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  type="url"
                  value={data.url ?? ""}
                  onChange={(e) => set("url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Imagen</Label>
                <div className="flex items-center gap-3">
                  {data.image_url && (
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={data.image_url} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{
                      background: "hsl(var(--muted))",
                      color: "hsl(var(--foreground))",
                    }}
                  >
                    {uploading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Upload size={12} />
                    )}
                    {uploading ? "Subiendo…" : "Subir imagen"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </>
          )}

          {/* ── TEXT ─────────────────────────────────────────────── */}
          {data.type === "text" && (
            <>
              <div>
                <Label>Encabezado (opcional)</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={data.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Nuestros servicios"
                />
              </div>
              <div>
                <Label>Contenido *</Label>
                <RichTextEditor
                  value={data.content ?? ""}
                  onChange={(html) => set("content", html)}
                  placeholder="Escribe aquí el texto que quieres mostrar…"
                  minHeight={100}
                />
              </div>
            </>
          )}

          {/* ── VIDEO ─────────────────────────────────────────────── */}
          {data.type === "video" && (
            <>
              <div>
                <Label>Título (opcional)</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={data.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Nuestro demo"
                />
              </div>
              <div>
                <Label>URL del video *</Label>
                <input
                  className={inputCls}
                  style={inputStyle}
                  required
                  type="url"
                  value={data.content ?? ""}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Compatible con YouTube y Vimeo
                </p>
              </div>
            </>
          )}

          {/* ── DIVIDER ───────────────────────────────────────────── */}
          {data.type === "divider" && (
            <div>
              <Label>Etiqueta (opcional)</Label>
              <input
                className={inputCls}
                style={inputStyle}
                value={data.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Mis proyectos"
              />
            </div>
          )}

          {/* Active toggle */}
          <div
            className="flex items-center justify-between py-2 border-t"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Activo
              </p>
              <p
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Visible en la página pública
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("is_active", !data.is_active)}
              className={`w-11 h-6 rounded-full transition-all flex items-center ${
                data.is_active
                  ? "justify-end bg-[hsl(var(--primary))]"
                  : "justify-start bg-[hsl(var(--muted))]"
              } px-0.5`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm block transition-all" />
            </button>
          </div>

          {error && (
            <p
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                background: "hsl(0 84% 60% / 0.1)",
                color: "hsl(0 84% 60%)",
              }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                background: "hsl(var(--muted))",
                color: "hsl(var(--foreground))",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "hsl(var(--primary))", color: "#fff" }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Guardando…" : block?.id ? "Actualizar" : "Crear bloque"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
