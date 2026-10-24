export type ChoiceFlag = "kept_secret" | "lent_scarf";

export type Choice = {
  id: string;
  label: string;
  /** What Jasbir says or does, shown right after she picks it. */
  reply: string;
  spark?: number;
  self?: number;
  flag?: ChoiceFlag;
};

export type Scene = {
  id: number;
  heading: string;
  location: string;
  dialogue: string[];
  /** The question Jasbir is answering. Shown right above the choices. */
  prompt: string;
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
    prompt: "He's waiting for a reaction. What do you say?",
    choices: [
      {
        id: "roast",
        label: "Roast him",
        spark: 2,
        reply: `"Bold? Says the guy who's worn the same hoodie since orientation started." Kabir blinks. "...Okay. Noted."`,
      },
      {
        id: "smile",
        label: "Sunshine smile + “I made it myself”",
        self: 2,
        reply: `You smile, a little too brightly, and show him the keychain properly. Kabir actually looks thrown. "...Cool. Sure."`,
      },
      {
        id: "ignore",
        label: "Pretend he doesn't exist",
        self: 1,
        reply: "You turn back to the board without a word. He watches you go a beat too long.",
      },
    ],
  },
  {
    id: 2,
    heading: "Group Chat 📱",
    location: "Your phone, 11:47 PM",
    dialogue: [
      "Your phone buzzes. It's Chaitanya.",
      `Chaitanya: "26 WHO is the hoodie guy and why is he looking at you"`,
      "You have about four seconds to decide how much you're about to lie.",
    ],
    prompt: "Reply to Chaitanya:",
    choices: [
      {
        id: "nobody",
        label: '"Nobody 🙄"',
        self: 2,
        reply: `Chaitanya: "A nobody who stared at you for four minutes? Sure, Jan."`,
      },
      {
        id: "nemesis",
        label: '"My nemesis."',
        spark: 1,
        self: 1,
        reply: `Chaitanya: "Nemeses don't blush like that, babe. I'm calling it."`,
      },
      {
        id: "cute",
        label: '"…he\'s kinda cute ok"',
        spark: 3,
        reply: `Chaitanya: "I KNEW IT. Tell me everything. Now."`,
      },
    ],
  },
  {
    id: 3,
    heading: "Library, 11 PM",
    location: "Finance section, back table",
    dialogue: [
      "You're hunting for a case study reference when you spot him — Kabir, hunched over a thick finance textbook.",
      "Except the textbook's propped open on something considerably more dog-eared underneath, and the cover peeking out is definitely not about discounted cash flow.",
      "He freezes mid-page-turn, staring at you.",
    ],
    prompt: "You've caught him. What do you do?",
    choices: [
      {
        id: "expose",
        label: "Expose him, loudly",
        spark: 1,
        self: 1,
        reply: `You announce it at full volume. Heads turn. Kabir slams the book shut: "Please. Keep your voice down, Overachiever."`,
      },
      {
        id: "secret",
        label: "Keep his secret and slip away",
        spark: 2,
        flag: "kept_secret",
        reply: `You pretend you saw nothing and quietly move on. Kabir catches your eye across the shelves and mouths "thank you."`,
      },
      {
        id: "recommend",
        label: "Slide over a better one",
        spark: 3,
        reply: `You pull a copy of the enemies-to-lovers classic off the shelf and set it on his table. He stares at the cover. "...You read these?"`,
      },
    ],
  },
  {
    id: 4,
    heading: "Fit Check 👗",
    location: "Outside the seminar hall",
    dialogue: [
      "He looks up as you walk in. Actually looks, not the usual smirk.",
      `"You look… prepared," he says, like the word cost him something.`,
      "From Kabir, that might be a five-alarm compliment.",
    ],
    prompt: "He's just complimented you. How do you reply?",
    choices: [
      {
        id: "fitcheckhim",
        label: "Fit-check him back",
        spark: 2,
        reply: `"You look like you slept in that hoodie." Kabir glances down at himself, offended. "It's vintage."`,
      },
      {
        id: "compliment",
        label: "Say a simple thank you",
        self: 2,
        reply: `"Thanks." You don't add anything. He nods like that's the most he's going to get today.`,
      },
      {
        id: "tenoften",
        label: `"Prepared?? It's a 10/10 fit."`,
        self: 3,
        reply: `Kabir fails to hide a smile. "Fine. 10/10. Don't make it weird."`,
      },
    ],
  },
  {
    id: 5,
    heading: "The Rain Scene ☔",
    location: "Outside the lecture hall, no warning whatsoever",
    dialogue: [
      "The sky opens up without so much as a courtesy drizzle first.",
      "You have one umbrella. He has none, and is staring at the downpour like it personally wronged him.",
    ],
    prompt: "One umbrella, two people. What now?",
    choices: [
      {
        id: "share",
        label: "Share the umbrella",
        spark: 3,
        reply: `You hold it over both of you. He mutters "This is so not necessary" and stays right under it.`,
      },
      {
        id: "run",
        label: "Make a run for it",
        self: 2,
        reply: "You sprint for the bus stop. Kabir is somehow still soaked, and still smirking.",
      },
      {
        id: "scarf",
        label: "Wrap him in your crochet scarf",
        spark: 2,
        flag: "lent_scarf",
        reply: `You loop the scarf around his neck. "It's warm," he says, quieter than before. "Are you sure?"`,
      },
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
    prompt: "Your slides are gone. What's your move?",
    choices: [
      {
        id: "shesaves",
        label: "Restart and narrate the charts from memory",
        self: 3,
        reply: "You walk the judges through every chart without a single slide. They lean forward. Kabir just stares.",
      },
      {
        id: "hesaves",
        label: "Let him take over",
        spark: 1,
        reply: `Kabir already has the backup drive open. "Relax, Sunshine. I've got this."`,
      },
      {
        id: "together",
        label: "Split it: you tell the story, he takes the numbers",
        spark: 2,
        self: 1,
        reply: `"You take the numbers, I'll take the story." "...Deal."`,
      },
    ],
  },
  {
    id: 7,
    heading: "Bestie Intervention 📱",
    location: "A call you can't dodge",
    dialogue: [
      "Your phone rings. Chaitanya, obviously.",
      `Chaitanya: "Listen," she says, no hello. "You deserve the whole bookstore. Do NOT settle for a bookmark."`,
      "You can hear her pacing on the other end.",
    ],
    prompt: "She's waiting for your answer. What do you tell her?",
    choices: [
      {
        id: "agree",
        label: '"You\'re right."',
        self: 2,
        reply: `Chaitanya: "Thank you. The whole bookstore, Jas. Now go be iconic."`,
      },
      {
        id: "different",
        label: '"But he\'s different 🥺"',
        spark: 3,
        reply: `Chaitanya: "Ugh. Fine. But I'm watching you."`,
      },
      {
        id: "hanging",
        label: '"Hang up, he\'s here."',
        spark: 2,
        self: 1,
        reply: `Chaitanya: "GO. Text me everything at 3 AM."`,
      },
    ],
  },
  {
    id: 8,
    heading: "Results Day",
    location: "Outside the results hall",
    dialogue: [
      "You won. The whole team did, but somehow it's him standing in front of you with a book in his hands.",
      "His favourite one. Every line he loved is underlined, and every single one of them, somehow, is about you.",
      `"Didn't say it was yours," he mutters. "Just said it reminded me of someone."`,
    ],
    prompt: "He's handing you the book. How do you react?",
    choices: [
      {
        id: "readnow",
        label: "Read the first underline out loud",
        spark: 3,
        reply: `You read the first underlined line out loud. Kabir goes very still. "I didn't say you should read it out loud."`,
      },
      {
        id: "readlater",
        label: "Keep it to read alone later",
        self: 2,
        reply: "You tuck it into your bag. Later, alone, you read every underline twice.",
      },
      {
        id: "askwhy",
        label: "Ask him why every line is about you",
        spark: 2,
        self: 1,
        reply: `"Because I'm an idiot," he says. "Obviously." Then, quieter: "...and not as much of one as I was pretending to be."`,
      },
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
