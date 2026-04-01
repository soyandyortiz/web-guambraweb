export const dynamic = "force-dynamic";

import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ParticlesWrapper } from "@/components/bio/ParticlesWrapper";
import { BioBlockRenderer } from "@/components/bio/BioBlockRenderer";
import { SocialIconsRow } from "@/components/bio/SocialIconsRow";
import { VisitTracker } from "@/components/bio/VisitTracker";
import { GuambraIcon } from "@/components/ui/GuambraLogo";

async function getData() {
  const supabase = await createClient();

  const [profileRes, blocksRes] = await Promise.all([
    supabase.from("bio_profile").select("*").eq("id", 1).single(),
    supabase.from("bio_blocks").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
  ]);

  return {
    profile: profileRes.data ?? {
      name: "GuambraWeb",
      tagline: "Agencia de Desarrollo Web & Sistemas en Ecuador",
      description: null,
      avatar_url: null,
      template: "minimal",
      cover_color: "#4361ee",
      social_facebook: null,
      social_instagram: null,
      social_tiktok: null,
      social_x: null,
      social_youtube: null,
      social_website: null,
    },
    blocks: blocksRes.data ?? [],
  };
}


// Group consecutive card blocks so we can render them in a 2-col grid
type BlockGroup =
  | { kind: "cards"; items: typeof Array.prototype }
  | { kind: "single"; item: (typeof Array.prototype)[0] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupBlocks(blocks: any[]): BlockGroup[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groups: BlockGroup[] = [];
  for (const block of blocks) {
    if (block.type === "card") {
      const last = groups[groups.length - 1];
      if (last?.kind === "cards") {
        (last.items as typeof blocks).push(block);
      } else {
        groups.push({ kind: "cards", items: [block] });
      }
    } else {
      groups.push({ kind: "single", item: block });
    }
  }
  return groups;
}

export default async function BioLinksPage() {
  const { profile, blocks } = await getData();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;
  const template = p.template ?? "minimal";
  const accentColor = p.cover_color ?? "#4361ee";

  const bgStyle: React.CSSProperties =
    template === "dark"
      ? { background: "#000000" }
      : template === "gradient"
        ? { background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" }
        : { background: "#ffffff" };

  const textColor = template === "minimal" ? "#0f172a" : "#f8fafc";
  const subColor  = template === "minimal" ? "#64748b" : "rgba(248,250,252,0.75)";

  const groups = groupBlocks(blocks);

  const socialLinks = {
    facebook:  p.social_facebook  ?? null,
    instagram: p.social_instagram ?? null,
    tiktok:    p.social_tiktok    ?? null,
    x:         p.social_x         ?? null,
    youtube:   p.social_youtube   ?? null,
    website:   p.social_website   ?? null,
  };
  const hasSocial = Object.values(socialLinks).some(Boolean);

  return (
    <div className="min-h-screen relative" style={{ ...bgStyle, fontFamily: "var(--font-sans, Inter, sans-serif)" }}>
      <VisitTracker />
      {template === "dark" && <ParticlesWrapper />}

      <div className="relative z-10 max-w-xl mx-auto px-5 py-12 pb-20">
        {/* ── PERFIL ───────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #7209b7)` }}
          >
            {p.avatar_url ? (
              <Image
                src={p.avatar_url}
                alt={profile.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            ) : (
              <GuambraIcon className="h-12 w-auto" />
            )}
          </div>

          <h1
            className="text-2xl font-bold mb-2 tracking-tight"
            style={{ color: textColor, fontFamily: "var(--font-display, Outfit, sans-serif)" }}
          >
            {profile.name}
          </h1>
          {profile.tagline && (
            <p className="text-sm max-w-xs" style={{ color: subColor }}>
              {profile.tagline}
            </p>
          )}
          {p.description && (
            <p className="text-xs mt-2 max-w-xs leading-relaxed" style={{ color: subColor }}>
              {p.description}
            </p>
          )}

          {/* ── REDES SOCIALES ───────────────────────────── */}
          {hasSocial && (
            <div className="mt-5">
              <SocialIconsRow links={socialLinks} template={template} />
            </div>
          )}
        </div>

        {/* ── BLOQUES ──────────────────────────────────────── */}
        {groups.length > 0 && (
          <div className="flex flex-col gap-3">
            {groups.map((group, gi) => {
              if (group.kind === "cards") {
                const items = group.items as typeof blocks;
                const isSingle = items.length === 1;
                return (
                  <div
                    key={`group-${gi}`}
                    className={isSingle ? "flex flex-col gap-3" : "grid grid-cols-2 gap-3"}
                  >
                    {items.map((block) => (
                      <BioBlockRenderer
                        key={block.id}
                        block={block}
                        template={template}
                        textColor={textColor}
                        subColor={subColor}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <BioBlockRenderer
                  key={group.item.id}
                  block={group.item}
                  template={template}
                  textColor={textColor}
                  subColor={subColor}
                />
              );
            })}
          </div>
        )}

        {/* ── FOOTER ────────────────────────────────────────── */}
        <div className="mt-14 text-center">
          <a
            href="https://guambraweb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: subColor }}
          >
            Hecho con ❤️ por GuambraWeb
          </a>
        </div>
      </div>
    </div>
  );
}
