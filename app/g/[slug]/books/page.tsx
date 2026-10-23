import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getBookEndings } from "@/lib/space-data";
import CaseStudyLove from "@/components/CaseStudyLove";

export const dynamic = "force-dynamic";

export default async function BooksPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content || !content.game) notFound();
  const { supabase, girl } = await requireSpace(slug);
  const unlocked = await getBookEndings(supabase, girl);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">her bookshelf</p>
        <h1 className="display">My books</h1>
        <p className="muted">One case study. Four possible endings. Entirely her call.</p>
      </header>
      <CaseStudyLove slug={slug} nickname={content.nickname} color={content.color} unlocked={unlocked} />
    </>
  );
}
