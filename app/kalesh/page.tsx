import Link from "next/link";
import { requireGroup } from "@/lib/auth";
import GroupAvatarHeader from "@/components/GroupAvatarHeader";

export const dynamic = "force-dynamic";

export default async function KaleshHQ() {
  await requireGroup();

  return (
    <div className="kalesh-hq">
      <header className="kalesh-hero">
        <p className="eyebrow">the group chat, in real life</p>
        <h1 className="display kalesh-title">Zindagi ke Kalesh</h1>
        <GroupAvatarHeader />
      </header>

      <div className="kalesh-cards">
        <Link href="/kalesh/wrapped" className="kalesh-card" data-pop>
          <span className="kalesh-card-icon" aria-hidden>💿</span>
          <h2>Zindagi ke Kalesh Wrapped</h2>
          <p>Your year, Spotify-Wrapped style. Tap through for the reveal.</p>
        </Link>
        <Link href="/kalesh/polaroid" className="kalesh-card" data-pop>
          <span className="kalesh-card-icon" aria-hidden>📸</span>
          <h2>Our polaroid</h2>
          <p>One photo, one song, and a sticker from each of you.</p>
        </Link>
      </div>
    </div>
  );
}
