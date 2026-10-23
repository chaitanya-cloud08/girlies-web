"use client";
import { useState, useTransition } from "react";
import { revealCompliment } from "@/app/actions";
import { playSound } from "./ClientFX";

export default function Mirror({
  slug,
  initial,
  nickname,
  isAdmin,
  variant = "classic",
}: {
  slug: string;
  initial: string | null;
  nickname: string;
  isAdmin: boolean;
  variant?: "classic" | "fitcheck" | "prescription";
}) {
  const [text, setText] = useState<string | null>(initial);
  const [pending, start] = useTransition();
  const [fresh, setFresh] = useState(false);
  const fitcheck = variant === "fitcheck";
  const rx = variant === "prescription";

  function reveal() {
    if (text || pending) return;
    start(async () => {
      const res = await revealCompliment(slug);
      if ("text" in res && res.text) {
        setText(res.text);
        setFresh(true);
        playSound("chime");
      }
    });
  }

  const ctaLabel = rx ? "Tap for today's Rx 🩺" : fitcheck ? "Tap for today's fit check ✨" : `Tap me, ${nickname} ✨`;
  const pendingLabel = rx ? "writing it up…" : fitcheck ? "rating the fit…" : "polishing the mirror…";

  return (
    <div className="mirror-stage">
      <button
        className={`mirror ${text ? "revealed" : ""} ${fresh ? "fresh" : ""}`}
        onClick={reveal}
        disabled={pending}
        aria-label={text ? "Today's compliment" : rx ? "Tap the mirror for today's prescription" : fitcheck ? "Tap the mirror for today's fit check" : "Tap the mirror for today's compliment"}
      >
        <span className="bulbs" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <i key={i} style={{ ["--i" as string]: i }} />
          ))}
        </span>
        <span className="glass">
          {text ? (
            rx ? (
              <span className="rx-slip" aria-live="polite">
                <span className="rx-letterhead">℞ Dr. P</span>
                <span className="rx-body">Rx: {text}</span>
                <span className="rx-foot">Take twice daily. No refills needed.</span>
              </span>
            ) : (
              <span className="compliment-wrap">
                {fitcheck && <span className="fit-rating">10/10</span>}
                <span className="compliment" aria-live="polite">
                  {text}
                </span>
              </span>
            )
          ) : (
            <span className="mirror-cta hand">{pending ? pendingLabel : ctaLabel}</span>
          )}
        </span>
      </button>
      {isAdmin && <p className="tiny muted">👑 Admin preview — revealing here doesn&rsquo;t count for her.</p>}
    </div>
  );
}
