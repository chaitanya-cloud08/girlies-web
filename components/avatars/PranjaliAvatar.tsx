import type { AvatarPose } from "./types";

const C = {
  skin: "#D9A07E",
  skinShade: "#B97E5D",
  blush: "#E58A80",
  hair: "#16100F",
  hairHi: "#382624",
  top: "#C9DDF4",
  topLine: "#A9C3E3",
  floral: "#3F78C6",
  floralLight: "#FFFFFF",
  skirt: "#FFFFFF",
  skirtLine: "#E4DCE0",
  eyelet: "#E7E0E4",
  lips: "#B3263A",
  gold: "#D2A548",
};

/** Long blue floral puff sleeve with a ruffle cuff, ending in a hand. */
function Sleeve({ d, hand, cuffAngle = 0 }: { d: string; hand: [number, number]; cuffAngle?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke={C.topLine} strokeWidth={14.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={C.top} strokeWidth={12.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={C.floral} strokeWidth={2.2} strokeDasharray="0.1 5.5" strokeLinecap="round" />
      <ellipse cx={hand[0]} cy={hand[1] - 6} rx={9} ry={4.5} fill={C.top} stroke={C.topLine} strokeWidth={1} transform={`rotate(${cuffAngle} ${hand[0]} ${hand[1] - 6})`} />
      <circle cx={hand[0]} cy={hand[1] + 1} r={5.6} fill={C.skin} />
    </g>
  );
}

function MiniBouquet() {
  return (
    <g>
      <path d="M86 186 L114 186 L104 224 L96 224 Z" fill="#FFF4F6" stroke="#B3263A" strokeWidth={1.1} />
      {[
        [90, 180, "#F4A7C0"],
        [100, 174, "#780101"],
        [110, 180, "#F4A7C0"],
        [95, 185, "#FFFFFF"],
        [105, 185, "#F7C8D6"],
      ].map(([x, y, f], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r={6} fill={f as string} stroke="#EAD8E1" strokeWidth={0.6} />
          <circle cx={x as number} cy={y as number} r={2} fill="#F6D24A" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

export default function PranjaliAvatar({ pose = "wave", className }: { pose?: AvatarPose; className?: string }) {
  // "sassy" = hand on hip, a little head tilt: baddie energy
  const tilt = pose === "sassy" ? -5 : 0;

  let arms: React.ReactNode;
  if (pose === "wave") {
    arms = (
      <>
        <Sleeve d="M68 168 C54 158 46 142 47 126" hand={[47, 116]} cuffAngle={-10} />
        <path d="M41 111 L40 103 M45 108 L44 99 M49 108 L49 99 M53 110 L54 102" stroke={C.skin} strokeWidth={3.2} strokeLinecap="round" />
        <Sleeve d="M132 168 C139 186 141 200 139 212" hand={[139, 219]} />
      </>
    );
  } else if (pose === "sassy") {
    arms = (
      <>
        <Sleeve d="M68 168 C62 186 60 200 62 212" hand={[62, 219]} />
        <Sleeve d="M132 168 C152 178 152 192 134 197" hand={[128, 198]} cuffAngle={70} />
      </>
    );
  } else if (pose === "bouquet") {
    arms = (
      <>
        <Sleeve d="M68 168 C64 186 76 198 92 201" hand={[95, 203]} cuffAngle={70} />
        <Sleeve d="M132 168 C136 186 124 198 108 201" hand={[105, 203]} cuffAngle={-70} />
        <MiniBouquet />
        <circle cx={95} cy={204} r={5.6} fill={C.skin} />
        <circle cx={105} cy={204} r={5.6} fill={C.skin} />
      </>
    );
  } else {
    arms = (
      <>
        <Sleeve d="M68 168 C62 186 60 200 62 212" hand={[62, 219]} />
        <Sleeve d="M132 168 C139 186 141 200 139 212" hand={[139, 219]} />
      </>
    );
  }

  const prints: React.ReactNode[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 77 + col * 6.4 + (row % 2) * 3.2;
      const y = 166 + row * 6;
      prints.push(<circle key={`${row}-${col}`} cx={x} cy={y} r={1.3} fill={(row + col) % 3 ? C.floral : C.floralLight} />);
    }
  }

  return (
    <svg viewBox="0 0 200 284" className={className} role="img" aria-label="Pranjali's avatar">
      {/* very long straight hair, back layer */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <path
          d="M58 94 C55 52 78 34 100 34 C122 34 146 52 142 96 C144 140 147 186 148 226 C139 231 130 227 121 231 L79 231 C70 227 61 231 52 226 C53 186 56 140 58 94 Z"
          fill={C.hair}
        />
        <path d="M60 140 C59 168 58 196 57 220" stroke={C.hairHi} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d="M140 140 C141 168 142 196 143 220" stroke={C.hairHi} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </g>

      {/* neck + shoulders (square neckline shows collarbones) */}
      <rect x={91} y={126} width={18} height={32} rx={7} fill={C.skin} />
      <path d="M93 134 Q100 140 107 134 L107 140 Q100 145 93 140 Z" fill={C.skinShade} opacity={0.4} />
      <path d="M64 170 C66 155 80 149 100 149 C120 149 134 155 136 170 L130 178 L70 178 Z" fill={C.skin} />
      <path d="M86 156 Q92 158 96 157 M104 157 Q108 158 114 156" stroke={C.skinShade} strokeWidth={1} fill="none" opacity={0.6} />

      {/* blue floral crop top, square neckline */}
      <path d="M71 160 L129 160 C130 174 130 186 128 196 L72 196 C70 186 70 174 71 160 Z" fill={C.top} stroke={C.topLine} strokeWidth={1} />
      {prints}
      <path d="M71 160 L129 160" stroke={C.topLine} strokeWidth={2} />
      <path d="M72 188 L128 188" stroke={C.topLine} strokeWidth={1} />
      {/* peek of midriff */}
      <rect x={74} y={196} width={52} height={4} fill={C.skin} />

      {/* white eyelet tiered maxi skirt */}
      <path d="M73 200 L127 200 C133 222 139 246 145 276 C121 281 79 281 55 276 C61 246 67 222 73 200 Z" fill={C.skirt} stroke={C.skirtLine} strokeWidth={1} />
      <rect x={73} y={199} width={54} height={5} rx={1.5} fill={C.skirt} stroke={C.skirtLine} strokeWidth={0.9} />
      <path d="M66 232 C88 236 112 236 134 232" stroke={C.skirtLine} strokeWidth={1.4} fill="none" />
      <path d="M60 256 C86 261 114 261 140 256" stroke={C.skirtLine} strokeWidth={1.4} fill="none" />
      {[
        [86, 218], [112, 216], [98, 226], [78, 246], [104, 247], [124, 244], [90, 266], [116, 268], [68, 268], [134, 266],
      ].map(([x, y], i) => (
        <g key={i}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 3} cy={y + Math.sin((a * Math.PI) / 180) * 3} r={1.1} fill={C.eyelet} />
          ))}
          <circle cx={x} cy={y} r={1.1} fill={C.eyelet} />
        </g>
      ))}

      {arms}

      {/* head */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <ellipse cx={60} cy={102} rx={6} ry={8.5} fill={C.skin} />
        <ellipse cx={140} cy={102} rx={6} ry={8.5} fill={C.skin} />
        <circle cx={60} cy={114} r={3.6} fill="none" stroke={C.gold} strokeWidth={2} />
        <circle cx={140} cy={114} r={3.6} fill="none" stroke={C.gold} strokeWidth={2} />

        <ellipse cx={100} cy={97} rx={41} ry={43} fill={C.skin} />
        <ellipse cx={77} cy={113} rx={8} ry={4.5} fill={C.blush} opacity={0.5} />
        <ellipse cx={123} cy={113} rx={8} ry={4.5} fill={C.blush} opacity={0.5} />

        {/* defined brows */}
        <path d="M74 82 Q84 75 94 80" stroke={C.hair} strokeWidth={3.2} fill="none" strokeLinecap="round" />
        <path d="M106 80 Q116 75 126 82" stroke={C.hair} strokeWidth={3.2} fill="none" strokeLinecap="round" />

        {/* eyes with a little wing */}
        <ellipse cx={85} cy={97} rx={4.8} ry={6} fill={C.hair} />
        <ellipse cx={115} cy={97} rx={4.8} ry={6} fill={C.hair} />
        <circle cx={86.6} cy={94.6} r={1.8} fill="#fff" />
        <circle cx={116.6} cy={94.6} r={1.8} fill="#fff" />
        <path d="M79 93 L75 90.5 M121 93 L125 90.5" stroke={C.hair} strokeWidth={1.8} strokeLinecap="round" />


        <path d="M100 103 Q98 109 101 110.5" stroke={C.skinShade} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* red lip, confident smile */}
        <path d="M90 118 Q100 126 110 118 Q100 122 90 118 Z" fill={C.lips} stroke={C.lips} strokeWidth={1.6} strokeLinejoin="round" />

        {/* sleek centre part */}
        <path d="M100 40 C83 41 63 56 60 88 C58 110 60 128 57 146 C66 132 68 112 70 92 C73 70 86 55 100 47 Z" fill={C.hair} />
        <path d="M100 40 C117 41 137 56 140 88 C142 110 140 128 143 146 C134 132 132 112 130 92 C127 70 114 55 100 47 Z" fill={C.hair} />
        <path d="M100 41 C92 43 82 49 76 59" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M100 41 C108 43 118 49 124 59" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>

      {/* long locks in front, one side over the shoulder like her photo */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <path d="M61 104 C54 134 56 170 62 208 C68 194 70 164 68 132 C67 120 66 110 61 104 Z" fill={C.hair} />
      </g>
    </svg>
  );
}
