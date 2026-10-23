import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import MixTheShade from "@/components/MixTheShade";

export const dynamic = "force-dynamic";

export default async function ArtsyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  await requireSpace(slug);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">now let&rsquo;s get artsy</p>
        <h1 className="display">Mix the Shade 🎨</h1>
        <p className="muted">A shade, a name, and your eye. Mix dabs of paint until you match it.</p>
      </header>
      {content.shadeRounds && content.shadeRounds.length > 0 ? (
        <MixTheShade rounds={content.shadeRounds} nickname={content.nickname} />
      ) : (
        <p className="empty hand">The gallery isn&rsquo;t hung yet… come back soon 🖼️</p>
      )}
    </>
  );
}
