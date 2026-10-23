import { FlowerHead } from "./Flower";
import { RIBBONS, WRAPS, type FlowerId } from "@/lib/flowers";

// Where each stem's flower sits, filled centre-first.
const SLOTS: [number, number][] = [
  [150, 122], [118, 130], [182, 130], [134, 96], [166, 96], [98, 154],
  [202, 154], [150, 76], [108, 104], [192, 104], [128, 162], [172, 162],
];
const STEM_BASE: [number, number] = [150, 268];

export default function Bouquet({
  flowers,
  wrap,
  ribbon,
  className,
}: {
  flowers: FlowerId[];
  wrap: string;
  ribbon: string;
  className?: string;
}) {
  const w = WRAPS.find((x) => x.id === wrap) ?? WRAPS[0];
  const r = RIBBONS.find((x) => x.id === ribbon) ?? RIBBONS[0];
  const placed = flowers.slice(0, SLOTS.length).map((id, i) => ({ id, x: SLOTS[i][0], y: SLOTS[i][1], i }));
  const byDepth = [...placed].sort((a, b) => a.y - b.y);

  return (
    <svg viewBox="40 40 220 300" className={className} role="img" aria-label="A bouquet">
      {/* back paper */}
      <path d="M72 150 Q150 104 228 150 L156 300 L144 300 Z" fill={w.edge} opacity={0.9} />

      {/* stems + leaves */}
      {placed.map((f) => (
        <path
          key={`s${f.i}`}
          d={`M${f.x} ${f.y} Q${(f.x + STEM_BASE[0]) / 2} ${(f.y + STEM_BASE[1]) / 2 + 10} ${STEM_BASE[0]} ${STEM_BASE[1]}`}
          stroke="#5E8C5A"
          strokeWidth={2.6}
          fill="none"
        />
      ))}
      {placed.length > 0 && (
        <>
          <path d="M150 200 C130 186 116 190 108 198 C122 204 138 206 150 200 Z" fill="#7BA56F" />
          <path d="M150 196 C170 182 184 186 192 194 C178 200 162 202 150 196 Z" fill="#6A9761" />
        </>
      )}

      {/* front cone */}
      <path d="M90 178 Q150 200 210 178 L156 318 L144 318 Z" fill={w.fill} stroke={w.edge} strokeWidth={1.5} />
      <path d="M118 192 L148 312" stroke={w.edge} strokeWidth={1} opacity={0.6} />

      {/* heads */}
      {byDepth.map((f) => (
        <g key={`h${f.i}`} transform={`translate(${f.x} ${f.y}) scale(1.15)`}>
          <FlowerHead id={f.id} />
        </g>
      ))}

      {/* bow */}
      <g transform={`translate(${STEM_BASE[0]} ${STEM_BASE[1]})`}>
        <path d="M-2 2 L-14 34 L-6 30 L-2 36 Z" fill={r.color} stroke="rgba(0,0,0,.15)" strokeWidth={0.6} />
        <path d="M2 2 L14 34 L6 30 L2 36 Z" fill={r.color} stroke="rgba(0,0,0,.15)" strokeWidth={0.6} />
        <ellipse cx={-13} cy={-2} rx={13} ry={8} fill={r.color} stroke="rgba(0,0,0,.15)" strokeWidth={0.6} transform="rotate(-18 -13 -2)" />
        <ellipse cx={13} cy={-2} rx={13} ry={8} fill={r.color} stroke="rgba(0,0,0,.15)" strokeWidth={0.6} transform="rotate(18 13 -2)" />
        <circle r={5.5} fill={r.color} stroke="rgba(0,0,0,.2)" strokeWidth={0.6} />
      </g>

      {flowers.length === 0 && (
        <text x={150} y={130} textAnchor="middle" fontSize={13} fill="#9a7a86" fontFamily="var(--font-hand), cursive">
          pick some flowers ✿
        </text>
      )}
    </svg>
  );
}
