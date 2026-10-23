export type PaintId = "red" | "yellow" | "blue" | "white" | "black" | "pink";

export const PALETTE: { id: PaintId; name: string; hex: string }[] = [
  { id: "red", name: "Red", hex: "#E63946" },
  { id: "yellow", name: "Yellow", hex: "#F4D35E" },
  { id: "blue", name: "Blue", hex: "#3A6EA5" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#2B2320" },
  { id: "pink", name: "Pink", hex: "#C97B9C" },
];

export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Average-mixes a list of paint dabs (by id) into one RGB colour. */
export function mixDabs(dabIds: PaintId[]) {
  if (dabIds.length === 0) return { r: 255, g: 255, b: 255 };
  const sum = dabIds.reduce(
    (acc, id) => {
      const rgb = hexToRgb(PALETTE.find((p) => p.id === id)!.hex);
      return { r: acc.r + rgb.r, g: acc.g + rgb.g, b: acc.b + rgb.b };
    },
    { r: 0, g: 0, b: 0 }
  );
  return { r: sum.r / dabIds.length, g: sum.g / dabIds.length, b: sum.b / dabIds.length };
}

const MAX_DIST = Math.sqrt(255 ** 2 * 3);

/** 0-100 closeness score between two RGB colours. */
export function scoreMatch(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  const dist = Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
  return Math.round(Math.max(0, 100 - (dist / MAX_DIST) * 100));
}

export function reviewFor(score: number) {
  if (score >= 90) return "Your eye is museum-level, darling.";
  if (score >= 75) return "Gallery-worthy. The critics are nodding.";
  if (score >= 55) return "Bold choice. We'll call it “abstract.”";
  if (score >= 35) return "Bless you for trying, Picasso.";
  return "Certified chaos. Very on-brand, Shru.";
}

export function closingReview(avg: number) {
  if (avg >= 90) return "A full collection, museum-ready. Chaitanya is framing this.";
  if (avg >= 70) return "Solid exhibition, Shru. The critics approve.";
  if (avg >= 45) return "A... thought-provoking collection. Very you.";
  return "Modern art owes you a thank-you note.";
}
