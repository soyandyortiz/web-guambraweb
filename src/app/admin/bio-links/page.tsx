export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BioLinksManager } from "@/components/admin/bio-links/BioLinksManager";
import { getBioAnalytics, type BioBlock } from "@/app/actions/bio-links";
import { Link2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Bio Links — GuambraWeb",
  description: "Gestiona los links y portafolio de tu página bio.",
};

export default async function BioLinksPage() {
  const supabase = await createClient();

  const [profileRes, blocksRes, analytics] = await Promise.all([
    supabase.from("bio_profile").select("*").eq("id", 1).single(),
    supabase.from("bio_blocks").select("*").order("sort_order", { ascending: true }),
    getBioAnalytics(),
  ]);

  const profile = profileRes.data ?? {
    name: "GuambraWeb",
    tagline: "Agencia de Desarrollo Web & Sistemas en Ecuador",
    description: "",
    avatar_url: null,
    template: "minimal",
    cover_color: "#4361ee",
  };

  const blocks = (blocksRes.data ?? []) as BioBlock[];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "hsl(var(--primary) / 0.1)" }}
        >
          <Link2 size={20} style={{ color: "hsl(var(--primary))" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            Bio Links
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            bio.guambraweb.com — Gestiona tu página de enlaces
          </p>
        </div>
        <a
          href="https://bio.guambraweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
          style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
        >
          Ver página ↗
        </a>
      </div>

      <BioLinksManager
        initialProfile={profile}
        initialBlocks={blocks}
        totalVisits={analytics.totalVisits}
        analyticsBlocks={analytics.blocks}
      />
    </div>
  );
}
