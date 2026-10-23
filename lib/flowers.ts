export type FlowerId =
  | "rose"
  | "sunflower"
  | "tulip"
  | "daisy"
  | "lavender"
  | "cherry"
  | "marigold"
  | "mogra"
  | "peony"
  | "forgetmenot"
  | "chococosmos"
  | "babysbreath"
  | "kaleshpoppy";

export type Flower = { id: FlowerId; name: string; meaning: string; special?: string };

export const FLOWERS: Flower[] = [
  { id: "rose", name: "Red Rose", meaning: "I love you, bestie (platonically, obviously)" },
  { id: "sunflower", name: "Sunflower", meaning: "You're my sunshine on bad days" },
  { id: "tulip", name: "Pink Tulip", meaning: "Thank you for being you" },
  { id: "daisy", name: "Daisy", meaning: "You always make me laugh" },
  { id: "lavender", name: "Lavender", meaning: "You calm my chaos" },
  { id: "cherry", name: "Cherry Blossom", meaning: "Our friendship is rare and precious" },
  { id: "marigold", name: "Genda (Marigold)", meaning: "Every celebration is better with you" },
  { id: "mogra", name: "Mogra (Jasmine)", meaning: "You feel like home" },
  { id: "peony", name: "Peony", meaning: "Wishing you all the good things in life" },
  { id: "forgetmenot", name: "Forget-me-not", meaning: "I'll never forget our memories" },
  { id: "chococosmos", name: "Chocolate Cosmos", meaning: "You're sweeter than choco fudge", special: "Smells like chocolate, for real" },
  { id: "babysbreath", name: "Baby's Breath", meaning: "Pure, forever friendship" },
  { id: "kaleshpoppy", name: "Kalesh Poppy", meaning: "Even our kalesh is iconic", special: "Only grows in Zindagi ke Kalesh 🔥" },
];

export const MAX_STEMS = 12;

export const WRAPS = [
  { id: "blush", name: "Blush tissue", fill: "#F6D3DF", edge: "#E3A9BE" },
  { id: "kraft", name: "Kraft paper", fill: "#D9B48C", edge: "#B88D62" },
  { id: "cream", name: "Cream silk", fill: "#FBF1E2", edge: "#E6D3B6" },
  { id: "lilac", name: "Lilac dream", fill: "#D9CBEF", edge: "#B3A0D6" },
  { id: "noir", name: "Noir luxe", fill: "#2A2226", edge: "#4E3E45" },
] as const;

export const RIBBONS = [
  { id: "wine", name: "Wine", color: "#7A2944" },
  { id: "gold", name: "Gold", color: "#D4A23A" },
  { id: "pink", name: "Pink", color: "#E58FB0" },
  { id: "white", name: "Pearl", color: "#FFFFFF" },
  { id: "lavender", name: "Lavender", color: "#A68BD1" },
] as const;

export type BouquetData = {
  flowers: FlowerId[];
  wrap: string;
  ribbon: string;
  note?: string | null;
};

export function isFlowerId(v: unknown): v is FlowerId {
  return typeof v === "string" && FLOWERS.some((f) => f.id === v);
}
