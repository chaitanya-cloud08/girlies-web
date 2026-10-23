import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  username: string;
  slug: string | null;
  display_name: string;
  role: "girl" | "admin";
};

/** Username logins (no "@") map to an internal address. */
export const USERNAME_DOMAIN = "chaitanyasgirlies.app";

export function loginToEmail(login: string) {
  const v = login.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@${USERNAME_DOMAIN}`;
}

export async function getViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, viewer: null as Profile | null };
  const { data } = await supabase
    .from("profiles")
    .select("id, username, slug, display_name, role")
    .eq("id", user.id)
    .single();
  return { supabase, viewer: (data as Profile) ?? null };
}

/** Lets a girl into her own space, and the admin into anyone's. */
export async function requireSpace(slug: string) {
  const { supabase, viewer } = await getViewer();
  if (!viewer) redirect("/");
  const isAdmin = viewer.role === "admin";
  if (!isAdmin && viewer.slug !== slug) redirect("/");

  let girl: Profile | null = isAdmin ? null : viewer;
  if (isAdmin) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, slug, display_name, role")
      .eq("slug", slug)
      .single();
    girl = (data as Profile) ?? null;
  }
  if (!girl) redirect("/");
  return { supabase, viewer, girl, isAdmin };
}

/** Lets any logged-in girl or the admin into Kalesh HQ. */
export async function requireGroup() {
  const { supabase, viewer } = await getViewer();
  if (!viewer) redirect("/");
  if (viewer.role !== "girl" && viewer.role !== "admin") redirect("/");
  return { supabase, viewer, isAdmin: viewer.role === "admin" };
}

export async function requireAdmin() {
  const { supabase, viewer } = await getViewer();
  if (!viewer) redirect("/");
  if (viewer.role !== "admin") redirect("/");
  return { supabase, viewer };
}
