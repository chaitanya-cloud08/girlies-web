"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Letter } from "@/lib/space-data";
import { playSound } from "./ClientFX";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const teases = [
  "Not yet, {n}! 🙅‍♀️",
  "Patience, princess 💋",
  "Nice try. It's sealed for a reason 👀",
  "Overthinker, stop shaking the envelope 😭",
  "It'll be worth the wait, promise ♡",
];

const bookTeases = [
  "No spoilers, {n} 🙅‍♀️",
  "Patience, Sunshine 🌻",
  "You can't skip to the ending 👀",
  "This chapter isn't written yet, stop peeking 😭",
  "It'll be worth the wait, promise ♡",
];

export default function LetterEnvelope({
  letter,
  nickname,
  isAdmin,
  theme = "envelope",
}: {
  letter: Letter;
  nickname: string;
  isAdmin: boolean;
  theme?: "envelope" | "book";
}) {
  const router = useRouter();
  const unlockMs = new Date(letter.unlock_at).getTime();
  const [now, setNow] = useState<number | null>(null);
  const [opened, setOpened] = useState(false);
  const [wiggle, setWiggle] = useState(0);
  const [tease, setTease] = useState<string | null>(null);
  const isBook = theme === "book";

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const locked = !letter.is_unlocked;
  const remaining = now === null ? null : unlockMs - now;

  useEffect(() => {
    if (locked && remaining !== null && remaining <= 0) router.refresh();
  }, [locked, remaining, router]);

  const unlockDate = new Date(letter.unlock_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  function tap() {
    if (locked && !isAdmin) {
      setWiggle((w) => w + 1);
      const pool = isBook ? bookTeases : teases;
      setTease(pool[Math.floor(Math.random() * pool.length)].replace("{n}", nickname));
      playSound("soft");
      return;
    }
    setOpened(true);
    playSound("chime");
  }

  const c = remaining !== null ? parts(remaining) : null;

  return (
    <article className={`letter ${opened ? "is-open" : ""}`}>
      {!opened ? (
        <>
          {isBook ? (
            <button
              className={`book-cover ${locked ? "locked" : "ready"}`}
              onClick={tap}
              key={wiggle}
              aria-label={locked ? `${letter.title}, locked until ${unlockDate}` : `Open ${letter.title}`}
            >
              <span className="book-spine" aria-hidden />
              <span className="book-ribbon" aria-hidden>{locked ? "🔒" : "📖"}</span>
              <span className="book-title hand">{letter.label || letter.title}</span>
            </button>
          ) : (
            <button
              className={`envelope ${locked ? "locked" : "ready"}`}
              onClick={tap}
              key={wiggle}
              aria-label={locked ? `${letter.title}, locked until ${unlockDate}` : `Open ${letter.title}`}
            >
              <span className="env-flap" aria-hidden />
              <span className="env-seal" aria-hidden>
                {locked ? "🔒" : "💋"}
              </span>
              <span className="env-label hand">{letter.label || letter.title}</span>
            </button>
          )}
          <div className="letter-meta">
            <h2>{letter.title}</h2>
            {locked ? (
              <>
                <p className="muted">Unlocks on {unlockDate}</p>
                {c && (
                  <div className="countdown" aria-live="off">
                    <span><b>{c.d}</b>days</span>
                    <span><b>{String(c.h).padStart(2, "0")}</b>hrs</span>
                    <span><b>{String(c.m).padStart(2, "0")}</b>min</span>
                    <span><b>{String(c.s).padStart(2, "0")}</b>sec</span>
                  </div>
                )}
                {tease && <p className="tease hand">{tease}</p>}
                {isAdmin && <p className="tiny muted">👑 Admin: tap to preview — she can&rsquo;t read it until then.</p>}
              </>
            ) : (
              <p className="hand ready-note">{isBook ? "It's time. Open the book 📖" : "It's time. Tap the seal 💌"}</p>
            )}
          </div>
        </>
      ) : (
        <div className="paper">
          <p className="paper-to hand">Dear {nickname},</p>
          <div className="paper-body hand">
            {(letter.content || "…this letter is still being written ✍️").split("\n").map((line, i) => (
              <p key={i}>{line || " "}</p>
            ))}
          </div>
          <p className="paper-sign hand">— Chaitanya 💋</p>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpened(false)}>
            {isBook ? "Close the book" : "Fold it back"}
          </button>
        </div>
      )}
    </article>
  );
}
