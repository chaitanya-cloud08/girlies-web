"use client";
import { useRef } from "react";
import GroupStickers from "./GroupStickers";
import { GROUP_SONG, GROUP_PHOTO_CAPTION } from "@/content/wrapped";

type Sticker = { owner: string; emoji: string; x: number; y: number };

export default function GroupPolaroid({
  photoUrl,
  caption,
  stickers,
  myOwnerId,
  canPlace,
}: {
  photoUrl: string | null;
  caption: string | null;
  stickers: Sticker[];
  myOwnerId: string | null;
  canPlace: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <div className="group-polaroid-stage">
      <div className="fairy-lights" aria-hidden>
        {Array.from({ length: 16 }).map((_, i) => (
          <i key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="group-polaroid">
        <div className="group-polaroid-photo" ref={frameRef}>
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Zindagi ke Kalesh" />
          ) : (
            <div className="ph-img" aria-hidden>
              <span>📸</span>
              <small>group photo coming soon</small>
            </div>
          )}
          <GroupStickers stickers={stickers} myOwnerId={myOwnerId} canPlace={canPlace} containerRef={frameRef} />
        </div>
        <figcaption className="hand group-polaroid-caption">{caption || GROUP_PHOTO_CAPTION}</figcaption>
      </div>

      <div className="group-song">
        <p className="tiny muted" style={{ textAlign: "center" }}>
          the group anthem
        </p>
        <iframe
          title="Group song"
          src={`https://open.spotify.com/embed/track/${GROUP_SONG.trackId}`}
          width="100%"
          height="152"
          style={{ borderRadius: 12, maxWidth: 420, margin: "0 auto", display: "block" }}
          allow="encrypted-media"
          loading="lazy"
        />
      </div>
    </div>
  );
}
