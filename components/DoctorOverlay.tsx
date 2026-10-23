/** A simple white-coat + stethoscope overlay, laid over her avatar for the ER game. */
export default function DoctorOverlay() {
  return (
    <svg viewBox="0 0 200 284" className="doctor-overlay" aria-hidden>
      <path
        d="M72 158 C80 155 90 158 100 165 C110 158 120 155 128 158 L134 270 C110 278 90 278 66 270 Z"
        fill="#fff"
        fillOpacity="0.93"
        stroke="#dcdcdc"
        strokeWidth="1.5"
      />
      <path d="M100 165 L92 270 M100 165 L108 270" stroke="#dcdcdc" strokeWidth="1.2" fill="none" />
      <circle cx="100" cy="186" r="10" fill="none" stroke="#6b7280" strokeWidth="3" />
      <path d="M100 196 L100 210 Q100 218 92 218" fill="none" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
      <circle cx="92" cy="222" r="4" fill="#6b7280" />
    </svg>
  );
}
