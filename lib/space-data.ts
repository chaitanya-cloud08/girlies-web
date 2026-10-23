import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "./auth";

export type Letter = {
  id: string;
  title: string;
  label: string | null;
  unlock_at: string;
  is_unlocked: boolean;
  content: string | null;
};

export async function getLetters(supabase: SupabaseClient, girl: Profile, isAdmin: boolean): Promise<Letter[]> {
  if (isAdmin) {
    const { data } = await supabase
      .from("letters")
      .select("id, title, label, unlock_at, content")
      .eq("owner", girl.id)
      .order("sort")
      .order("unlock_at");
    const now = Date.now();
    return (data ?? []).map((l) => ({ ...l, is_unlocked: new Date(l.unlock_at).getTime() <= now }));
  }
  const { data } = await supabase.rpc("my_letters");
  return (data as Letter[]) ?? [];
}

export type Photo = { id: string; caption: string | null; url: string | null; storage_path: string };

export async function getPhotos(supabase: SupabaseClient, girl: Profile): Promise<Photo[]> {
  const { data } = await supabase
    .from("photos")
    .select("id, caption, storage_path")
    .eq("owner", girl.id)
    .order("sort")
    .order("created_at");
  const rows = data ?? [];
  if (!rows.length) return [];
  const { data: signed } = await supabase.storage
    .from("photos")
    .createSignedUrls(rows.map((r) => r.storage_path), 60 * 60 * 6);
  return rows.map((r, i) => ({ ...r, url: signed?.[i]?.signedUrl ?? null }));
}

export type BouquetRow = {
  id: string;
  sender: string;
  flowers: string[];
  wrap: string;
  ribbon: string;
  note: string | null;
  created_at: string;
};

export async function getBouquetFrom(supabase: SupabaseClient, girl: Profile) {
  const { data } = await supabase.from("bouquets").select("*").eq("sender", girl.id).maybeSingle();
  return (data as BouquetRow) ?? null;
}

export async function getBookEndings(supabase: SupabaseClient, girl: Profile): Promise<string[]> {
  const { data } = await supabase.from("book_endings").select("ending_id").eq("owner", girl.id);
  return (data ?? []).map((r) => r.ending_id as string);
}

export async function getErDashBest(supabase: SupabaseClient, girl: Profile): Promise<{ score: number; badge: boolean }> {
  const { data } = await supabase.from("er_dash_scores").select("best_score, badge").eq("owner", girl.id).maybeSingle();
  return { score: data?.best_score ?? 0, badge: data?.badge ?? false };
}

// ---------- Kalesh HQ (group space) ----------
export type GroupProfile = { id: string; slug: string | null; display_name: string; role: "girl" | "admin" };

export async function getGroupGirls(supabase: SupabaseClient): Promise<GroupProfile[]> {
  const { data } = await supabase.from("profiles").select("id, slug, display_name, role").eq("role", "girl").order("created_at");
  return (data ?? []) as GroupProfile[];
}

export async function getGroupPhoto(supabase: SupabaseClient): Promise<{ url: string | null; caption: string | null }> {
  const { data } = await supabase.from("group_photo").select("storage_path, caption").eq("id", true).maybeSingle();
  if (!data?.storage_path) return { url: null, caption: data?.caption ?? null };
  const { data: signed } = await supabase.storage.from("photos").createSignedUrl(data.storage_path, 60 * 60 * 6);
  return { url: signed?.signedUrl ?? null, caption: data.caption ?? null };
}

export type Sticker = { owner: string; emoji: string; x: number; y: number };

export async function getGroupStickers(supabase: SupabaseClient): Promise<Sticker[]> {
  const { data } = await supabase.from("group_stickers").select("owner, emoji, x, y");
  return (data ?? []) as Sticker[];
}
