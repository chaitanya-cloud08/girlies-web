"use client";
import { useState } from "react";
import Link from "next/link";
import JasbirAvatar from "./avatars/JasbirAvatar";
import KabirAvatar, { type KabirMood } from "./avatars/KabirAvatar";
import ChaitanyaContact from "./avatars/ChaitanyaContact";
import { SCENES, ENDINGS, emptyTotals, applyChoice, resolveEnding, type Choice, type EndingId, type Totals } from "@/lib/case-study";
import { unlockEnding } from "@/app/actions";
import { downloadBookCover } from "@/lib/book-cover";
import { playSound } from "./ClientFX";

type Cast = "both" | "chat" | "call";
const SCENE_CAST: Record<number, Cast> = { 1: "both", 2: "chat", 3: "both", 4: "both", 5: "both", 6: "both", 7: "call", 8: "both" };
const SCENE_MOOD: Record<number, KabirMood> = { 1: "smirk", 3: "soft", 4: "smirk", 5: "soft", 6: "surprised", 8: "soft" };

type View = { kind: "intro" } | { kind: "scene" } | { kind: "ending"; ending: EndingId } | { kind: "gallery" };

export default function CaseStudyLove({ slug, nickname, color, unlocked }: { slug: string; nickname: string; color: string; unlocked: string[] }) {
  const [view, setView] = useState<View>({ kind: "intro" });
  const [sceneIndex, setSceneIndex] = useState(0);
  const [totals, setTotals] = useState<Totals>(emptyTotals());
  const [sessionUnlocked, setSessionUnlocked] = useState<string[]>(unlocked);
  const [picked, setPicked] = useState<Choice | null>(null);

  const scene = SCENES[sceneIndex];
  const cast = SCENE_CAST[scene?.id] ?? "both";
  const mood = SCENE_MOOD[scene?.id] ?? "smirk";

  function start() {
    setSceneIndex(0);
    setTotals(emptyTotals());
    setPicked(null);
    setView({ kind: "scene" });
    playSound("soft");
  }

  function pick(choice: Choice) {
    if (picked) return;
    setPicked(choice);
    playSound("pop");
  }

  function continueStory() {
    if (!picked) return;
    const next = applyChoice(totals, picked);
    setPicked(null);
    if (sceneIndex + 1 >= SCENES.length) {
      const ending = resolveEnding(next);
      setTotals(next);
      unlockEnding(slug, ending).catch(() => {});
      setSessionUnlocked((u) => (u.includes(ending) ? u : [...u, ending]));
      setView({ kind: "ending", ending });
      playSound("chime");
    } else {
      setTotals(next);
      setSceneIndex((i) => i + 1);
    }
  }

  if (view.kind === "intro") {
    return (
      <div className="book-intro">
        <h2 className="display">Case Study: Love</h2>
        <p className="muted">A choose-your-ending rom-com. 8 scenes. 4 endings. Entirely fictional — unlike your actual love life, which is TBD.</p>
        <div className="confirm-actions">
          <button className="btn btn-primary" onClick={start} data-pop>
            Begin the case study 📖
          </button>
          <button className="btn btn-ghost" onClick={() => setView({ kind: "gallery" })}>
            My endings ({sessionUnlocked.length}/4)
          </button>
        </div>
      </div>
    );
  }

  if (view.kind === "gallery") {
    return (
      <div className="book-gallery">
        <h2 className="display small">Your endings</h2>
        <div className="ending-grid">
          {Object.values(ENDINGS).map((e) => {
            const got = sessionUnlocked.includes(e.id);
            return (
              <div key={e.id} className={`ending-card ${got ? "got" : "locked"}`}>
                <span className="ending-glyph" aria-hidden>{got ? e.glyph : "🔒"}</span>
                <h3>{got ? e.title : "???"}</h3>
                {got && <p className="tiny muted">{e.tagline}</p>}
                {got && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => downloadBookCover({ title: e.title, tagline: e.tagline, glyph: e.glyph, color, nickname })}
                  >
                    Download cover
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button className="btn btn-ghost" onClick={() => setView({ kind: "intro" })}>
          ← Back
        </button>
      </div>
    );
  }

  if (view.kind === "ending") {
    const e = ENDINGS[view.ending];
    return (
      <div className="book-ending">
        <span className="ending-glyph big" aria-hidden>{e.glyph}</span>
        <p className="eyebrow">the final chapter</p>
        <h2 className="display">{e.title}</h2>
        <p className="hand" style={{ fontSize: "1.4rem", color: "var(--accent-deep)" }}>{e.tagline}</p>
        <p className="book-ending-blurb">{e.blurb}</p>
        <div className="confirm-actions">
          <button className="btn btn-primary" onClick={() => downloadBookCover({ title: e.title, tagline: e.tagline, glyph: e.glyph, color, nickname })} data-pop>
            Download your book cover
          </button>
          <button className="btn btn-ghost" onClick={start}>
            Read it again
          </button>
        </div>
        <button className="link-btn" style={{ marginTop: 14 }} onClick={() => setView({ kind: "gallery" })}>
          See all your endings →
        </button>
      </div>
    );
  }

  // scene view
  return (
    <div className="book-scene">
      <p className="eyebrow">
        Chapter {scene.id} of {SCENES.length} · {scene.location}
      </p>
      <h2 className="display small">{scene.heading}</h2>

      <div className={`scene-cast cast-${cast}`}>
        {cast === "both" && (
          <>
            <JasbirAvatar pose="idle" className="avatar-svg scene-avatar" />
            <KabirAvatar mood={mood} className="avatar-svg scene-avatar" />
          </>
        )}
        {cast === "chat" && (
          <div className="scene-phone">
            <ChaitanyaContact className="scene-contact" />
          </div>
        )}
        {cast === "call" && (
          <div className="scene-phone">
            <ChaitanyaContact className="scene-contact scene-contact-call" />
            <p className="tiny muted">incoming call…</p>
          </div>
        )}
      </div>

      <div className="scene-dialogue">
        {scene.dialogue.map((line, i) => (
          <p key={i} style={{ animationDelay: `${i * 0.12}s` }}>
            {line}
          </p>
        ))}
      </div>

      {!picked && (
        <>
          <p className="scene-prompt">{scene.prompt}</p>
          <div className="scene-choices">
            {scene.choices.map((c) => (
              <button key={c.id} className="btn btn-ghost scene-choice" onClick={() => pick(c)} data-pop="soft">
                {c.label}
              </button>
            ))}
          </div>
        </>
      )}

      {picked && (
        <div className="scene-reply-wrap">
          <p className="scene-reply-label tiny muted">you said: {picked.label}</p>
          <p className="scene-reply hand">{picked.reply}</p>
          <button className="btn btn-primary" onClick={continueStory} data-pop>
            {sceneIndex + 1 >= SCENES.length ? "See how it ends →" : "Next →"}
          </button>
        </div>
      )}

      <Link href={`/g/${slug}`} className="link-btn">
        ← Leave the case study
      </Link>
    </div>
  );
}
