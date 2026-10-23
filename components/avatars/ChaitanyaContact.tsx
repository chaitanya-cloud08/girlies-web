/**
 * Chaitanya only appears through texts/calls in the game, so she's a contact
 * icon, not a drawn figure. Swap for a real photo whenever she sends one —
 * replace this file's contents with an <img>/avatar and nothing else changes.
 */
export default function ChaitanyaContact({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Chaitanya">
      <circle cx={32} cy={32} r={32} fill="#F2B1D3" />
      <circle cx={32} cy={26} r={11} fill="#fff" fillOpacity={0.9} />
      <path d="M14 56 C16 42 22 36 32 36 C42 36 48 42 50 56 Z" fill="#fff" fillOpacity={0.9} />
    </svg>
  );
}
