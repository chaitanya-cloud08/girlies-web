"use client";
import { useMemo, useState } from "react";
import { PALETTE, closingReview, hexToRgb, mixDabs, reviewFor, rgbToHex, scoreMatch, type PaintId } from "@/lib/paint";
import { playSound } from "./ClientFX";

type Round = { name: string; hex: string };

export default function MixTheShade({ rounds, nickname }: { rounds: Round[]; nickname: string }) {
  const [order] = useState(() => rounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [dabs, setDabs] = useState<PaintId[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const round = order[roundIndex];
  const target = useMemo(() => hexToRgb(round.hex), [round]);
  const mixed = useMemo(() => mixDabs(dabs), [dabs]);
  const mixedHex = rgbToHex(mixed);
  const score = submitted ? scoreMatch(mixed, target) : null;

  function addDab(id: PaintId) {
    if (submitted) return;
    setDabs((d) => [...d, id]);
    playSound("soft");
  }
  function undo() {
    if (submitted) return;
    setDabs((d) => d.slice(0, -1));
  }
  function reset() {
    if (submitted) return;
    setDabs([]);
  }
  function submit() {
    if (dabs.length === 0 || submitted) return;
    setSubmitted(true);
    playSound("chime");
  }
  function next() {
    const s = scoreMatch(mixed, target);
    const nextScores = [...scores, s];
    setScores(nextScores);
    if (roundIndex + 1 >= order.length) {
      setFinished(true);
    } else {
      setRoundIndex((i) => i + 1);
      setDabs([]);
      setSubmitted(false);
    }
  }
  function playAgain() {
    setRoundIndex(0);
    setDabs([]);
    setSubmitted(false);
    setScores([]);
    setFinished(false);
  }

  if (finished) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return (
      <div className="shade-final">
        <p className="eyebrow">the exhibition is over</p>
        <h2 className="display">
          {avg}, {nickname}
        </h2>
        <p className="hand shade-final-review">{closingReview(avg)}</p>
        <ul className="shade-final-list">
          {order.map((r, i) => (
            <li key={r.name}>
              <span className="shade-final-swatch" style={{ background: r.hex }} aria-hidden />
              {r.name} — <b>{scores[i]}</b>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary" onClick={playAgain} data-pop>
          Paint another collection
        </button>
      </div>
    );
  }

  return (
    <div className="shade-game">
      <div className="shade-target">
        <p className="tiny muted">
          Round {roundIndex + 1} of {order.length}
        </p>
        <div className="shade-swatch shade-swatch-target" style={{ background: round.hex }} aria-hidden />
        <h2 className="display small">{round.name}</h2>
        <p className="muted tiny">Mix dabs of paint until you match this shade.</p>
      </div>

      <div className="shade-mix-area">
        <div className="shade-mix">
          <div className="shade-swatch shade-swatch-mix" style={{ background: dabs.length ? mixedHex : "#fff" }} aria-hidden />
          <p className="tiny muted">{dabs.length} dab{dabs.length === 1 ? "" : "s"} on the palette</p>
        </div>

        <div className="palette" role="group" aria-label="Paint colours">
          {PALETTE.map((p) => (
            <button
              key={p.id}
              type="button"
              className="palette-dab"
              style={{ background: p.hex }}
              onClick={() => addDab(p.id)}
              disabled={submitted}
              aria-label={`Add a dab of ${p.name}`}
              data-pop="soft"
            >
              <span className="sr-only">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="shade-actions">
          <button className="btn btn-ghost btn-sm" onClick={undo} disabled={submitted || dabs.length === 0}>
            Undo
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset} disabled={submitted || dabs.length === 0}>
            Clean palette
          </button>
          {!submitted ? (
            <button className="btn btn-primary" onClick={submit} disabled={dabs.length === 0} data-pop>
              Match it
            </button>
          ) : (
            <button className="btn btn-primary" onClick={next} data-pop>
              {roundIndex + 1 >= order.length ? "See your gallery score" : "Next shade"}
            </button>
          )}
        </div>

        {submitted && score !== null && (
          <div className="shade-result">
            <p className="display small">Score: {score}</p>
            <p className="hand">{reviewFor(score)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
