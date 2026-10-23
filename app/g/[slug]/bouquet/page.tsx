import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getBouquetFrom } from "@/lib/space-data";
import BouquetBuilder from "@/components/BouquetBuilder";
import BouquetCard from "@/components/BouquetCard";
import type { FlowerId } from "@/lib/flowers";

export const dynamic = "force-dynamic";

export default async function BouquetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  const { supabase, girl, isAdmin } = await requireSpace(slug);
  const bouquet = await getBouquetFrom(supabase, girl);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">the flower shop is open</p>
        <h1 className="display">A bouquet for Chaitanya 💐</h1>
        <p className="muted">
          Every flower means something. Pick the ones that say what you feel, wrap it up, and send it. It&rsquo;s a one-time gift, so make it count ♡
        </p>
      </header>

      {bouquet ? (
        <BouquetCard
          from={content.name}
          flowers={bouquet.flowers as FlowerId[]}
          wrap={bouquet.wrap}
          ribbon={bouquet.ribbon}
          note={bouquet.note}
          sentAt={bouquet.created_at}
          heading={isAdmin ? `${content.name}'s bouquet for you` : "Your bouquet is with Chaitanya 🌷"}
        />
      ) : isAdmin ? (
        <p className="empty hand">{content.name} hasn&rsquo;t sent her bouquet yet 🌱</p>
      ) : (
        <BouquetBuilder nickname={content.nickname} confirmTitle={content.bouquetConfirmTitle} />
      )}
    </>
  );
}
