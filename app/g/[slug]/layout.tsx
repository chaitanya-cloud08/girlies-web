import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { signOut } from "@/app/actions";
import SpaceNav from "@/components/SpaceNav";

export default async function SpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  const { isAdmin } = await requireSpace(slug);

  return (
    <div className="space" style={{ ["--accent" as string]: content.color }}>
      {isAdmin && (
        <div className="admin-banner">
          👑 Viewing {content.name}&rsquo;s space as Chaitanya · <Link href="/admin">back to admin</Link>
        </div>
      )}
      <header className="topbar">
        <Link href={`/g/${slug}`} className="brand">
          Chaitanya&rsquo;s <em>Girlies</em> <span aria-hidden>{content.emoji}</span>
        </Link>
        <form action={signOut}>
          <button className="btn btn-ghost btn-sm">Log out</button>
        </form>
      </header>
      <SpaceNav slug={slug} />
      <main className="space-main">{children}</main>
      <footer className="space-foot hand">made with love for {content.nickname} ♡ — Chaitanya</footer>
    </div>
  );
}
