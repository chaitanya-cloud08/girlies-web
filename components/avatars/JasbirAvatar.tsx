import type { AvatarPose } from "./types";

const C = {
  skin: "#EFC6A6",
  skinShade: "#D49F7E",
  blush: "#F29C9C",
  hair: "#1A1214",
  hairHi: "#3B2A29",
  dress: "#FFFFFF",
  dressLine: "#E6DADF",
  eyelet: "#E9DDE3",
  pink: "#F2B1D3",
  gold: "#D2A548",
  silver: "#C9C9CF",
  lips: "#C76A7C",
  shoe: "#1C1719",
};

function Arm({ d }: { d: string }) {
  return <path d={d} fill="none" stroke={C.skin} strokeWidth={10.5} strokeLinecap="round" strokeLinejoin="round" />;
}

function MiniBouquet() {
  return (
    <g>
      <path d="M86 186 L114 186 L104 224 L96 224 Z" fill="#FFF6FA" stroke={C.pink} strokeWidth={1.2} />
      {[
        [90, 180, C.pink],
        [100, 174, "#B08BD6"],
        [110, 180, C.pink],
        [95, 185, "#FFFFFF"],
        [105, 185, "#F7CFE2"],
      ].map(([x, y, f], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r={6} fill={f as string} stroke="#EAD8E1" strokeWidth={0.6} />
          <circle cx={x as number} cy={y as number} r={2} fill="#F6D24A" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

export default function JasbirAvatar({ pose = "wave", className }: { pose?: AvatarPose; className?: string }) {
  // "sassy" = her signature hair-tuck pose from the photos
  const tilt = pose === "sassy" ? 6 : 0;

  let frontArms: React.ReactNode = null;
  let overHead: React.ReactNode = null;

  if (pose === "wave") {
    frontArms = (
      <>
        <Arm d="M68 170 C54 160 46 144 47 124" />
        <ellipse cx={47} cy={117} rx={7} ry={8} fill={C.skin} />
        <path d="M41 112 L40 104 M45 109 L44 100 M49 109 L49 100 M53 111 L54 103" stroke={C.skin} strokeWidth={3.2} strokeLinecap="round" />
        <rect x={40.5} y={128} width={13} height={3} rx={1.5} fill={C.gold} />
        <Arm d="M132 170 C138 188 140 202 138 216" />
        <circle cx={138} cy={219} r={5.8} fill={C.skin} />
        <rect x={132} y={207} width={13} height={3.4} rx={1.7} fill={C.silver} />
      </>
    );
  } else if (pose === "sassy") {
    frontArms = (
      <>
        <Arm d="M68 170 C62 188 60 202 62 216" />
        <circle cx={62} cy={219} r={5.8} fill={C.skin} />
        <rect x={55} y={207} width={13} height={3.4} rx={1.7} fill={C.silver} />
      </>
    );
    overHead = (
      <>
        <Arm d="M132 170 C152 160 154 136 141 112" />
        <ellipse cx={140} cy={106} rx={7} ry={7.5} fill={C.skin} />
        <path d="M134 102 L130 96 M138 100 L135 93 M142 100 L141 93" stroke={C.skin} strokeWidth={3} strokeLinecap="round" />
        <rect x={140} y={124} width={13} height={3} rx={1.5} fill={C.gold} transform="rotate(-60 146 125)" />
      </>
    );
  } else if (pose === "bouquet") {
    frontArms = (
      <>
        <Arm d="M68 170 C64 188 76 200 93 203" />
        <Arm d="M132 170 C136 188 124 200 107 203" />
        <MiniBouquet />
        <circle cx={95} cy={203} r={5.5} fill={C.skin} />
        <circle cx={105} cy={203} r={5.5} fill={C.skin} />
      </>
    );
  } else {
    frontArms = (
      <>
        <Arm d="M68 170 C62 188 60 202 62 216" />
        <circle cx={62} cy={219} r={5.8} fill={C.skin} />
        <Arm d="M132 170 C138 188 140 202 138 216" />
        <circle cx={138} cy={219} r={5.8} fill={C.skin} />
        <rect x={132} y={207} width={13} height={3.4} rx={1.7} fill={C.silver} />
      </>
    );
  }

  const eyelets: React.ReactNode[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      eyelets.push(<circle key={`${row}-${col}`} cx={81 + col * 6.3 + (row % 2) * 3} cy={168 + row * 6.5} r={1.5} fill={C.eyelet} />);
    }
  }

  return (
    <svg viewBox="0 0 200 284" className={className} role="img" aria-label="Jasbir's avatar">
      {/* very long straight hair, back layer */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <path
          d="M58 94 C55 52 78 34 100 34 C122 34 146 52 142 96 C144 140 147 190 149 232 C140 237 130 233 121 237 L79 237 C70 233 60 237 51 232 C53 190 56 140 58 94 Z"
          fill={C.hair}
        />
        <path d="M60 140 C59 170 58 200 57 226" stroke={C.hairHi} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d="M140 140 C141 170 142 200 143 226" stroke={C.hairHi} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </g>

      {/* legs + black heels */}
      <rect x={88} y={252} width={9} height={22} rx={4} fill={C.skin} />
      <rect x={103} y={252} width={9} height={22} rx={4} fill={C.skin} />
      <path d="M85 274 C85 270 99 270 99 274 L99 279 L85 279 Z" fill={C.shoe} />
      <path d="M101 274 C101 270 115 270 115 274 L115 279 L101 279 Z" fill={C.shoe} />
      <path d="M87 268 L97 268" stroke={C.shoe} strokeWidth={1.6} />
      <path d="M103 268 L113 268" stroke={C.shoe} strokeWidth={1.6} />

      {/* neck + shoulders */}
      <rect x={91} y={126} width={18} height={32} rx={7} fill={C.skin} />
      <path d="M93 134 Q100 140 107 134 L107 140 Q100 145 93 140 Z" fill={C.skinShade} opacity={0.4} />
      <path d="M64 172 C66 157 80 150 100 150 C120 150 134 157 136 172 L130 180 L70 180 Z" fill={C.skin} />

      {/* dainty necklace */}
      <path d="M91 147 Q100 160 109 147" fill="none" stroke={C.gold} strokeWidth={1} />
      <circle cx={100} cy={158} r={1.8} fill={C.gold} />

      {/* white eyelet dress: bodice */}
      <path d="M73 160 C80 157 86 158 89 162 L111 162 C114 158 120 157 127 160 C129 174 129 186 128 198 L72 198 C71 186 71 174 73 160 Z" fill={C.dress} stroke={C.dressLine} strokeWidth={1} />
      {eyelets}
      {/* tie at the neckline */}
      <path d="M97 163 Q100 166 103 163 M100 165 L98 175 M100 165 L102 175" stroke={C.dressLine} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      {/* waist tie */}
      <rect x={72} y={196} width={56} height={4} rx={2} fill={C.dress} stroke={C.dressLine} strokeWidth={1} />

      {/* skirt with lace band + ruffle */}
      <path d="M72 199 L128 199 C135 218 141 236 145 252 C121 258 79 258 55 252 C59 236 65 218 72 199 Z" fill={C.dress} stroke={C.dressLine} strokeWidth={1} />
      <path d="M86 204 C84 220 82 236 80 250 M114 204 C116 220 118 236 120 250" stroke={C.dressLine} strokeWidth={0.9} fill="none" />
      <path d="M58 241 C80 246 120 246 142 241" stroke={C.dressLine} strokeWidth={1} fill="none" />
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse key={i} cx={63 + i * 6.8} cy={243.5 + Math.sin((i / 11) * Math.PI) * 1.5} rx={1.8} ry={1.1} fill={C.eyelet} />
      ))}
      <path d="M55 252 Q60 257 65 252 Q70 257 75 252 Q80 257 85 252 Q90 257 95 252 Q100 257 105 252 Q110 257 115 252 Q120 257 125 252 Q130 257 135 252 Q140 257 145 252" fill={C.dress} stroke={C.dressLine} strokeWidth={1} />

      {/* puff sleeves */}
      <ellipse cx={70} cy={166} rx={11} ry={9} fill={C.dress} stroke={C.dressLine} strokeWidth={1} />
      <ellipse cx={130} cy={166} rx={11} ry={9} fill={C.dress} stroke={C.dressLine} strokeWidth={1} />

      {frontArms}

      {/* head */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <ellipse cx={60} cy={102} rx={6} ry={8.5} fill={C.skin} />
        <ellipse cx={140} cy={102} rx={6} ry={8.5} fill={C.skin} />
        {/* gold hoops */}
        <circle cx={60} cy={114} r={3.4} fill="none" stroke={C.gold} strokeWidth={1.8} />
        <circle cx={140} cy={114} r={3.4} fill="none" stroke={C.gold} strokeWidth={1.8} />

        <ellipse cx={100} cy={97} rx={40} ry={43} fill={C.skin} />
        <ellipse cx={77} cy={114} rx={8} ry={4.5} fill={C.blush} opacity={0.5} />
        <ellipse cx={123} cy={114} rx={8} ry={4.5} fill={C.blush} opacity={0.5} />

        <path d="M75 82 Q84 77 93 81" stroke={C.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M107 81 Q116 77 125 82" stroke={C.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />

        {/* soft happy eyes */}
        <path d="M80 98 Q85 92 90 98" stroke={C.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        <path d="M110 98 Q115 92 120 98" stroke={C.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />

        {/* round gold glasses */}
        <circle cx={85} cy={97} r={11} fill="#FFFFFF" fillOpacity={0.18} stroke={C.gold} strokeWidth={1.7} />
        <circle cx={115} cy={97} r={11} fill="#FFFFFF" fillOpacity={0.18} stroke={C.gold} strokeWidth={1.7} />
        <path d="M96 95 Q100 92 104 95" stroke={C.gold} strokeWidth={1.5} fill="none" />
        <path d="M74 95 L62 93 M126 95 L138 93" stroke={C.gold} strokeWidth={1.3} />
        <path d="M79 90 L83 88" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
        <path d="M109 90 L113 88" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />

        <path d="M100 104 Q98 110 101 111.5" stroke={C.skinShade} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <path d="M90 119 Q100 127 110 119" stroke={C.lips} strokeWidth={2.8} fill="none" strokeLinecap="round" />

        {/* sleek centre part */}
        <path d="M100 40 C83 41 63 56 60 88 C58 110 60 128 57 146 C66 132 68 112 70 92 C73 70 86 55 100 47 Z" fill={C.hair} />
        <path d="M100 40 C117 41 137 56 140 88 C142 110 140 128 143 146 C134 132 132 112 130 92 C127 70 114 55 100 47 Z" fill={C.hair} />
        <path d="M100 41 C92 43 82 49 76 59" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M100 41 C108 43 118 49 124 59" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>

      {/* long straight locks in front of the shoulders */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <path d="M61 104 C55 134 57 172 63 214 C69 200 70 168 68 134 C67 122 66 110 61 104 Z" fill={C.hair} />
        {pose !== "sassy" && <path d="M139 104 C145 134 143 172 137 214 C131 200 130 168 132 134 C133 122 134 110 139 104 Z" fill={C.hair} />}
      </g>

      {overHead}
    </svg>
  );
}
