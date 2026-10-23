"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getViewer, loginToEmail, requireAdmin, requireGroup, requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { complimentFor } from "@/lib/compliments";
import { istDay } from "@/lib/dates";
import { MAX_STEMS, RIBBONS, WRAPS, isFlowerId } from "@/lib/flowers";

// ---------- auth ----------
export async function signIn(_prev: { error?: string } | undefined, formData: FormData) {
  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!login || !password) return { error: "Fill in both, babe 💅" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: loginToEmail(login), password });
  if (error) {
    const sass = [
      "Nice try, but you're not on the list 💅",
      "Hmm, that's not it. Try again, gorgeous.",
      "Wrong password! Are you even a girlie? 👀",
    ];
    return { error: sass[Math.floor(Math.random() * sass.length)] };
  }
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ---------- daily compliment ----------
export async function revealCompliment(slug: string) {
  const { supabase, girl, isAdmin } = await requireSpace(slug);
  const content = getGirl(slug);
  if (!content) return { error: "Unknown girlie" };
  const day = istDay();
  const text = complimentFor(slug, content.compliments, day);
  if (!isAdmin) {
    await supabase.from("compliment_log").upsert(
      { owner: girl.id, day, text },
      { onConflict: "owner,day", ignoreDuplicates: true }
    );
    revalidatePath(`/g/${slug}/compliment`);
  }
  return { text };
}

// ---------- bouquet (one-time) ----------
export async function sendBouquet(input: { flowers: string[]; wrap: string; ribbon: string; note: string }) {
  const { supabase, viewer } = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.role === "admin") return { error: "Admins can't send themselves bouquets, Chaitanya 😌" };

  const flowers = Array.isArray(input.flowers) ? input.flowers.filter(isFlowerId) : [];
  if (flowers.length < 1) return { error: "Pick at least one flower 🌸" };
  if (flowers.length > MAX_STEMS) return { error: `That's a lot of love! Max ${MAX_STEMS} stems.` };
  if (!WRAPS.some((w) => w.id === input.wrap)) return { error: "Pick a wrapping 🎀" };
  if (!RIBBONS.some((r) => r.id === input.ribbon)) return { error: "Pick a ribbon 🎀" };
  const note = String(input.note ?? "").slice(0, 400).trim();

  const { error } = await supabase.from("bouquets").insert({
    sender: viewer.id,
    flowers,
    wrap: input.wrap,
    ribbon: input.ribbon,
    note: note || null,
  });
  if (error) {
    if (error.code === "23505") return { error: "You've already sent your bouquet 💐 It's one-time only!" };
    return { error: "Couldn't send it, try again?" };
  }
  revalidatePath(`/g/${viewer.slug}`, "layout");
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- admin: letters ----------
export async function saveLetter(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const unlockDate = String(formData.get("unlock_date") ?? "");
  const content = String(formData.get("content") ?? "");
  const ownerSlug = String(formData.get("owner_slug") ?? "");
  if (!title || !unlockDate) return;
  const unlock_at = `${unlockDate}T00:00:00+05:30`;

  if (id) {
    await supabase.from("letters").update({ title, label, unlock_at, content }).eq("id", id);
  } else {
    const { data: owner } = await supabase.from("profiles").select("id").eq("slug", ownerSlug).single();
    if (!owner) return;
    await supabase.from("letters").insert({ owner: owner.id, title, label, unlock_at, content });
  }
  revalidatePath("/admin");
  revalidatePath(`/g/${ownerSlug}/letters`);
}

export async function deleteLetter(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("letters").delete().eq("id", id);
  revalidatePath("/admin");
}

// ---------- admin: photos ----------
export async function savePhotoRecord(input: { slug: string; path: string; caption: string }) {
  const { supabase } = await requireAdmin();
  const { data: owner } = await supabase.from("profiles").select("id").eq("slug", input.slug).single();
  if (!owner) return { error: "Unknown girlie" };
  const { count } = await supabase.from("photos").select("id", { count: "exact", head: true }).eq("owner", owner.id);
  const { error } = await supabase
    .from("photos")
    .insert({ owner: owner.id, storage_path: input.path, caption: input.caption.slice(0, 120) || null, sort: count ?? 0 });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath(`/g/${input.slug}`, "layout");
  return { ok: true };
}

export async function deletePhoto(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { data } = await supabase.from("photos").select("storage_path").eq("id", id).single();
  if (data) {
    await supabase.storage.from("photos").remove([data.storage_path]);
    await supabase.from("photos").delete().eq("id", id);
  }
  revalidatePath("/admin");
}

export async function updatePhotoCaption(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const caption = String(formData.get("caption") ?? "").slice(0, 120);
  await supabase.from("photos").update({ caption }).eq("id", id);
  revalidatePath("/admin");
}

// ---------- mini-game endings ----------
export async function unlockEnding(slug: string, endingId: string) {
  const { supabase, girl, isAdmin } = await requireSpace(slug);
  if (isAdmin) return { ok: true };
  await supabase.from("book_endings").upsert({ owner: girl.id, ending_id: endingId }, { onConflict: "owner,ending_id", ignoreDuplicates: true });
  return { ok: true };
}

// ---------- mini-game: ER Dash best score ----------
export async function saveErDashScore(slug: string, score: number, badge: boolean) {
  const { supabase, girl, isAdmin } = await requireSpace(slug);
  if (isAdmin) return { ok: true };
  const { data: existing } = await supabase.from("er_dash_scores").select("best_score, badge").eq("owner", girl.id).maybeSingle();
  const nextScore = Math.max(existing?.best_score ?? 0, score);
  const nextBadge = (existing?.badge ?? false) || badge;
  await supabase.from("er_dash_scores").upsert({ owner: girl.id, best_score: nextScore, badge: nextBadge, updated_at: new Date().toISOString() });
  return { ok: true, best: nextScore, badge: nextBadge };
}

// ---------- kalesh hq (group) ----------
export async function saveGroupSticker(emoji: string, x: number, y: number) {
  const { supabase, viewer, isAdmin } = await requireGroup();
  if (isAdmin) return { error: "Admin preview — stickers are for the girlies" };
  const clampedX = Math.min(96, Math.max(4, x));
  const clampedY = Math.min(96, Math.max(4, y));
  const { error } = await supabase
    .from("group_stickers")
    .upsert({ owner: viewer.id, emoji, x: clampedX, y: clampedY, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  revalidatePath("/kalesh/polaroid");
  return { ok: true };
}

export async function saveGroupPhoto(path: string, caption: string) {
  const { supabase } = await requireAdmin();
  const { data: existing } = await supabase.from("group_photo").select("storage_path").eq("id", true).maybeSingle();
  if (existing?.storage_path && existing.storage_path !== path) {
    await supabase.storage.from("photos").remove([existing.storage_path]);
  }
  const { error } = await supabase
    .from("group_photo")
    .upsert({ id: true, storage_path: path, caption: caption.slice(0, 160) || null, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/kalesh/polaroid");
  return { ok: true };
}
