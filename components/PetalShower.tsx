const PETALS = [
  { left: 4, delay: 0, dur: 2.6 },
  { left: 14, delay: 0.15, dur: 2.2 },
  { left: 24, delay: 0.3, dur: 2.8 },
  { left: 34, delay: 0.05, dur: 2.4 },
  { left: 44, delay: 0.4, dur: 2.9 },
  { left: 54, delay: 0.2, dur: 2.3 },
  { left: 64, delay: 0.35, dur: 2.6 },
  { left: 74, delay: 0.1, dur: 2.5 },
  { left: 84, delay: 0.25, dur: 2.7 },
  { left: 94, delay: 0.45, dur: 2.4 },
  { left: 50, delay: 0.5, dur: 3 },
  { left: 20, delay: 0.55, dur: 2.5 },
];

/** A one-time filmy petal shower on arrival — purely decorative. */
export default function PetalShower() {
  return (
    <div className="petal-shower" aria-hidden>
      {PETALS.map((p, i) => (
        <span key={i} className="petal" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}>
          🌸
        </span>
      ))}
    </div>
  );
}
