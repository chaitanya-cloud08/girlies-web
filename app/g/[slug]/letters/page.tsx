import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getLetters } from "@/lib/space-data";
import LetterEnvelope from "@/components/LetterEnvelope";

export const dynamic = "force-dynamic";

export default async function LettersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  const { supabase, girl, isAdmin } = await requireSpace(slug);
  const letters = await getLetters(supabase, girl, isAdmin);
  const isBook = content.letterTheme === "book";

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{isBook ? "chapters, sealed" : "sealed with a 💋"}</p>
        <h1 className="display">{isBook ? "Her bookshelf" : "Secret letters"}</h1>
        <p className="muted">
          {isBook ? `Some chapters open when the time is right. No skipping ahead, ${content.nickname}.` : `Some letters open when the time is right. No peeking, ${content.nickname}.`}
        </p>
      </header>
      {letters.length === 0 ? (
        <p className="empty hand">No letters yet… Chaitanya is still writing 🖋️</p>
      ) : (
        <div className="letters">
          {letters.map((l) => (
            <LetterEnvelope key={l.id} letter={l} nickname={content.nickname} isAdmin={isAdmin} theme={content.letterTheme} />
          ))}
        </div>
      )}
    </>
  );
}
