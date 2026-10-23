export default function ECGSpinner({ label }: { label?: string }) {
  return (
    <span className="ecg-spinner-wrap">
      <svg className="ecg-spinner" viewBox="0 0 100 24" aria-hidden>
        <path d="M0 12 H28 L34 2 L40 22 L46 12 H100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && <span className="tiny muted">{label}</span>}
    </span>
  );
}
