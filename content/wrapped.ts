export type Song = { name: string; spotifyUrl: string; trackId: string };

function trackId(url: string) {
  return url.split("/track/")[1]?.split("?")[0] ?? "";
}

export const SONGS = {
  shruti: { name: "Khudaya Khair", spotifyUrl: "https://open.spotify.com/track/2XYyriLyJSuGj4FN7QoNmM" },
  jasbir: { name: "Small Town Girl", spotifyUrl: "https://open.spotify.com/track/6bRMrsjdHJ6W7zDEep3JlE" },
  pranjali: { name: "Tattoo", spotifyUrl: "https://open.spotify.com/track/5a8QSQYfM5CM4DtDmcuceI" },
  group: { name: "Hungamaa Ho Gaya", spotifyUrl: "https://open.spotify.com/track/3gv6ZRvumAlDJufUM93hfv" },
} satisfies Record<string, { name: string; spotifyUrl: string }>;

export const PERSONAS = {
  shruti: {
    slug: "shruti",
    file: "/wrapped/persona-shruti.png",
    title: "Little Miss Overthinker",
    song: { ...SONGS.shruti, trackId: trackId(SONGS.shruti.spotifyUrl) } as Song,
    tapZone: { x0: 180, y0: 1500, x1: 625, y1: 1630 },
    pose: "wave" as const,
  },
  jasbir: {
    slug: "jasbir",
    file: "/wrapped/persona-jasbir.png",
    title: "lil miss sunshine",
    song: { ...SONGS.jasbir, trackId: trackId(SONGS.jasbir.spotifyUrl) } as Song,
    tapZone: { x0: 485, y0: 1485, x1: 910, y1: 1605 },
    pose: "sassy" as const,
  },
  pranjali: {
    slug: "pranjali",
    file: "/wrapped/persona-pranjali.png",
    title: "Little Miss Baddie",
    song: { ...SONGS.pranjali, trackId: trackId(SONGS.pranjali.spotifyUrl) } as Song,
    tapZone: { x0: 112, y0: 1520, x1: 510, y1: 1620 },
    pose: "sassy" as const,
  },
};

export const GROUP_SONG: Song = { ...SONGS.group, trackId: trackId(SONGS.group.spotifyUrl) };

/** Easy to edit — Chaitanya's closing line for the last slide. */
export const CLOSING_LINE = "Same kalesh, next year? Obviously. 💖 — Chaitanya";

export const ANTHEM_LINE = "Your anthem this year: Hungamaa Ho Gaya 🔥";

export const YAPPING_MINUTES = 525601; // "5,25,601" — one full year + one extra minute

export function formatIndian(n: number) {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
}

export const GROUP_PHOTO_CAPTION = "Zindagi ke Kalesh, est. forever";

export const STICKER_OPTIONS = ["🍟", "🍪", "🥭", "💋", "🪻", "🌸", "✨", "🎀"];
