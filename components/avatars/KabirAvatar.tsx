const C = {
  skin: "#D9A273",
  skinShade: "#B97F4F",
  blush: "#E09A78",
  hair: "#241A16",
  hairHi: "#3F2E26",
  hoodie: "#8A8D96",
  hoodieShade: "#6E7079",
  hoodieString: "#4A4C52",
  lips: "#B06A54",
};

export type KabirMood = "smirk" | "soft" | "surprised";

export default function KabirAvatar({ mood = "smirk", className }: { mood?: KabirMood; className?: string }) {
  return (
    <svg viewBox="0 0 200 284" className={className} role="img" aria-label="Kabir">
      {/* hair, back */}
      <path d="M62 86 C60 56 78 40 100 40 C122 40 140 56 138 86 C139 100 139 112 136 122 L64 122 C61 112 61 100 62 86 Z" fill={C.hair} />

      {/* hoodie body */}
      <path d="M58 170 C60 150 78 140 100 140 C122 140 140 150 142 170 C146 200 150 234 152 262 C128 270 72 270 48 262 C50 234 54 200 58 170 Z" fill={C.hoodie} />
      <path d="M100 140 C106 150 110 162 100 174 C90 162 94 150 100 140 Z" fill={C.hoodieShade} />
      <path d="M86 148 L84 190 M114 148 L116 190" stroke={C.hoodieString} strokeWidth={2} strokeLinecap="round" />
      <circle cx={84} cy={192} r={2.2} fill={C.hoodieShade} />
      <circle cx={116} cy={192} r={2.2} fill={C.hoodieShade} />

      {/* hood resting on shoulders */}
      <path d="M62 150 C66 138 80 132 100 132 C120 132 134 138 138 150 C130 146 118 150 112 158 C106 150 94 150 88 158 C82 150 70 146 62 150 Z" fill={C.hoodieShade} />

      {/* arms */}
      <path d="M58 172 C44 182 38 198 40 216" fill="none" stroke={C.hoodie} strokeWidth={15} strokeLinecap="round" />
      <path d="M142 172 C156 182 162 198 160 216" fill="none" stroke={C.hoodie} strokeWidth={15} strokeLinecap="round" />
      <circle cx={40} cy={219} r={6.5} fill={C.skin} />
      <circle cx={160} cy={219} r={6.5} fill={C.skin} />

      {/* neck */}
      <rect x={90} y={118} width={20} height={26} rx={8} fill={C.skin} />

      {/* ears */}
      <ellipse cx={61} cy={100} rx={5.5} ry={7.5} fill={C.skin} />
      <ellipse cx={139} cy={100} rx={5.5} ry={7.5} fill={C.skin} />

      {/* face */}
      <ellipse cx={100} cy={96} rx={38} ry={40} fill={C.skin} />
      <ellipse cx={79} cy={111} rx={7} ry={4} fill={C.blush} opacity={0.4} />
      <ellipse cx={121} cy={111} rx={7} ry={4} fill={C.blush} opacity={0.4} />

      {mood === "smirk" && (
        <>
          <path d="M77 80 Q85 74 94 79" stroke={C.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d="M106 77 Q115 72 124 77" stroke={C.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <ellipse cx={85} cy={95} rx={4.4} ry={5.6} fill={C.hair} />
          <ellipse cx={115} cy={95} rx={4.4} ry={5.6} fill={C.hair} />
          <path d="M89 118 Q100 122 112 113" stroke={C.lips} strokeWidth={2.8} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "soft" && (
        <>
          <path d="M78 82 Q85 78 93 81" stroke={C.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d="M107 81 Q115 78 122 82" stroke={C.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d="M80 96 Q85 91 90 96" stroke={C.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d="M110 96 Q115 91 120 96" stroke={C.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d="M89 118 Q100 125 111 118" stroke={C.lips} strokeWidth={2.8} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "surprised" && (
        <>
          <path d="M77 78 Q85 73 94 77" stroke={C.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d="M106 77 Q115 73 123 78" stroke={C.hair} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <circle cx={85} cy={96} r={5} fill={C.hair} />
          <circle cx={115} cy={96} r={5} fill={C.hair} />
          <ellipse cx={100} cy={120} rx={5} ry={6} fill={C.lips} opacity={0.85} />
        </>
      )}

      <path d="M100 103 Q98 109 101 110.5" stroke={C.skinShade} strokeWidth={1.6} fill="none" strokeLinecap="round" />

      {/* short hair, front */}
      <path d="M100 38 C78 39 62 54 60 80 C59 90 61 98 58 108 C68 98 70 84 72 70 C76 54 88 44 100 44 Z" fill={C.hair} />
      <path d="M100 38 C122 39 138 54 140 80 C141 90 139 98 142 108 C132 98 130 84 128 70 C124 54 112 44 100 44 Z" fill={C.hair} />
      <path d="M78 58 C84 50 92 45 100 44" stroke={C.hairHi} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </svg>
  );
}
