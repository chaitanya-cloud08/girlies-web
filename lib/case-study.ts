export type ChoiceFlag = "kept_secret" | "lent_scarf";

export type Choice = {
  id: string;
  label: string;
  spark?: number;
  self?: number;
  flag?: ChoiceFlag;
};

export type Scene = {
  id: number;
  heading: string;
  location: string;
  dialogue: string[];
  choices: Choice[];
};

export const SCENES: Scene[] = [
  {
    id: 1,
    heading: "Orientation Day",
    location: "Case competition pairing board",
    dialogue: [
      "The list goes up. You scan for your name — and land next to his.",
      "Kabir. Grey hoodie, top of the batch, already looking insufferably pleased with himself.",
      `"Is that a crochet keychain? Bold," he says, nodding at your bag.`,
    ],
    choices: [
      { id: "roast", label: "Roast him", spark: 2 },
      { id: "smile", label: "Sunshine smile", self: 2 },
      { id: "ignore", label: "Pretend he doesn't exist", self: 1 },
    ],
  },
  {
    id: 2,
    heading: "Group Chat 📱",
    location: "Your phone, 11:47 PM",
    dialogue: [
      "Your phone buzzes. It's Chaitanya.",
      `Chaitanya: "26 WHO is the hoodie guy and why is he looking at you"`,
      "You have approximately four seconds to decide how much you're about to lie.",
    ],
    choices: [
      { id: "nobody", label: '"Nobody 🙄"', self: 2 },
      { id: "nemesis", label: '"My nemesis"', spark: 1, self: 1 },
      { id: "cute", label: '"…he\'s kinda cute ok"', spark: 3 },
    ],
  },
  {
    id: 3,
    heading: "Library, 11 PM",
    location: "Finance section, back table",
    dialogue: [
      "You're hunting for a case study reference when you spot him — Kabir, hunched over a thick finance textbook.",
      "Except the textbook's propped open on something considerably more dog-eared underneath, and the cover peeking out is definitely not about discounted cash flow.",
      "He freezes mid-page-turn.",
    ],
    choices: [
      { id: "expose", label: "Expose him", spark: 1, self: 1 },
      { id: "secret", label: "Keep his secret", spark: 2, flag: "kept_secret" },
      { id: "recommend", label: "Recommend a better one", spark: 3 },
    ],
  },
  {
    id: 4,
    heading: "Fit Check 👗",
    location: "Outside the seminar hall",
    dialogue: [
      "He looks up as you walk in, actually looks — not the usual smirk.",
      `"You look… prepared," he says, like the word cost him something.`,
      "From Kabir, that might be a five-alarm compliment.",
    ],
    choices: [
      { id: "fitcheckhim", label: "Fit-check him back", spark: 2 },
      { id: "compliment", label: "Take it as a compliment", self: 2 },
      { id: "tenoften", label: '"Prepared?? It\'s a 10/10"', self: 3 },
    ],
  },
  {
    id: 5,
    heading: "The Rain Scene ☔",
    location: "Outside the lecture hall, no warning whatsoever",
    dialogue: [
      "The sky opens up without so much as a courtesy drizzle first.",
      "You have one umbrella. He has none, and is currently staring at the downpour like it personally wronged him.",
    ],
    choices: [
      { id: "share", label: "Share it", spark: 3 },
      { id: "run", label: "Make a run for it", self: 2 },
      { id: "scarf", label: "Lend him your crochet scarf", spark: 2, flag: "lent_scarf" },
    ],
  },
  {
    id: 6,
    heading: "The Pitch",
    location: "Final round, five minutes to go",
    dialogue: [
      "The projector flickers. Your slides — forty hours of work — crash mid-transition.",
      "The judges are watching. Kabir's already reaching for his laptop.",
    ],
    choices: [
      { id: "shesaves", label: "She saves it", self: 3 },
      { id: "hesaves", label: "He saves it", spark: 1 },
      { id: "together", label: "They save it together", spark: 2, self: 1 },
    ],
  },
  {
    id: 7,
    heading: "Bestie Intervention 📱",
    location: "A call you can't dodge",
    dialogue: [
      "Your phone rings. Chaitanya, obviously.",
      `"Listen," she says, no hello. "You deserve the whole bookstore. Do NOT settle for a bookmark."`,
      "You can hear her pacing on the other end.",
    ],
    choices: [
      { id: "agree", label: '"You\'re right"', self: 2 },
      { id: "different", label: '"But he\'s different 🥺"', spark: 3 },
      { id: "hanging", label: '"Hang up, he\'s here"', spark: 2, self: 1 },
    ],
  },
  {
    id: 8,
    heading: "Results Day",
    location: "Outside the results hall",
    dialogue: [
      "You won. Both of you, the whole team, but somehow it's him standing in front of you with a book in his hands.",
      "His favourite one. Every line he loved is underlined — and every single one of them, somehow, is about you.",
      `"Didn't say it was yours," he mutters. "Just said it reminded me of someone."`,
    ],
    choices: [
      { id: "readnow", label: "Read it in front of him", spark: 3 },
      { id: "readlater", label: "Keep it to read alone later", self: 2 },
      { id: "askwhy", label: "Ask him why every line is about her", spark: 2, self: 1 },
    ],
  },
];

export type EndingId = "enemies_to_lovers" | "chose_herself" | "rivals_forever" | "yarn_yearning";

export type Ending = {
  id: EndingId;
  glyph: string;
  title: string;
  tagline: string;
  blurb: string;
};

export const ENDINGS: Record<EndingId, Ending> = {
  enemies_to_lovers: {
    id: "enemies_to_lovers",
    glyph: "💕",
    title: "Enemies to Lovers",
    tagline: "The one everyone saw coming except you.",
    blurb:
      "The love interest in this story was made up. The one in your real story is still being written — and whoever he is, he's lucky. Love, Chaitanya 🪻",
  },
  chose_herself: {
    id: "chose_herself",
    glyph: "💅",
    title: "She Chose Herself",
    tagline: "CEO era. He applies to intern under her.",
    blurb: "She became CEO. Kabir became her intern. He still brings up the rain scene in every meeting.",
  },
  rivals_forever: {
    id: "rivals_forever",
    glyph: "🤝",
    title: "Rivals Forever",
    tagline: "Still enemies. Shared snacks, though.",
    blurb: "Neither of them ever admitted anything. They just started saving each other a seat, and sharing fries.",
  },
  yarn_yearning: {
    id: "yarn_yearning",
    glyph: "🧶",
    title: "Secret: Yarn & Yearning",
    tagline: "He wore her crochet to the wedding.",
    blurb: "Years later, he still has the scarf. He wore it to their wedding, under the sherwani, where only she'd know.",
  },
};

export type Totals = { spark: number; self: number; flags: Set<ChoiceFlag> };

export function emptyTotals(): Totals {
  return { spark: 0, self: 0, flags: new Set() };
}

export function applyChoice(totals: Totals, choice: Choice): Totals {
  return {
    spark: totals.spark + (choice.spark ?? 0),
    self: totals.self + (choice.self ?? 0),
    flags: choice.flag ? new Set(totals.flags).add(choice.flag) : totals.flags,
  };
}

export function resolveEnding(totals: Totals): EndingId {
  if (totals.flags.has("kept_secret") && totals.flags.has("lent_scarf")) return "yarn_yearning";
  const diff = totals.spark - totals.self;
  if (diff >= 4) return "enemies_to_lovers";
  if (diff <= -4) return "chose_herself";
  return "rivals_forever";
}
