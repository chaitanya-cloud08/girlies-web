"use client";
import { useEffect, useState } from "react";

type P = { id: string; url: string | null; caption: string | null };
const placeholderRatios = [1.3, 0.75, 1, 1.5, 0.85, 1.15, 0.7, 1.35];

export default function PhotoWall({
  photos,
  placeholders,
  theme = "default",
}: {
  photos: P[];
  placeholders: string[];
  theme?: "default" | "crochet";
}) {
  const [open, setOpen] = useState<P | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const showPlaceholders = photos.length === 0;

  return (
    <>
      <div className="masonry" data-theme={theme}>
        {showPlaceholders
          ? placeholders.map((cap, i) => (
              <figure
                key={cap}
                className="pin pin-placeholder"
                style={{ ["--ratio" as string]: placeholderRatios[i % placeholderRatios.length] }}
              >
                <div className="pin-img pin-empty" aria-hidden>
                  <span>♡</span>
                  <small>photo coming soon</small>
                </div>
                <figcaption className="pin-cap hand">{cap}</figcaption>
              </figure>
            ))
          : photos.map((p) => (
              <button key={p.id} className="pin" onClick={() => setOpen(p)} data-pop>
                <span className="pin-img">
                  {p.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.url} alt={p.caption ?? "A memory"} loading="lazy" />
                  ) : (
                    <span className="pin-empty" aria-hidden><span>♡</span></span>
                  )}
                </span>
                {p.caption && <span className="pin-cap hand">{p.caption}</span>}
              </button>
            ))}
      </div>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <figure className="pin pin-big" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {open.url && <img src={open.url} alt={open.caption ?? "A memory"} />}
            {open.caption && <figcaption className="pin-cap hand">{open.caption}</figcaption>}
          </figure>
          <button className="lightbox-close" onClick={() => setOpen(null)} aria-label="Close">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
