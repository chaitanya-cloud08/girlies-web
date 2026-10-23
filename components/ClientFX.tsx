"use client";
import { useEffect, useRef, useState } from "react";

/** Sparkle cursor trail + soft "pop" sounds on anything with data-pop. Mute toggle bottom-right. */
type Drop = { glyph: string; left: number; delay: number; dur: number; rot: number };

export const RAIN_DURATION_MS = 2100;

export default function ClientFX() {
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const [rain, setRain] = useState<Drop[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const rainTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("girlies-muted");
      const m = saved === null ? false : saved === "1";
      setMuted(m);
      mutedRef.current = m;
    } catch {}
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    try {
      localStorage.setItem("girlies-muted", muted ? "1" : "0");
    } catch {}
  }, [muted]);

  // sounds
  useEffect(() => {
    function pop(kind: string) {
      if (mutedRef.current) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current ??= new Ctx();
        const ctx = ctxRef.current;
        const notes = kind === "chime" ? [880, 1175, 1568] : kind === "soft" ? [520] : [660, 990];
        notes.forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = f;
          const t = ctx.currentTime + i * 0.07;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
          o.connect(g).connect(ctx.destination);
          o.start(t);
          o.stop(t + 0.25);
        });
      } catch {}
    }
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-pop]");
      if (el) pop(el.dataset.pop || "pop");
    }
    const onCustom = (e: Event) => pop((e as CustomEvent).detail || "chime");
    document.addEventListener("click", onClick);
    window.addEventListener("girlies-sound", onCustom);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("girlies-sound", onCustom);
    };
  }, []);

  // rain easter eggs (fries, cookies, whatever a girl's content declares)
  useEffect(() => {
    function onRain(e: Event) {
      const glyphs = ((e as CustomEvent).detail?.glyphs as string[] | undefined) ?? ["✨"];
      rainTimers.current.forEach(clearTimeout);
      rainTimers.current = [];
      const batch: Drop[] = Array.from({ length: 26 }, () => ({
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        left: Math.random() * 94,
        delay: Math.random() * 0.4,
        dur: 1.3 + Math.random() * 0.7,
        rot: (Math.random() - 0.5) * 720,
      }));
      setRain(batch);
      const fallTime = setTimeout(() => setRain(null), RAIN_DURATION_MS);
      rainTimers.current.push(fallTime);
    }
    function onToast(e: Event) {
      const message = (e as CustomEvent).detail as string;
      setToast(message);
      playSound("chime");
      const hide = setTimeout(() => setToast(null), 2200);
      rainTimers.current.push(hide);
    }
    window.addEventListener("girlies-rain", onRain);
    window.addEventListener("girlies-toast", onToast);
    return () => {
      window.removeEventListener("girlies-rain", onRain);
      window.removeEventListener("girlies-toast", onToast);
      rainTimers.current.forEach(clearTimeout);
    };
  }, []);

  // sparkle trail (fine pointers only, respects reduced motion)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    const glyphs = ["✦", "✧", "♡", "⋆"];
    function move(e: PointerEvent) {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 30}px`);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      {rain && (
        <div className="fries-rain" aria-hidden>
          {rain.map((d, i) => (
            <span
              key={i}
              className="fry"
              style={{
                left: `${d.left}%`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.dur}s`,
                ["--rot" as string]: `${d.rot}deg`,
              }}
            >
              {d.glyph}
            </span>
          ))}
        </div>
      )}
      {toast && (
        <div className="cravings-toast" role="status">
          {toast}
        </div>
      )}
      <button
        className="sound-toggle"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Turn sounds on" : "Turn sounds off"}
        title={muted ? "Sounds off" : "Sounds on"}
      >
        {muted ? "🔇" : "🔔"}
      </button>
    </>
  );
}

export function playSound(kind: "pop" | "chime" | "soft" = "chime") {
  window.dispatchEvent(new CustomEvent("girlies-sound", { detail: kind }));
}

export function triggerRain(glyphs: string[]) {
  window.dispatchEvent(new CustomEvent("girlies-rain", { detail: { glyphs } }));
}

export function triggerToast(message: string) {
  window.dispatchEvent(new CustomEvent("girlies-toast", { detail: message }));
}
