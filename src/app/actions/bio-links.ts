"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const REVALIDATE = () => {
  revalidatePath("/links");
  revalidatePath("/admin/bio-links");
};

// ── TIPOS ─────────────────────────────────────────────────────────

export type BioBlockType = "button" | "card" | "text" | "video" | "divider";

export type BioBlock = {
  id: string;
  type: BioBlockType;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  url: string | null;
  image_url: string | null;
  icon_name: string | null;
  bg_color: string | null;
  text_color: string | null;
  is_active: boolean;
  sort_order: number;
  clicks: number;
  created_at: string;
};

export type BioProfile = {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  avatar_url: string | null;
  template: string | null;
  cover_color: string | null;
  updated_at: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_tiktok: string | null;
  social_x: string | null;
  social_youtube: string | null;
  social_website: string | null;
};

// ── PERFIL ────────────────────────────────────────────────────────

export async function getBioProfile(): Promise<BioProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("bio_profile").select("*").eq("id", 1).single();
  return data as BioProfile | null;
}

export async function updateBioProfile(payload: {
  name: string;
  tagline: string;
  description: string;
  avatar_url?: string;
  template: string;
  cover_color: string;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_tiktok?: string | null;
  social_x?: string | null;
  social_youtube?: string | null;
  social_website?: string | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bio_profile")
    .upsert({ id: 1, ...payload, updated_at: new Date().toISOString() });
  if (error) return { success: false, message: error.message };
  REVALIDATE();
  return { success: true };
}

// ── BLOQUES ───────────────────────────────────────────────────────

export async function getBioBlocks(): Promise<BioBlock[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bio_blocks")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as BioBlock[]) ?? [];
}

export async function createBioBlock(payload: Omit<BioBlock, "id" | "clicks" | "created_at">) {
  const supabase = await createClient();
  const { error } = await supabase.from("bio_blocks").insert(payload);
  if (error) return { success: false, message: error.message };
  REVALIDATE();
  return { success: true };
}

export async function updateBioBlock(id: string, payload: Partial<Omit<BioBlock, "id" | "clicks" | "created_at">>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bio_blocks")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { success: false, message: error.message };
  REVALIDATE();
  return { success: true };
}

export async function deleteBioBlock(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("bio_blocks").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  REVALIDATE();
  return { success: true };
}

export async function reorderBioBlocks(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("bio_blocks").update({ sort_order: index }).eq("id", id)
  );
  await Promise.all(updates);
  REVALIDATE();
  return { success: true };
}

// ── ANALYTICS ─────────────────────────────────────────────────────

export async function getBioAnalytics() {
  const supabase = await createClient();
  const [visitsRes, blocksRes] = await Promise.all([
    supabase.from("bio_page_visits").select("id", { count: "exact", head: true }),
    supabase.from("bio_blocks").select("id, title, type, clicks").order("clicks", { ascending: false }),
  ]);
  return {
    totalVisits: visitsRes.count ?? 0,
    blocks: (blocksRes.data ?? []) as { id: string; title: string | null; type: string; clicks: number }[],
  };
}

export async function trackBioPageVisit(userAgent: string, referrer: string) {
  const supabase = await createClient();
  await supabase.from("bio_page_visits").insert({ user_agent: userAgent, referrer });
}

// ── BACKWARD COMPAT (bio_links y bio_portfolio legacy) ────────────

export async function getBioLinks() {
  const supabase = await createClient();
  const { data } = await supabase.from("bio_links").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getBioPortfolio() {
  const supabase = await createClient();
  const { data } = await supabase.from("bio_portfolio").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}
