import Bouquet from "./Bouquet";
import { FlowerIcon } from "./Flower";
import { FLOWERS, type FlowerId } from "@/lib/flowers";

export default function BouquetCard({
  from,
  flowers,
  wrap,
  ribbon,
  note,
  sentAt,
  heading,
  avatar,
}: {
  from: string;
  flowers: FlowerId[];
  wrap: string;
  ribbon: string;
  note: string | null;
  sentAt: string;
  heading?: string;
  avatar?: React.ReactNode;
}) {
  const counts = new Map<FlowerId, number>();
  flowers.forEach((f) => counts.set(f, (counts.get(f) ?? 0) + 1));
  const date = new Date(sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

  return (
    <article className="bouquet-card">
      <div className="bouquet-card-visual">
        {avatar && <div className="bouquet-card-avatar">{avatar}</div>}
        <Bouquet flowers={flowers} wrap={wrap} ribbon={ribbon} className="bouquet-svg" />
      </div>
      <div className="bouquet-card-text">
        {heading && <h2 className="display small">{heading}</h2>}
        <p className="tiny muted">
          From {from} · {date}
        </p>
        {note && (
          <blockquote className="gift-note hand">
            {note}
            <span>— {from}</span>
          </blockquote>
        )}
        <h3 className="meanings-title">What it says</h3>
        <ul className="meanings">
          {[...counts.entries()].map(([id, n]) => {
            const f = FLOWERS.find((x) => x.id === id)!;
            return (
              <li key={id}>
                <FlowerIcon id={id} size={34} />
                <div>
                  <b>
                    {f.name}
                    {n > 1 ? ` ×${n}` : ""}
                  </b>
                  <span>{f.meaning}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
