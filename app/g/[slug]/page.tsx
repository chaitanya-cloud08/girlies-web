import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getBouquetFrom, getLetters } from "@/lib/space-data";
import { istDay, istHour, istTime } from "@/lib/dates";
import RainEgg from "@/components/RainEgg";
import SunshineReveal from "@/components/SunshineReveal";
import StreetSign from "@/components/StreetSign";
import PetalShower from "@/components/PetalShower";
import IdleDancer from "@/components/IdleDancer";

export const dynamic = "force-dynamic";

function greetingFor(g: NonNullable<ReturnType<typeof getGirl>>["greetings"]) {
  const h = istHour();
  const raw =
    h < 5 ? g.lateNight : h < 12 ? g.morning : h < 17 ? g.afternoon : h < 21 ? g.evening : g.night;
  return raw.replace("{time}", istTime());
}

function daysUntil(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export default async function SpaceHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  const { supabase, girl, isAdmin } = await requireSpace(slug);

  const [letters, bouquet, photosCount, todayLog] = await Promise.all([
    getLetters(supabase, girl, isAdmin),
    getBouquetFrom(supabase, girl),
    supabase.from("photos").select("id", { count: "exact", head: true }).eq("owner", girl.id),
    supabase.from("compliment_log").select("day").eq("owner", girl.id).eq("day", istDay()).maybeSingle(),
  ]);

  const nextLocked = letters.find((l) => !l.is_unlocked);
  const unlockedCount = letters.filter((l) => l.is_unlocked).length;
  const { Avatar } = content;

  return (
    <>
      <section className="hero">
        {content.heroEffect === "petals" && <PetalShower />}
        <div className={`hero-avatar ${content.avatarHoverEffect === "wind" ? "hero-avatar-wind" : ""}`}>
          {content.heroEffect === "sunshine" ? <SunshineReveal /> : <div className="hero-halo" aria-hidden />}
          <IdleDancer enabled={content.idleDance === true}>
            <Avatar pose="wave" className="avatar-svg bob" />
          </IdleDancer>
          {content.rainEgg && <RainEgg config={content.rainEgg} />}
          {content.streetSign && <StreetSign label={content.streetSign.label} message={content.streetSign.message} />}
        </div>
        <div className="hero-text">
          <p className="hand greeting">{greetingFor(content.greetings)}</p>
          <h1 className="display hero-title">{content.title}</h1>
        </div>
      </section>

      <section className="tiles" aria-label="Your space">
        <Link href={`/g/${slug}/compliment`} className="tile tile-mirror" data-pop>
          <span className="tile-icon" aria-hidden>🪞</span>
          <h2>Daily mirror</h2>
          <p>{todayLog.data ? "You've got today's compliment ✓ Go read it again." : "Today's compliment is waiting for you ✨"}</p>
        </Link>
        <Link href={`/g/${slug}/letters`} className="tile tile-letters" data-pop>
          <span className="tile-icon" aria-hidden>💌</span>
          <h2>Secret letters</h2>
          <p>
            {nextLocked
              ? `${letters.length - unlockedCount} sealed · opens in ${daysUntil(nextLocked.unlock_at)} days`
              : unlockedCount
                ? `${unlockedCount} letter${unlockedCount > 1 ? "s" : ""} ready to read 💋`
                : "No letters yet… or are there? 👀"}
          </p>
        </Link>
        <Link href={`/g/${slug}/photos`} className="tile tile-photos" data-pop>
          <span className="tile-icon" aria-hidden>📸</span>
          <h2>Photo wall</h2>
          <p>{photosCount.count ? `${photosCount.count} memories pinned` : "Polaroids coming soon…"}</p>
        </Link>
        <Link href={`/g/${slug}/bouquet`} className="tile tile-bouquet" data-pop>
          <span className="tile-icon" aria-hidden>💐</span>
          <h2>Bouquet for Chaitanya</h2>
          <p>{bouquet ? "Sent! She's probably blushing rn 🌷" : "Make her a bouquet — every flower means something"}</p>
        </Link>
        {content.shadeRounds && content.shadeRounds.length > 0 && (
          <Link href={`/g/${slug}/artsy`} className="tile tile-artsy" data-pop>
            <span className="tile-icon" aria-hidden>🎨</span>
            <h2>Now let&rsquo;s get artsy</h2>
            <p>Mix the Shade — match the paint, earn the gallery review</p>
          </Link>
        )}
        {content.game && (
          <Link href={content.game.href} className="tile tile-books" data-pop>
            <span className="tile-icon" aria-hidden>{content.game.icon ?? "📚"}</span>
            <h2>{content.game.label}</h2>
            <p>{content.game.teaser}</p>
          </Link>
        )}
        <Link href="/kalesh" className="tile tile-kalesh" data-pop>
          <span className="tile-icon" aria-hidden>🔥</span>
          <h2>Kalesh HQ</h2>
          <p>The whole group in one place: Wrapped and our polaroid</p>
        </Link>
      </section>
    </>
  );
}
