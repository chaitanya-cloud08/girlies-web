"use client";
import { useState } from "react";
import Link from "next/link";
import { triggerRain, triggerToast, RAIN_DURATION_MS } from "./ClientFX";
import type { RainEgg as RainEggConfig } from "@/content/girls";

/** A quiet, undeclared glyph tucked near her avatar — tap it, things rain. */
export default function RainEgg({ config }: { config: RainEggConfig }) {
  const [showPopup, setShowPopup] = useState(false);

  function tap() {
    triggerRain(config.glyphs);
    if (config.cta) {
      setTimeout(() => setShowPopup(true), RAIN_DURATION_MS);
    } else {
      setTimeout(() => triggerToast(config.message), RAIN_DURATION_MS);
    }
  }

  return (
    <>
      <button type="button" className="hero-egg" onClick={tap} aria-label="tap for a surprise" data-pop="soft">
        {config.trigger}
      </button>
      {showPopup && config.cta && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setShowPopup(false)}>
          <div className="confirm" onClick={(e) => e.stopPropagation()}>
            <p className="hand" style={{ fontSize: "1.6rem" }}>
              {config.message}
            </p>
            <div className="confirm-actions">
              <Link href={config.cta.href} className="btn btn-primary" onClick={() => setShowPopup(false)}>
                {config.cta.label}
              </Link>
              <button className="btn btn-ghost" onClick={() => setShowPopup(false)}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
