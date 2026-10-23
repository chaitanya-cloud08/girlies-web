"use client";
import { useState } from "react";
import { GIRLS } from "@/content/girls";
import type { AvatarPose } from "./avatars/types";
import { playSound } from "./ClientFX";

const POSES: Record<string, AvatarPose> = { shruti: "wave", jasbir: "sassy", pranjali: "sassy" };
const REACTIONS = ["Hii 👋", "obsessed with you", "kalesh forever 🔥", "missed you!!", "✨ iconic ✨"];

export default function GroupAvatarHeader() {
  const [reacting, setReacting] = useState<string | null>(null);

  function tap(slug: string) {
    setReacting(slug);
    playSound("soft");
    setTimeout(() => setReacting((r) => (r === slug ? null : r)), 1600);
  }

  const order = ["shruti", "jasbir", "pranjali"].filter((s) => GIRLS[s]);

  return (
    <div className="kalesh-avatars">
      {order.map((slug, i) => {
        const g = GIRLS[slug];
        const { Avatar } = g;
        return (
          <button
            key={slug}
            type="button"
            className="kalesh-avatar-btn"
            style={{ ["--accent" as string]: g.color }}
            onClick={() => tap(slug)}
            aria-label={`${g.name} says hi`}
            data-pop="soft"
          >
            {reacting === slug && (
              <span className="kalesh-reaction hand">{REACTIONS[i % REACTIONS.length]}</span>
            )}
            <Avatar pose={POSES[slug]} className="avatar-svg bob kalesh-avatar-svg" />
          </button>
        );
      })}
    </div>
  );
}
