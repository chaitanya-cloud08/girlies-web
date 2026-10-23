import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getPhotos } from "@/lib/space-data";
import PhotoWall from "@/components/PhotoWall";

export const dynamic = "force-dynamic";

export default async function PhotosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  const { supabase, girl } = await requireSpace(slug);
  const photos = await getPhotos(supabase, girl);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">the {content.nickname} archives</p>
        <h1 className="display">Photo wall 📸</h1>
        <p className="muted">Tap a photo to see it up close.</p>
      </header>
      <PhotoWall
        photos={photos.map((p) => ({ id: p.id, url: p.url, caption: p.caption }))}
        placeholders={content.photoPlaceholders}
        theme={content.photoTheme}
      />
    </>
  );
}
