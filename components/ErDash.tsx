"use client";
import { useEffect, useState } from "react";
import PranjaliAvatar from "./avatars/PranjaliAvatar";
import ChaitanyaContact from "./avatars/ChaitanyaContact";
import DoctorOverlay from "./DoctorOverlay";
import {
  ROOMS,
  PATIENT_TEMPLATES,
  VIP_PATIENT,
  SHIFTS,
  NEET_NOTES,
  STARTING_HEARTS,
  POINTS_CORRECT,
  POINTS_VIP,
  CHILL_MS,
  BADGE_SCORE,
  shuffle,
  type PatientTemplate,
  type RoomId,
} from "@/lib/er-dash";
import { saveErDashScore } from "@/app/actions";
import { downloadCertificate } from "@/lib/certificate";
import { playSound } from "./ClientFX";

type Patient = { id: string; complaint: string; room: RoomId | "any"; vip: boolean; remainingMs: number; maxMs: number };
type ShiftState = {
  waiting: Patient[];
  queue: PatientTemplate[];
  spawnedCount: number;
  spawnAcc: number;
  selectedId: string | null;
  hearts: number;
  chillUsed: boolean;
  chillRemaining: number;
  feedback: { text: string; kind: "good" | "bad" } | null;
};
type Phase = "intro" | "playing" | "interstitial" | "result";

// Each round takes its own slice of one shuffled deck, with the VIP at a fixed slot.
function buildQueue(deck: PatientTemplate[], index: number, total: number): PatientTemplate[] {
  const regularPerRound = total - 1;
  const regs = deck.slice(index * regularPerRound, (index + 1) * regularPerRound);
  const vipSlot = Math.floor(total / 2);
  return [...regs.slice(0, vipSlot), VIP_PATIENT, ...regs.slice(vipSlot)];
}

export default function ErDash({ slug, nickname, title, color, best }: { slug: string; nickname: string; title: string; color: string; best: { score: number; badge: boolean } }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [shiftIndex, setShiftIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [runDeck, setRunDeck] = useState<PatientTemplate[]>([]);
  const [shift, setShift] = useState<ShiftState | null>(null);
  const [interstitialText, setInterstitialText] = useState("");
  const [finalResult, setFinalResult] = useState<{ score: number; badge: boolean } | null>(null);

  function startShift(index: number, deck: PatientTemplate[]) {
    setShift({
      waiting: [],
      queue: buildQueue(deck, index, SHIFTS[index].totalPatients),
      spawnedCount: 0,
      spawnAcc: SHIFTS[index].spawnMs * 0.5,
      selectedId: null,
      hearts: STARTING_HEARTS,
      chillUsed: false,
      chillRemaining: 0,
      feedback: null,
    });
    setRunDeck(deck);
    setShiftIndex(index);
    setPhase("playing");
  }

  // the tick: decrements patience, pauses during chill, spawns new patients
  useEffect(() => {
    if (phase !== "playing") return;
    const cfg = SHIFTS[shiftIndex];
    const interval = setInterval(() => {
      setShift((prev) => {
        if (!prev) return prev;
        const chillActive = prev.chillRemaining > 0;
        const chillRemaining = chillActive ? Math.max(0, prev.chillRemaining - 100) : 0;

        let heartsLost = 0;
        let { selectedId } = prev;
        const nextWaiting: Patient[] = [];
        for (const p of prev.waiting) {
          if (chillActive) {
            nextWaiting.push(p);
            continue;
          }
          const rem = p.remainingMs - 100;
          if (rem <= 0) {
            heartsLost++;
            if (selectedId === p.id) selectedId = null;
          } else {
            nextWaiting.push({ ...p, remainingMs: rem });
          }
        }

        let spawnAcc = prev.spawnAcc + 100;
        let spawned = prev.spawnedCount;
        if (spawnAcc >= cfg.spawnMs && nextWaiting.length < cfg.maxWaiting && spawned < cfg.totalPatients) {
          spawnAcc = 0;
          const tpl = prev.queue[spawned];
          nextWaiting.push({
            id: `p${spawned}`,
            complaint: tpl.complaint,
            room: tpl.room,
            vip: !!tpl.vip,
            remainingMs: cfg.patienceMs,
            maxMs: cfg.patienceMs,
          });
          spawned++;
        }

        return {
          ...prev,
          waiting: nextWaiting,
          spawnedCount: spawned,
          spawnAcc,
          selectedId,
          hearts: Math.max(0, prev.hearts - heartsLost),
          chillRemaining,
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase, shiftIndex]);

  // shift-end detection
  useEffect(() => {
    if (phase !== "playing" || !shift) return;
    const cfg = SHIFTS[shiftIndex];
    if (shift.spawnedCount >= cfg.totalPatients && shift.waiting.length === 0) {
      setInterstitialText(NEET_NOTES[shiftIndex]);
      setPhase("interstitial");
    }
  }, [shift, phase, shiftIndex]);

  function selectPatient(id: string) {
    setShift((prev) => (prev ? { ...prev, selectedId: id } : prev));
  }

  function treat(room: RoomId) {
    if (!shift || !shift.selectedId) return;
    const patient = shift.waiting.find((p) => p.id === shift.selectedId);
    if (!patient) return;
    const correct = patient.room === "any" || patient.room === room;
    const points = correct ? (patient.vip ? POINTS_VIP : POINTS_CORRECT) : 0;
    setTotalScore((s) => s + points);
    setShift((prev) => {
      if (!prev) return prev;
      const hearts = correct ? (patient.vip ? Math.min(STARTING_HEARTS, prev.hearts + 1) : prev.hearts) : Math.max(0, prev.hearts - 1);
      return {
        ...prev,
        waiting: prev.waiting.filter((p) => p.id !== patient.id),
        selectedId: null,
        hearts,
        feedback: { text: correct ? (patient.vip ? "Iconic ✓" : "Treated ✓") : "Wrong room — she storms off 💨", kind: correct ? "good" : "bad" },
      };
    });
    playSound(correct ? "chime" : "soft");
    setTimeout(() => setShift((prev) => (prev ? { ...prev, feedback: null } : prev)), 1200);
  }

  function chillMode() {
    if (!shift || shift.chillUsed || shift.chillRemaining > 0) return;
    setShift((prev) => (prev ? { ...prev, chillUsed: true, chillRemaining: CHILL_MS } : prev));
    playSound("soft");
  }

  function interstitialContinue() {
    if (shiftIndex < SHIFTS.length - 1) {
      startShift(shiftIndex + 1, runDeck);
    } else {
      const badge = totalScore >= BADGE_SCORE;
      saveErDashScore(slug, totalScore, badge).catch(() => {});
      setFinalResult({ score: totalScore, badge });
      setPhase("result");
      playSound("chime");
    }
  }

  function playAgain() {
    setTotalScore(0);
    setFinalResult(null);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <div className="erdash-intro">
        <div className="erdash-doctor-wrap">
          <PranjaliAvatar pose="sassy" className="avatar-svg erdash-doctor-avatar" />
          <DoctorOverlay />
        </div>
        <h2 className="display">Dr. P&rsquo;s ER Dash 🚑</h2>
        <p className="muted">Chaos everywhere. She stays chill. Treat patients, save hearts, get through both rounds.</p>
        {best.score > 0 && (
          <p className="tiny muted">
            Best score: {best.score} {best.badge && "🥇"}
          </p>
        )}
        <button className="btn btn-primary" onClick={() => startShift(0, shuffle(PATIENT_TEMPLATES))} data-pop>
          Start Shift 1 — Calm Morning
        </button>
      </div>
    );
  }

  if (phase === "interstitial") {
    const isLast = shiftIndex >= SHIFTS.length - 1;
    return (
      <div className="erdash-interstitial">
        <p className="eyebrow">the chart says</p>
        <p className="erdash-neet-text hand">{interstitialText}</p>
        <button className="btn btn-primary" onClick={interstitialContinue} data-pop>
          {isLast ? "See your results" : `Start Shift ${shiftIndex + 2} — ${SHIFTS[shiftIndex + 1].name}`}
        </button>
      </div>
    );
  }

  if (phase === "result" && finalResult) {
    return (
      <div className="erdash-result">
        <h2 className="display">{title}, MBBS 🎓</h2>
        <p className="muted">Both rounds down. Chaos everywhere, and she never once lost her cool.</p>
        <p className="erdash-score">Final score: {finalResult.score}</p>
        <p className="tiny muted">Every patient was a different one. Chaos, but curated.</p>
        {finalResult.badge && <p className="hand" style={{ fontSize: "1.3rem", color: "var(--accent-deep)" }}>🥇 Gold Stethoscope Badge earned!</p>}
        <div className="confirm-actions">
          <button
            className="btn btn-primary"
            onClick={() => downloadCertificate({ nickname, title: `${title}, MBBS`, color, score: finalResult.score, badge: finalResult.badge })}
            data-pop
          >
            Download certificate
          </button>
          <button className="btn btn-ghost" onClick={playAgain}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  if (!shift) return null;
  const cfg = SHIFTS[shiftIndex];

  return (
    <div className="erdash-game">
      <div className="erdash-hud">
        <span className="erdash-hud-shift">
          Shift {shiftIndex + 1}: {cfg.name}
        </span>
        <span className="erdash-hud-score">Score: {totalScore}</span>
        <span className="erdash-hud-hearts" aria-label={`${shift.hearts} of ${STARTING_HEARTS} hearts`}>
          {"❤️".repeat(shift.hearts)}
          {"🤍".repeat(STARTING_HEARTS - shift.hearts)}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={chillMode} disabled={shift.chillUsed}>
          😌 Chill Mode
        </button>
      </div>

      {shift.chillRemaining > 0 && <p className="erdash-chill-banner hand">Time slows… 😌</p>}
      {shift.feedback && <p className={`erdash-feedback ${shift.feedback.kind}`}>{shift.feedback.text}</p>}

      <div className="erdash-waiting">
        {shift.waiting.length === 0 && <p className="tiny muted" style={{ gridColumn: "1/-1" }}>Waiting room&rsquo;s empty… for now.</p>}
        {shift.waiting.map((p) => (
          <button
            key={p.id}
            className={`erdash-patient ${shift.selectedId === p.id ? "selected" : ""} ${p.vip ? "vip" : ""}`}
            onClick={() => selectPatient(p.id)}
            data-pop="soft"
          >
            {p.vip && <ChaitanyaContact className="erdash-vip-avatar" />}
            <span className="erdash-bubble">{p.complaint}</span>
            <span className="erdash-patience" aria-hidden>
              <span style={{ width: `${Math.max(0, (p.remainingMs / p.maxMs) * 100)}%` }} />
            </span>
          </button>
        ))}
      </div>

      <div className="erdash-rooms">
        {ROOMS.map((r) => (
          <button key={r.id} className="erdash-room" disabled={!shift.selectedId} onClick={() => treat(r.id)}>
            <span aria-hidden>{r.icon}</span>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
