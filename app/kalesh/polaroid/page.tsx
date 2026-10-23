import { requireGroup } from "@/lib/auth";
import { getGroupPhoto, getGroupStickers } from "@/lib/space-data";
import GroupPolaroid from "@/components/GroupPolaroid";

export const dynamic = "force-dynamic";

export default async function PolaroidPage() {
  const { supabase, viewer, isAdmin } = await requireGroup();
  const [photo, stickers] = await Promise.all([getGroupPhoto(supabase), getGroupStickers(supabase)]);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">forever and ever</p>
        <h1 className="display">Our polaroid 📸</h1>
        <p className="muted">One photo, one song, and a sticker from each of you.</p>
      </header>
      <GroupPolaroid photoUrl={photo.url} caption={photo.caption} stickers={stickers} myOwnerId={isAdmin ? null : viewer.id} canPlace={!isAdmin} />
    </>
  );
}
