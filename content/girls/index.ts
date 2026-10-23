import type { ComponentType } from "react";
import type { AvatarPose } from "@/components/avatars/types";
import ShrutiAvatar from "@/components/avatars/ShrutiAvatar";
import JasbirAvatar from "@/components/avatars/JasbirAvatar";
import PranjaliAvatar from "@/components/avatars/PranjaliAvatar";
import { shruti } from "./shruti";
import { jasbir } from "./jasbir";
import { pranjali } from "./pranjali";

export type RainEgg = {
  /** A small glyph tucked somewhere on her homepage — tapping it triggers the rain. */
  trigger: string;
  /** Glyphs that fall (varied, mixed if more than one). */
  glyphs: string[];
  /** Shown once they settle. */
  message: string;
  /** Optional call-to-action shown with the message (e.g. into a mini-game). */
  cta?: { label: string; href: string };
};

export type GirlContent = {
  slug: string;
  name: string;
  nickname: string;
  emoji: string;
  color: string; // her accent, e.g. #C97B9C
  title: string;
  subtitle: string;
  favorites: { icon: string; label: string }[];
  /** Greetings by time of day (India time). {time} is replaced with the clock. */
  greetings: { lateNight: string; morning: string; afternoon: string; evening: string; night: string };
  compliments: string[];
  photoPlaceholders: string[];
  /** Rounds for the "Mix the Shade" mini-game. Omit to leave the game off her homepage. */
  shadeRounds?: { name: string; hex: string }[];
  /** Daily mirror flavour. "fitcheck" always rates 10/10; "prescription" shows it as a doctor's Rx. */
  mirrorStyle?: "classic" | "fitcheck" | "prescription";
  /** Visual shell for her secret letters. */
  letterTheme?: "envelope" | "book";
  /** Heading for her compliment diary section. */
  diaryLabel?: string;
  /** Heading shown in the bouquet "ready to send" confirm step. */
  bouquetConfirmTitle?: string;
  /** Decorative treatment for her photo wall. */
  photoTheme?: "default" | "crochet";
  /** Spinner flavour for her loading states (photo upload, etc). */
  loadingStyle?: "yarn" | "ecg";
  /** One-time arrival effect on her homepage hero. */
  heroEffect?: "sunshine" | "petals";
  /** Hovering her homepage avatar triggers this flourish. */
  avatarHoverEffect?: "wind";
  /** Her homepage avatar starts dancing after ~20s of no interaction. */
  idleDance?: boolean;
  /** A small, undeclared homepage Easter egg — tap it, things rain. */
  rainEgg?: RainEgg;
  /** A tappable little sign near her avatar that reveals a short message. */
  streetSign?: { label: string; message: string };
  /** Her mini-game, linked from a homepage tile once discovered. */
  game?: { href: string; label: string; teaser: string; icon?: string };
  Avatar: ComponentType<{ pose?: AvatarPose; className?: string }>;
};

export const GIRLS: Record<string, GirlContent> = {
  shruti: { ...shruti, Avatar: ShrutiAvatar },
  jasbir: { ...jasbir, Avatar: JasbirAvatar },
  pranjali: { ...pranjali, Avatar: PranjaliAvatar },
};

export function getGirl(slug: string) {
  return GIRLS[slug] ?? null;
}
