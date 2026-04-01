"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, User, Loader2, Facebook, Instagram, Youtube, Globe, Twitter } from "lucide-react";
import type { BioProfile } from "@/app/actions/bio-links";
import { updateBioProfile } from "@/app/actions/bio-links";

interface Props {
  profile: Partial<BioProfile>;
  onChange: (p: Partial<BioProfile>) => void;
}

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.8a4.85 4.85 0 0 1-1.07-.11Z" />
    </svg>
  );
}

const SOCIAL_FIELDS: {
  key: keyof BioProfile;
  label: string;
  placeholder: string;
  Icon: React.ElementType;
}[] = [
  { key: "social_instagram", label: "Instagram",    placeholder: "https://instagram.com/tuusuario", Icon: Instagram },
  { key: "social_facebook",  label: "Facebook",     placeholder: "https://facebook.com/tupagina",  Icon: Facebook },
  { key: "social_tiktok",    label: "TikTok",       placeholder: "https://tiktok.com/@tuusuario",  Icon: TikTokIcon },
  { key: "social_x",         label: "X (Twitter)",  placeholder: "https://x.com/tuusuario",        Icon: Twitter },
  { key: "social_youtube",   label: "YouTube",      placeholder: "https://youtube.com/@tucanal",   Icon: Youtube },
  { key: "social_website",   label: "Sitio Web",    placeholder: "https://tudominio.com",          Icon: Globe },
];

export function ProfileEditor({ profile, onChange }: Props) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-bio-image", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onChange({ ...profile, avatar_url: json.url });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Error al subir imagen" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const res = await updateBioProfile({
      name: profile.name ?? "GuambraWeb",
      tagline: profile.tagline ?? "",
      description: profile.description ?? "",
      avatar_url: profile.avatar_url ?? undefined,
      template: profile.template ?? "minimal",
      cover_color: profile.cover_color ?? "#4361ee",
      social_facebook:  profile.social_facebook  ?? null,
      social_instagram: profile.social_instagram ?? null,
      social_tiktok:    profile.social_tiktok    ?? null,
      social_x:         profile.social_x         ?? null,
      social_youtube:   profile.social_youtube   ?? null,
      social_website:   profile.social_website   ?? null,
    });
    setSaving(false);
    setMsg(res.success ? { type: "ok", text: "Perfil guardado" } : { type: "err", text: res.message ?? "Error" });
    setTimeout(() => setMsg(null), 3000);
  }

  const inputCls = "w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 transition-all";
  const inputStyle = {
    background: "hsl(var(--muted))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--foreground))",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer relative group"
          style={{ background: "hsl(var(--muted))", border: "2px dashed hsl(var(--border))" }}
          onClick={() => fileRef.current?.click()}
        >
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
          ) : (
            <User size={28} style={{ color: "hsl(var(--muted-foreground))" }} />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
            {uploading ? <Loader2 size={18} className="animate-spin text-white" /> : <Upload size={18} className="text-white" />}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
            Foto de perfil
          </p>
          <p className="text-xs mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
            JPG, PNG o WebP · Máx. 5MB
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "hsl(var(--primary))", color: "#fff" }}
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            {uploading ? "Subiendo…" : "Cambiar foto"}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleImageUpload} />
        </div>
      </div>

      {/* Basic info */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Nombre
          </label>
          <input
            className={inputCls}
            style={inputStyle}
            value={profile.name ?? ""}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            placeholder="GuambraWeb"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Tagline (subtítulo corto)
          </label>
          <input
            className={inputCls}
            style={inputStyle}
            value={profile.tagline ?? ""}
            onChange={(e) => onChange({ ...profile, tagline: e.target.value })}
            placeholder="Agencia de Desarrollo Web en Ecuador"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Descripción (opcional)
          </label>
          <textarea
            className={`${inputCls} resize-none`}
            style={inputStyle}
            rows={3}
            value={profile.description ?? ""}
            onChange={(e) => onChange({ ...profile, description: e.target.value })}
            placeholder="Breve descripción de lo que haces…"
          />
        </div>
      </div>

      {/* Social links */}
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
          Redes sociales
        </p>
        <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
          Se activan automáticamente en la página pública si tienen un enlace.
        </p>
        <div className="flex flex-col gap-2">
          {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => {
            const val = (profile[key] as string | null | undefined) ?? "";
            const active = !!val;
            return (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    background: active ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted))",
                    color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                  title={label}
                >
                  <Icon size={14} />
                </div>
                <input
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: active ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))" }}
                  value={val}
                  onChange={(e) => onChange({ ...profile, [key]: e.target.value || null })}
                  placeholder={placeholder}
                  type="url"
                />
              </div>
            );
          })}
        </div>
      </div>

      {msg && (
        <p
          className="text-xs px-3 py-2 rounded-lg"
          style={{
            background: msg.type === "ok" ? "hsl(var(--primary)/0.1)" : "hsl(0 84% 60% / 0.1)",
            color: msg.type === "ok" ? "hsl(var(--primary))" : "hsl(0 84% 60%)",
          }}
        >
          {msg.text}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "hsl(var(--primary))", color: "#fff" }}
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saving ? "Guardando…" : "Guardar perfil"}
      </button>
    </div>
  );
}
