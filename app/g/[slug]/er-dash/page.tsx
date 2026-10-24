import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getErDashBest } from "@/lib/space-data";
import ErDash from "@/components/ErDash";

export const dynamic = "force-dynamic";

export default async function ErDashPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content || !content.game) notFound();
  const { supabase, girl } = await requireSpace(slug);
  const best = await getErDashBest(supabase, girl);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">her clinic</p>
        <h1 className="display">Dr. P&rsquo;s ER Dash</h1>
        <p className="muted">Two rounds. Total chaos. She&rsquo;s never once rattled.</p>
      </header>
      <ErDash slug={slug} nickname={content.nickname} title={content.title} color={content.color} best={best} />
    </>
  );
}
