/** Clouds part on arrival to reveal the sun behind her — purely decorative. */
export default function SunshineReveal() {
  return (
    <div className="sunshine-reveal" aria-hidden>
      <span className="sun-burst" />
      <span className="cloud cloud-left" />
      <span className="cloud cloud-right" />
    </div>
  );
}
