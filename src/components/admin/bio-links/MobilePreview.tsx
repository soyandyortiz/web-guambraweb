"use client";

import type { BioBlock, BioProfile } from "@/app/actions/bio-links";

const BG: Record<string, string> = {
  minimal: "#ffffff",
  dark: "#000000",
  gradient: "linear-gradient(135deg, #7c3aed, #2563eb)",
};

const TEXT: Record<string, string> = {
  minimal: "#0f172a",
  dark: "#f8fafc",
  gradient: "#ffffff",
};

const SUB: Record<string, string> = {
  minimal: "#64748b",
  dark: "#94a3b8",
  gradient: "rgba(255,255,255,0.75)",
};

function BlockPreview({ block, template }: { block: BioBlock; template: string }) {
  const fg = TEXT[template] ?? "#0f172a";

  if (block.type === "divider") {
    return (
      <div className="flex items-center gap-2 py-1 w-full">
        <div className="flex-1 h-px" style={{ background: `${fg}22` }} />
        {block.title && <span style={{ color: `${fg}88`, fontSize: 9 }}>{block.title}</span>}
        <div className="flex-1 h-px" style={{ background: `${fg}22` }} />
      </div>
    );
  }

  if (block.type === "text") {
    // Strip HTML tags for the tiny preview
    const plainText = block.content?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "";
    return (
      <div className="w-full px-1">
        {block.title && (
          <p style={{ color: fg, fontSize: 9, fontWeight: 700, marginBottom: 2 }}>{block.title}</p>
        )}
        {plainText && (
          <p style={{ color: `${fg}bb`, fontSize: 8, lineHeight: 1.4 }} className="line-clamp-2">
            {plainText}
          </p>
        )}
      </div>
    );
  }

  if (block.type === "video") {
    return (
      <div className="w-full rounded-lg overflow-hidden" style={{ background: "#1e293b", height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 16 }}>▶</span>
        <span style={{ color: "#94a3b8", fontSize: 8, marginLeft: 4 }}>Video</span>
      </div>
    );
  }

  if (block.type === "card") {
    return (
      <div className="w-full rounded-lg overflow-hidden" style={{ background: template === "minimal" ? "#f8fafc" : "rgba(255,255,255,0.1)", border: `1px solid ${fg}22` }}>
        {block.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.image_url} alt="" className="w-full object-cover" style={{ height: 30 }} />
        )}
        <div style={{ padding: "4px 6px" }}>
          {block.title && <p style={{ color: fg, fontSize: 8, fontWeight: 600 }}>{block.title}</p>}
          {block.subtitle && <p style={{ color: `${fg}99`, fontSize: 7 }}>{block.subtitle}</p>}
        </div>
      </div>
    );
  }

  // button (default)
  const bg = block.bg_color ?? "#4361ee";
  const bfg = block.text_color ?? "#ffffff";
  const hasCollapsible = !!block.content?.replace(/<[^>]*>/g, "").trim();
  return (
    <div
      className="w-full rounded-lg flex items-center gap-2"
      style={{ background: bg, color: bfg, padding: "5px 8px" }}
    >
      <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
      <span style={{ fontSize: 8, fontWeight: 600, flex: 1 }} className="truncate">
        {block.title ?? "Enlace"}
      </span>
      {hasCollapsible
        ? <span style={{ fontSize: 8, opacity: 0.8 }}>⌄</span>
        : <span style={{ fontSize: 7, opacity: 0.7 }}>›</span>
      }
    </div>
  );
}

interface Props {
  profile: Partial<BioProfile>;
  blocks: BioBlock[];
  template: string;
}

export function MobilePreview({ profile, blocks, template }: Props) {
  const bg = BG[template] ?? "#ffffff";
  const fg = TEXT[template] ?? "#0f172a";
  const sub = SUB[template] ?? "#64748b";
  const isGradient = template === "gradient";

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
        Vista previa
      </p>
      {/* Phone frame */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{
          width: 200,
          height: 400,
          background: "#1a1a1a",
          padding: "12px 6px 16px",
          boxShadow: "0 0 0 2px #333, 0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full" style={{ background: "#1a1a1a", zIndex: 10 }} />

        {/* Screen */}
        <div
          className="w-full h-full rounded-[2rem] overflow-auto"
          style={{
            background: isGradient ? undefined : bg,
            backgroundImage: isGradient ? bg : undefined,
          }}
        >
          <div className="flex flex-col items-center px-3 py-5 gap-2">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4361ee, #7209b7)" }}
            >
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-2xl object-cover" />
              ) : (
                <span style={{ fontSize: 18, color: "#fff" }}>G</span>
              )}
            </div>
            {/* Name */}
            <div className="text-center">
              <p style={{ color: fg, fontSize: 10, fontWeight: 700 }}>{profile.name ?? "GuambraWeb"}</p>
              {profile.tagline && (
                <p style={{ color: sub, fontSize: 7, marginTop: 2 }} className="line-clamp-2 text-center">
                  {profile.tagline}
                </p>
              )}
            </div>

            {/* Social icons preview */}
            {(() => {
              const hasSocial = [
                (profile as {social_facebook?: string|null}).social_facebook,
                (profile as {social_instagram?: string|null}).social_instagram,
                (profile as {social_tiktok?: string|null}).social_tiktok,
                (profile as {social_x?: string|null}).social_x,
                (profile as {social_youtube?: string|null}).social_youtube,
                (profile as {social_website?: string|null}).social_website,
              ].some(Boolean);
              if (!hasSocial) return null;
              const isDark = template === "dark" || template === "gradient";
              return (
                <div className="flex items-center justify-center gap-1 flex-wrap mt-1">
                  {[
                    "social_facebook","social_instagram","social_tiktok",
                    "social_x","social_youtube","social_website",
                  ].filter(k => (profile as Record<string,unknown>)[k]).map(k => (
                    <div
                      key={k}
                      style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
                      }}
                    />
                  ))}
                </div>
              );
            })()}

            {/* Blocks — cards in 2-col grid */}
            <div className="w-full mt-1">
              {(() => {
                const active = blocks.filter(b => b.is_active);
                if (active.length === 0) {
                  return <p style={{ color: sub, fontSize: 8, textAlign: "center" }}>Sin bloques activos</p>;
                }
                // group consecutive cards
                type G = { kind: "cards"; items: BioBlock[] } | { kind: "single"; item: BioBlock };
                const groups: G[] = [];
                for (const b of active) {
                  if (b.type === "card") {
                    const last = groups[groups.length - 1];
                    if (last?.kind === "cards") { last.items.push(b); }
                    else groups.push({ kind: "cards", items: [b] });
                  } else {
                    groups.push({ kind: "single", item: b });
                  }
                }
                return groups.map((g, i) => {
                  if (g.kind === "cards") {
                    const single = g.items.length === 1;
                    return (
                      <div
                        key={i}
                        style={{
                          display: single ? "flex" : "grid",
                          gridTemplateColumns: single ? undefined : "1fr 1fr",
                          gap: 3,
                          marginBottom: 3,
                        }}
                      >
                        {g.items.map(b => (
                          <BlockPreview key={b.id} block={b} template={template} />
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div key={i} style={{ marginBottom: 3 }}>
                      <BlockPreview block={g.item} template={template} />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>
        bio.guambraweb.com
      </p>
    </div>
  );
}
