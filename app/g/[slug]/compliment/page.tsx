import { notFound } from "next/navigation";
import { requireSpace } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { istDay, prettyDate } from "@/lib/dates";
import Mirror from "@/components/Mirror";

export const dynamic = "force-dynamic";

export default async function ComplimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getGirl(slug);
  if (!content) notFound();
  const { supabase, girl, isAdmin } = await requireSpace(slug);
  const today = istDay();
  const fitcheck = content.mirrorStyle === "fitcheck";
  const rx = content.mirrorStyle === "prescription";

  const { data: log } = await supabase
    .from("compliment_log")
    .select("day, text")
    .eq("owner", girl.id)
    .order("day", { ascending: false })
    .limit(60);

  const todays = log?.find((l) => l.day === today)?.text ?? null;
  const past = (log ?? []).filter((l) => l.day !== today);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{rx ? "rounds, rounds" : fitcheck ? "fit check, fit check" : "mirror, mirror"}</p>
        <h1 className="display">{rx ? "Today's prescription" : fitcheck ? "Your daily fit check" : "Your daily compliment"}</h1>
        <p className="muted">
          {rx ? `One new one every day, whenever you're ready, ${content.nickname}.` : `One new one every day. Come back tomorrow for more, ${content.nickname}.`}
        </p>
      </header>

      <Mirror slug={slug} initial={todays} nickname={content.nickname} isAdmin={isAdmin} variant={rx ? "prescription" : fitcheck ? "fitcheck" : "classic"} />

      <section className="diary">
        <h2 className="display small">{content.diaryLabel ?? "Compliment diary 📔"}</h2>
        {past.length === 0 ? (
          <p className="muted hand">{rx ? "Her prescription history will collect here, day by day." : "Your past compliments will collect here, day by day."}</p>
        ) : (
          <ul>
            {past.map((p) => (
              <li key={p.day}>
                <time className="tiny muted">{prettyDate(p.day)}</time>
                {fitcheck && <span className="fit-rating fit-rating-sm">10/10</span>}
                {rx && <span className="rx-tag">℞</span>}
                <p>{rx ? `Rx: ${p.text}` : p.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
