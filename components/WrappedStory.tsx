"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import { GIRLS } from "@/content/girls";
import { PERSONAS, GROUP_SONG, CLOSING_LINE, ANTHEM_LINE, YAPPING_MINUTES, formatIndian } from "@/content/wrapped";
import { playSound } from "./ClientFX";
import { loadSpotifyIframeApi, type SpotifyEmbedController } from "@/lib/spotify-embed";

type SlideId = "intro" | "yapping" | "teaser" | "shruti" | "jasbir" | "pranjali" | "anthem" | "outro";
const SLIDES: SlideId[] = ["intro", "yapping", "teaser", "shruti", "jasbir", "pranjali", "anthem", "outro"];
const CANVAS_W = 1080;
const CANVAS_H = 1920;

function useCanvasTransform() {
  const [transform, setTransform] = useState("translate(0px, 0px) scale(0.2)");
  useEffect(() => {
    function fit() {
      const pad = 24;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min((vw - pad) / CANVAS_W, (vh - pad) / CANVAS_H);
      const x = (vw - CANVAS_W * s) / 2;
      const y = (vh - CANVAS_H * s) / 2;
      setTransform(`translate(${x}px, ${y}px) scale(${s})`);
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return transform;
}

async function fileToBlob(path: string) {
  const res = await fetch(path);
  return res.blob();
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function shareOrDownload(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean; share?: (data: { files: File[]; title?: string }) => Promise<void> };
  if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: "Zindagi ke Kalesh Wrapped" });
      return;
    } catch {
      // fall through to download
    }
  }
  triggerDownload(blob, filename);
}

export default function WrappedStory() {
  const router = useRouter();
  const canvasTransform = useCanvasTransform();
  const [index, setIndex] = useState(0);
  const [yapCount, setYapCount] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const slideId = SLIDES[index];

  useEffect(() => {
    if (slideId !== "yapping") return;
    setYapCount(0);
    const start = performance.now();
    const dur = 1800;
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setYapCount(Math.round(eased * YAPPING_MINUTES));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slideId]);

  function go(delta: number) {
    setIndex((i) => Math.max(0, Math.min(SLIDES.length - 1, i + delta)));
    playSound("soft");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Escape") router.push("/kalesh");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const touchStartX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      if (dx < 0) go(1);
      else go(-1);
    }
  }

  function onTap(e: React.MouseEvent) {
    const w = (e.currentTarget as HTMLElement).clientWidth;
    const x = e.nativeEvent.offsetX;
    if (x < w * 0.35) go(-1);
    else go(1);
  }

  async function captureCurrentSlide(): Promise<Blob> {
    if (!canvasRef.current) throw new Error("no canvas");
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Rendering this slide is taking too long — try again")), 12000));
    const dataUrl = await Promise.race([htmlToImage.toPng(canvasRef.current, { width: CANVAS_W, height: CANVAS_H, pixelRatio: 1, skipFonts: true }), timeout]);
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function downloadCurrent() {
    setBusy("slide");
    try {
      let blob: Blob;
      let filename = `kalesh-wrapped-${slideId}.png`;
      if (slideId === "shruti" || slideId === "jasbir" || slideId === "pranjali") {
        blob = await fileToBlob(PERSONAS[slideId].file);
        filename = `kalesh-wrapped-${slideId}-persona.png`;
      } else {
        blob = await captureCurrentSlide();
      }
      await shareOrDownload(blob, filename);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't save this slide — try again");
    } finally {
      setBusy(null);
    }
  }

  async function downloadAll() {
    setBusy("all");
    try {
      const zip = new JSZip();
      const originalIndex = index;
      for (let i = 0; i < SLIDES.length; i++) {
        const id = SLIDES[i];
        let blob: Blob;
        if (id === "shruti" || id === "jasbir" || id === "pranjali") {
          blob = await fileToBlob(PERSONAS[id].file);
        } else {
          setIndex(i);
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          blob = await captureCurrentSlide();
        }
        zip.file(`${String(i + 1).padStart(2, "0")}-${id}.png`, blob);
      }
      setIndex(originalIndex);
      const content = await zip.generateAsync({ type: "blob" });
      triggerDownload(content, "zindagi-ke-kalesh-wrapped.zip");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't build the zip — try again");
    } finally {
      setBusy(null);
    }
  }

  function openSpotify(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="wrapped-root">
      <div className="wrapped-progress" aria-hidden>
        {SLIDES.map((s, i) => (
          <span key={s} className="wrapped-progress-seg">
            <span className="wrapped-progress-fill" style={{ width: i < index ? "100%" : i === index ? "100%" : "0%", transition: i === index ? "width 0.2s" : "none" }} />
          </span>
        ))}
      </div>
      <button className="wrapped-close" onClick={() => router.push("/kalesh")} aria-label="Close">
        ✕
      </button>

      <div className="wrapped-viewport">
        <div
          className="wrapped-canvas"
          ref={canvasRef}
          style={{ width: CANVAS_W, height: CANVAS_H, transform: canvasTransform }}
          onClick={onTap}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {slideId === "intro" && <IntroSlide />}
          {slideId === "yapping" && <YappingSlide count={yapCount} />}
          {slideId === "teaser" && <TeaserSlide />}
          {(slideId === "shruti" || slideId === "jasbir" || slideId === "pranjali") && (
            <PersonaSlide key={slideId} slug={slideId} onTapSong={openSpotify} />
          )}
          {slideId === "anthem" && <AnthemSlide onTapSong={openSpotify} />}
          {slideId === "outro" && <OutroSlide />}
        </div>
      </div>

      <div className="wrapped-toolbar">
        <button className="btn btn-ghost btn-sm wrapped-toolbar-btn" onClick={downloadCurrent} disabled={!!busy}>
          {busy === "slide" ? "…" : "⬇ This slide"}
        </button>
        <button className="btn btn-ghost btn-sm wrapped-toolbar-btn" onClick={downloadAll} disabled={!!busy}>
          {busy === "all" ? "Zipping…" : "⬇ Download all"}
        </button>
      </div>
    </div>
  );
}

function IntroSlide() {
  return (
    <div className="wrapped-slide wrapped-slide-intro">
      <div className="wrapped-confetti" aria-hidden>
        {Array.from({ length: 30 }).map((_, i) => (
          <i key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>
      <p className="wrapped-eyebrow">presenting</p>
      <h1 className="wrapped-hero-title">
        Zindagi ke
        <br />
        Kalesh
        <br />
        <em>Wrapped</em>
      </h1>
      <p className="wrapped-hero-year">2026</p>
      <div className="wrapped-avatars-row">
        {["shruti", "jasbir", "pranjali"].map((slug) => {
          const g = GIRLS[slug];
          if (!g) return null;
          const { Avatar } = g;
          return <Avatar key={slug} pose="wave" className="avatar-svg wrapped-mini-avatar" />;
        })}
      </div>
    </div>
  );
}

function YappingSlide({ count }: { count: number }) {
  const shaking = count > 0 && count < YAPPING_MINUTES;
  return (
    <div className="wrapped-slide wrapped-slide-yapping">
      <div className="wrapped-sirens" aria-hidden>
        🚨🚨🚨
      </div>
      <p className="wrapped-eyebrow">this year, you spent</p>
      <p className={`wrapped-yap-number ${shaking ? "shaking" : ""}`}>{formatIndian(count)}</p>
      <p className="wrapped-yap-label">minutes yapping</p>
      <p className="wrapped-yap-line hand">
        That&rsquo;s one full year of non-stop yapping… plus one extra minute, because someone had &ldquo;just one more thing&rdquo; to say.
      </p>
    </div>
  );
}

function TeaserSlide() {
  return (
    <div className="wrapped-slide wrapped-slide-teaser">
      <p className="wrapped-teaser-text display">
        Now, the personas.
        <br />
        Who&rsquo;s first? 👀
      </p>
    </div>
  );
}

function PersonaSlide({ slug, onTapSong }: { slug: "shruti" | "jasbir" | "pranjali"; onTapSong: (url: string) => void }) {
  const p = PERSONAS[slug];
  const zoneStyle = {
    left: `${(p.tapZone.x0 / CANVAS_W) * 100}%`,
    top: `${(p.tapZone.y0 / CANVAS_H) * 100}%`,
    width: `${((p.tapZone.x1 - p.tapZone.x0) / CANVAS_W) * 100}%`,
    height: `${((p.tapZone.y1 - p.tapZone.y0) / CANVAS_H) * 100}%`,
  };
  const audioHostRef = useRef<HTMLDivElement>(null);

  // Plays her song in the background while this card is up, via Spotify's controller
  // API (not a raw ?autoplay=1 src) — that's what actually completes Spotify's
  // playback handshake instead of leaving the player silently stuck. Stops on unmount.
  useEffect(() => {
    let cancelled = false;
    let controller: SpotifyEmbedController | null = null;
    loadSpotifyIframeApi().then((api) => {
      if (cancelled || !audioHostRef.current) return;
      api.createController(audioHostRef.current, { uri: `spotify:track:${p.song.trackId}`, width: "100%", height: "80" }, (c) => {
        if (cancelled) {
          c.destroy?.();
          return;
        }
        controller = c;
        c.addListener("ready", () => c.play());
      });
    });
    return () => {
      cancelled = true;
      try {
        controller?.pause();
        controller?.destroy?.();
      } catch {}
      if (audioHostRef.current) audioHostRef.current.innerHTML = "";
    };
  }, [p.song.trackId]);

  return (
    <div className="wrapped-slide wrapped-slide-persona">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.file} alt={`${slug}'s persona card: ${p.title}`} width={1080} height={1920} className="wrapped-persona-img wrapped-persona-reveal" />
      <button
        type="button"
        className="wrapped-persona-tapzone"
        style={zoneStyle}
        onClick={(e) => {
          e.stopPropagation();
          onTapSong(p.song.spotifyUrl);
        }}
        aria-label={`Play ${p.song.name} on Spotify`}
      />
      <div ref={audioHostRef} className="wrapped-persona-audio" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

function AnthemSlide({ onTapSong }: { onTapSong: (url: string) => void }) {
  const audioHostRef = useRef<HTMLDivElement>(null);

  // Same background-playback pattern as the persona slides: Spotify's controller
  // API + an explicit .play() once ready, instead of a visible embed player.
  useEffect(() => {
    let cancelled = false;
    let controller: SpotifyEmbedController | null = null;
    loadSpotifyIframeApi().then((api) => {
      if (cancelled || !audioHostRef.current) return;
      api.createController(audioHostRef.current, { uri: `spotify:track:${GROUP_SONG.trackId}`, width: "100%", height: "80" }, (c) => {
        if (cancelled) {
          c.destroy?.();
          return;
        }
        controller = c;
        c.addListener("ready", () => c.play());
      });
    });
    return () => {
      cancelled = true;
      try {
        controller?.pause();
        controller?.destroy?.();
      } catch {}
      if (audioHostRef.current) audioHostRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="wrapped-slide wrapped-slide-anthem">
      <div className="wrapped-avatars-row">
        {["shruti", "jasbir", "pranjali"].map((slug) => {
          const g = GIRLS[slug];
          if (!g) return null;
          const { Avatar } = g;
          return <Avatar key={slug} pose="sassy" className="avatar-svg wrapped-mini-avatar" />;
        })}
      </div>
      <p className="wrapped-anthem-line display">{ANTHEM_LINE}</p>
      <button
        className="link-btn wrapped-spotify-fallback"
        onClick={(e) => {
          e.stopPropagation();
          onTapSong(GROUP_SONG.spotifyUrl);
        }}
      >
        Open in Spotify ↗
      </button>
      <div ref={audioHostRef} className="wrapped-persona-audio" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

function OutroSlide() {
  return (
    <div className="wrapped-slide wrapped-slide-outro">
      <div className="wrapped-avatars-row">
        {["shruti", "jasbir", "pranjali"].map((slug) => {
          const g = GIRLS[slug];
          if (!g) return null;
          const { Avatar } = g;
          return <Avatar key={slug} pose="wave" className="avatar-svg wrapped-mini-avatar" />;
        })}
      </div>
      <p className="wrapped-outro-line hand">{CLOSING_LINE}</p>
    </div>
  );
}
