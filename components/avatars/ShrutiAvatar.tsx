import type { AvatarPose } from "./types";

const C = {
  skin: "#C98A60",
  skinShade: "#A96D47",
  blush: "#E8877C",
  hair: "#1B1213",
  hairHi: "#3D2A27",
  top: "#1E1A1C",
  skirt: "#F3BCD0",
  rose: "#C97B9C",
  roseDeep: "#9E4F72",
  petal: "#FFF1F5",
  rust: "#C9733D",
  brown: "#7A402B",
  gold: "#D8A93E",
  lips: "#B0506B",
  lens: "#4A2E3A",
  frame: "#8A5A44",
};

function Arm({ d }: { d: string }) {
  return (
    <path d={d} fill="none" stroke={C.skin} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
  );
}

function Bracelets({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <rect x={x - 6.5} y={y - 1.5} width={13} height={2.4} rx={1.2} fill={C.gold} />
      <rect x={x - 6.5} y={y + 2.2} width={13} height={1.8} rx={0.9} fill={C.gold} opacity={0.85} />
    </g>
  );
}

function MiniBouquet() {
  return (
    <g>
      <path d="M86 182 L114 182 L104 222 L96 222 Z" fill={C.petal} stroke={C.rose} strokeWidth={1.2} />
      {[
        [90, 176, C.rose],
        [100, 170, C.roseDeep],
        [110, 176, C.rose],
        [95, 181, "#F6D6E2"],
        [105, 181, "#E9A7BF"],
      ].map(([x, y, f], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r={6} fill={f as string} />
          <circle cx={x as number} cy={y as number} r={2.2} fill={C.petal} opacity={0.7} />
        </g>
      ))}
      <path d="M93 206 Q100 202 107 206 Q100 210 93 206 Z" fill={C.roseDeep} />
    </g>
  );
}

export default function ShrutiAvatar({ pose = "wave", className }: { pose?: AvatarPose; className?: string }) {
  const tilt = pose === "sassy" ? -9 : 0;

  // Arms drawn behind the torso
  const backArms =
    pose === "sassy" ? (
      <>
        <Arm d="M72 168 C68 184 74 198 88 204" />
        <Arm d="M128 168 C132 184 126 198 112 204" />
      </>
    ) : null;

  // Arms drawn in front
  let frontArms: React.ReactNode = null;
  if (pose === "wave") {
    frontArms = (
      <>
        <Arm d="M68 166 C54 156 46 140 47 120" />
        <ellipse cx={47} cy={113} rx={7.5} ry={8.5} fill={C.skin} />
        <path d="M41 108 L40 100 M45 105 L44 96 M49 105 L49 96 M53 107 L54 99" stroke={C.skin} strokeWidth={3.4} strokeLinecap="round" />
        <Bracelets x={47} y={126} angle={-4} />
        <Arm d="M132 166 C138 186 140 200 138 214" />
        <circle cx={138} cy={217} r={6} fill={C.skin} />
        <Bracelets x={139} y={206} angle={-6} />
      </>
    );
  } else if (pose === "bouquet") {
    frontArms = (
      <>
        <Arm d="M68 166 C64 186 76 198 93 200" />
        <Arm d="M132 166 C136 186 124 198 107 200" />
        <MiniBouquet />
        <circle cx={95} cy={200} r={5.5} fill={C.skin} />
        <circle cx={105} cy={200} r={5.5} fill={C.skin} />
        <Bracelets x={84} y={198} angle={70} />
      </>
    );
  } else if (pose === "idle") {
    frontArms = (
      <>
        <Arm d="M68 166 C62 186 60 200 62 214" />
        <circle cx={62} cy={217} r={6} fill={C.skin} />
        <Bracelets x={61} y={206} angle={6} />
        <Arm d="M132 166 C138 186 140 200 138 214" />
        <circle cx={138} cy={217} r={6} fill={C.skin} />
      </>
    );
  }

  return (
    <svg viewBox="0 0 200 284" className={className} role="img" aria-label="Shruti's avatar">
      {/* hair, back layer */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <path
          d="M58 94 C55 52 78 34 100 34 C122 34 146 52 142 96 C146 120 150 140 147 160 C151 172 146 182 140 187 C134 193 126 188 120 191 L80 191 C74 188 66 193 60 187 C54 182 49 172 53 160 C50 140 54 120 58 94 Z"
          fill={C.hair}
        />
        <path d="M57 128 C61 142 54 156 59 172" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M143 128 C139 142 146 156 141 172" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>

      {/* feet */}
      <g>
        <ellipse cx={89} cy={274} rx={8} ry={4.5} fill={C.skin} />
        <ellipse cx={111} cy={274} rx={8} ry={4.5} fill={C.skin} />
        <path d="M82 273 L96 273 M104 273 L118 273" stroke={C.gold} strokeWidth={1.6} />
      </g>

      {backArms}

      {/* neck + shoulders */}
      <rect x={91} y={126} width={18} height={30} rx={7} fill={C.skin} />
      <path d="M93 134 Q100 140 107 134 L107 140 Q100 145 93 140 Z" fill={C.skinShade} opacity={0.45} />
      <path d="M63 170 C65 155 80 148 100 148 C120 148 135 155 137 170 L131 178 L69 178 Z" fill={C.skin} />

      {/* necklace */}
      <path d="M90 146 Q100 159 110 146" fill="none" stroke={C.gold} strokeWidth={1.2} />
      <circle cx={100} cy={157} r={2.2} fill={C.gold} />

      {/* black top */}
      <path
        d="M73 158 C80 154 86 153 90 154 Q100 166 110 154 C114 153 120 154 127 158 C129 176 129 196 127 210 C116 214 84 214 73 210 C71 196 71 176 73 158 Z"
        fill={C.top}
      />
      <path d="M78 168 C80 186 80 198 79 208" stroke="#3A3236" strokeWidth={1.2} fill="none" opacity={0.7} />

      {/* floral skirt */}
      <path
        d="M75 205 L125 205 C134 228 142 250 147 267 C121 273 79 273 53 267 C58 250 66 228 75 205 Z"
        fill={C.skirt}
      />
      <g opacity={0.95}>
        <path d="M66 246 C72 236 84 240 82 250 C80 258 68 258 66 246 Z" fill={C.rust} opacity={0.75} />
        <path d="M118 222 C124 214 134 220 131 229 C128 236 116 232 118 222 Z" fill={C.brown} opacity={0.55} />
        {[
          [86, 222, 9, C.rose],
          [116, 248, 10, C.rose],
          [96, 258, 7, C.roseDeep],
          [130, 262, 6, "#E58FB0"],
          [72, 262, 6, C.roseDeep],
          [104, 232, 5, C.petal],
        ].map(([x, y, r, f], i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={(x as number) + Math.cos((a * Math.PI) / 180) * (r as number) * 0.55}
                cy={(y as number) + Math.sin((a * Math.PI) / 180) * (r as number) * 0.55}
                rx={(r as number) * 0.5}
                ry={(r as number) * 0.32}
                transform={`rotate(${a} ${(x as number) + Math.cos((a * Math.PI) / 180) * (r as number) * 0.55} ${(y as number) + Math.sin((a * Math.PI) / 180) * (r as number) * 0.55})`}
                fill={f as string}
              />
            ))}
            <circle cx={x as number} cy={y as number} r={(r as number) * 0.22} fill={C.petal} />
          </g>
        ))}
      </g>
      <path d="M75 205 L125 205 L126 211 L74 211 Z" fill={C.roseDeep} opacity={0.35} />

      {frontArms}

      {/* head */}
      <g transform={`rotate(${tilt} 100 140)`}>
        {/* ears + earrings */}
        <ellipse cx={60} cy={102} rx={6} ry={8.5} fill={C.skin} />
        <ellipse cx={140} cy={102} rx={6} ry={8.5} fill={C.skin} />
        <circle cx={60} cy={112} r={2.2} fill={C.gold} />
        <circle cx={140} cy={112} r={2.2} fill={C.gold} />

        {/* face */}
        <ellipse cx={100} cy={97} rx={40} ry={43} fill={C.skin} />

        {/* blush */}
        <ellipse cx={77} cy={113} rx={8} ry={4.5} fill={C.blush} opacity={0.45} />
        <ellipse cx={123} cy={113} rx={8} ry={4.5} fill={C.blush} opacity={0.45} />

        {/* brows */}
        <path d="M75 83 Q84 77 93 82" stroke={C.hair} strokeWidth={2.8} fill="none" strokeLinecap="round" />
        <path d="M107 82 Q116 77 125 83" stroke={C.hair} strokeWidth={2.8} fill="none" strokeLinecap="round" />

        {/* eyes */}
        <ellipse cx={85} cy={97} rx={5} ry={6.4} fill={C.hair} />
        <ellipse cx={115} cy={97} rx={5} ry={6.4} fill={C.hair} />
        <circle cx={86.8} cy={94.4} r={1.9} fill="#fff" />
        <circle cx={116.8} cy={94.4} r={1.9} fill="#fff" />
        <path d="M79 92 L76 89.5 M121 92 L124 89.5" stroke={C.hair} strokeWidth={1.6} strokeLinecap="round" />

        {/* nose + smile */}
        <path d="M100 101 Q97.5 109 101 110.5" stroke={C.skinShade} strokeWidth={1.7} fill="none" strokeLinecap="round" />
        <path d="M89 119 Q100 127 112 118" stroke={C.lips} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M112 118 Q114.5 117 115 115" stroke={C.skinShade} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.7} />

        {/* hair, front: center part framing the face */}
        <path d="M100 41 C82 42 63 58 60 90 C58 110 60 126 56 142 C66 130 68 112 70 92 C73 70 86 56 100 48 Z" fill={C.hair} />
        <path d="M100 41 C118 42 137 58 140 90 C142 110 140 126 144 142 C134 130 132 112 130 92 C127 70 114 56 100 48 Z" fill={C.hair} />
        <path d="M100 42 C92 44 82 50 76 60" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M100 42 C108 44 118 50 124 60" stroke={C.hairHi} strokeWidth={2} fill="none" strokeLinecap="round" />

        {/* sunnies on her head — her signature */}
        <g>
          <rect x={70} y={42} width={25} height={14} rx={6.5} fill={C.lens} stroke={C.frame} strokeWidth={2} transform="rotate(-6 82 49)" />
          <rect x={105} y={42} width={25} height={14} rx={6.5} fill={C.lens} stroke={C.frame} strokeWidth={2} transform="rotate(6 118 49)" />
          <path d="M94 47 Q100 44 106 47" stroke={C.frame} strokeWidth={2.4} fill="none" />
          <path d="M75 47 L85 45.5" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.75} />
          <path d="M110 45.5 L120 47" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.75} />
        </g>
      </g>

      {/* long locks falling over the shoulders, in front */}
      <g transform={`rotate(${tilt} 100 140)`}>
        <path d="M61 104 C54 128 56 154 64 182 C70 172 71 152 68 130 C67 120 66 110 61 104 Z" fill={C.hair} />
        <path d="M139 104 C146 128 144 154 136 182 C130 172 129 152 132 130 C133 120 134 110 139 104 Z" fill={C.hair} />
      </g>
    </svg>
  );
}
