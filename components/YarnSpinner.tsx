export default function YarnSpinner({ label }: { label?: string }) {
  return (
    <span className="yarn-spinner-wrap">
      <span className="yarn-spinner" aria-hidden />
      {label && <span className="tiny muted">{label}</span>}
    </span>
  );
}
