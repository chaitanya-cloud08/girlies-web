"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Bouquet from "./Bouquet";
import { FlowerIcon } from "./Flower";
import { FLOWERS, MAX_STEMS, RIBBONS, WRAPS, type FlowerId } from "@/lib/flowers";
import { sendBouquet } from "@/app/actions";
import { playSound } from "./ClientFX";

export default function BouquetBuilder({ nickname, confirmTitle }: { nickname: string; confirmTitle?: string }) {
  const router = useRouter();
  const [stems, setStems] = useState<FlowerId[]>([]);
  const [wrap, setWrap] = useState<string>(WRAPS[0].id);
  const [ribbon, setRibbon] = useState<string>(RIBBONS[0].id);
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const counts = useMemo(() => {
    const m = new Map<FlowerId, number>();
    stems.forEach((s) => m.set(s, (m.get(s) ?? 0) + 1));
    return m;
  }, [stems]);

  const full = stems.length >= MAX_STEMS;

  function add(id: FlowerId) {
    if (full) return;
    setStems((s) => [...s, id]);
  }
  function remove(id: FlowerId) {
    setStems((s) => {
      const i = s.lastIndexOf(id);
      if (i < 0) return s;
      const next = [...s];
      next.splice(i, 1);
      return next;
    });
  }

  function send() {
    setError(null);
    start(async () => {
      const res = await sendBouquet({ flowers: stems, wrap, ribbon, note });
      if ("error" in res && res.error) {
        setError(res.error);
        setConfirming(false);
        return;
      }
      setSent(true);
      playSound("chime");
      setTimeout(() => router.refresh(), 2600);
    });
  }

  const chosen = [...counts.keys()].map((id) => FLOWERS.find((f) => f.id === id)!);

  return (
    <div className="builder">
      <div className="builder-preview">
        <div className="preview-frame">
          <Bouquet flowers={stems} wrap={wrap} ribbon={ribbon} className="bouquet-svg" />
          <span className="stem-count">
            {stems.length}/{MAX_STEMS} stems
          </span>
        </div>
        {chosen.length > 0 && (
          <div className="says">
            <p className="tiny muted">your bouquet says…</p>
            <ul>
              {chosen.map((f) => (
                <li key={f.id} className="hand">
                  {f.meaning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="builder-controls">
        <section>
          <h2 className="step-title">
            <span>1</span> Pick your flowers
          </h2>
          <ul className="shop">
            {FLOWERS.map((f) => {
              const n = counts.get(f.id) ?? 0;
              return (
                <li key={f.id} className={`shop-item ${n ? "picked" : ""}`}>
                  <button className="shop-add" onClick={() => add(f.id)} disabled={full} data-pop aria-label={`Add ${f.name}`}>
                    <FlowerIcon id={f.id} size={52} />
                    <span className="shop-name">{f.name}</span>
                    <span className="shop-meaning">{f.meaning}</span>
                    {f.special && <span className="shop-special">{f.special}</span>}
                  </button>
                  {n > 0 && (
                    <div className="shop-count">
                      <button onClick={() => remove(f.id)} aria-label={`Remove one ${f.name}`} data-pop="soft">
                        −
                      </button>
                      <b>{n}</b>
                      <button onClick={() => add(f.id)} disabled={full} aria-label={`Add another ${f.name}`} data-pop>
                        +
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {full && <p className="tiny muted">That&rsquo;s a full bouquet! Remove a stem to swap one.</p>}
        </section>

        <section>
          <h2 className="step-title">
            <span>2</span> Wrap it up
          </h2>
          <div className="swatches" role="radiogroup" aria-label="Wrapping paper">
            {WRAPS.map((w) => (
              <button
                key={w.id}
                role="radio"
                aria-checked={wrap === w.id}
                className={`swatch ${wrap === w.id ? "on" : ""}`}
                onClick={() => setWrap(w.id)}
                data-pop="soft"
              >
                <i style={{ background: w.fill, borderColor: w.edge }} />
                {w.name}
              </button>
            ))}
          </div>
          <div className="swatches" role="radiogroup" aria-label="Ribbon">
            {RIBBONS.map((r) => (
              <button
                key={r.id}
                role="radio"
                aria-checked={ribbon === r.id}
                className={`swatch ${ribbon === r.id ? "on" : ""}`}
                onClick={() => setRibbon(r.id)}
                data-pop="soft"
              >
                <i style={{ background: r.color }} />
                {r.name} ribbon
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="step-title">
            <span>3</span> Write the card
          </h2>
          <label className="field">
            <span className="sr-only">Your note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={400}
              rows={4}
              placeholder={`Dear Chaitanya… (from ${nickname} 💋)`}
              className="hand"
            />
          </label>
          <p className="tiny muted right">{note.length}/400</p>
        </section>

        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary btn-wide" disabled={stems.length === 0} onClick={() => setConfirming(true)} data-pop>
          {stems.length === 0 ? "Pick a flower first 🌸" : "Send to Chaitanya 💌"}
        </button>
      </div>

      {confirming && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <div className="confirm">
            {sent ? (
              <>
                <div className="confetti" aria-hidden>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <i key={i} style={{ ["--i" as string]: i }} />
                  ))}
                </div>
                <h2 className="display small">Sent! 💐</h2>
                <p className="hand">Chaitanya&rsquo;s going to love it, {nickname}.</p>
              </>
            ) : (
              <>
                <h2 className="display small">{confirmTitle ?? "Ready to send?"}</h2>
                <p>It&rsquo;s a one-time bouquet — once it&rsquo;s sent, it&rsquo;s hers forever. No edits!</p>
                <div className="confirm-actions">
                  <button className="btn btn-ghost" onClick={() => setConfirming(false)} disabled={pending}>
                    Wait, one more flower
                  </button>
                  <button className="btn btn-primary" onClick={send} disabled={pending}>
                    {pending ? "Wrapping…" : "Yes, send it 💌"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
