"use client";
import { useState } from "react";

export default function StreetSign({ label, message }: { label: string; message: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="street-sign-wrap">
      <button type="button" className="street-sign" onClick={() => setOpen((o) => !o)} data-pop="soft" aria-expanded={open}>
        {label}
      </button>
      {open && <p className="street-sign-note hand">{message}</p>}
    </div>
  );
}
