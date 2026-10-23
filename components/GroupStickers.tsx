"use client";
import { useRef, useState } from "react";
import { saveGroupSticker } from "@/app/actions";
import { STICKER_OPTIONS } from "@/content/wrapped";
import { playSound } from "./ClientFX";

type Sticker = { owner: string; emoji: string; x: number; y: number };

export default function GroupStickers({
  stickers,
  myOwnerId,
  canPlace,
  containerRef,
}: {
  stickers: Sticker[];
  myOwnerId: string | null;
  canPlace: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [local, setLocal] = useState(stickers);
  const [showPalette, setShowPalette] = useState(false);
  const dragPos = useRef<{ x: number; y: number } | null>(null);

  const mine = canPlace && myOwnerId ? local.find((s) => s.owner === myOwnerId) : undefined;

  function place(emoji: string) {
    if (!myOwnerId) return;
    const next: Sticker = { owner: myOwnerId, emoji, x: 50, y: 50 };
    setLocal((prev) => [...prev.filter((s) => s.owner !== myOwnerId), next]);
    saveGroupSticker(emoji, 50, 50);
    playSound("chime");
    setShowPalette(false);
  }

  function startDrag(e: React.PointerEvent<HTMLButtonElement>) {
    if (!myOwnerId || !mine) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragPos.current = { x: mine.x, y: mine.y };

    function move(ev: PointerEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.min(96, Math.max(4, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(96, Math.max(4, ((ev.clientY - rect.top) / rect.height) * 100));
      dragPos.current = { x, y };
      setLocal((prev) => prev.map((s) => (s.owner === myOwnerId ? { ...s, x, y } : s)));
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (dragPos.current && mine) saveGroupSticker(mine.emoji, dragPos.current.x, dragPos.current.y);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <>
      {local.map((s) => (
        <button
          key={s.owner}
          type="button"
          className={`group-sticker ${s.owner === myOwnerId ? "mine" : ""}`}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          onPointerDown={s.owner === myOwnerId ? startDrag : undefined}
          aria-label={s.owner === myOwnerId ? "Your sticker — drag to move" : "A sticker"}
        >
          {s.emoji}
        </button>
      ))}

      {canPlace && !mine && (
        <button type="button" className="group-sticker-add" onClick={() => setShowPalette((v) => !v)}>
          + Add your sticker
        </button>
      )}
      {canPlace && mine && !showPalette && (
        <button type="button" className="link-btn group-sticker-change" onClick={() => setShowPalette(true)}>
          Change sticker
        </button>
      )}
      {showPalette && (
        <div className="group-sticker-palette">
          {STICKER_OPTIONS.map((e) => (
            <button key={e} type="button" onClick={() => place(e)} data-pop="soft">
              {e}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
