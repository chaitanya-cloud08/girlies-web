export type RoomId = "opd" | "xray" | "emergency" | "pharmacy";

export const ROOMS: { id: RoomId; label: string; icon: string }[] = [
  { id: "opd", label: "OPD", icon: "🎬" },
  { id: "xray", label: "X-ray", icon: "🦴" },
  { id: "emergency", label: "Emergency", icon: "💔" },
  { id: "pharmacy", label: "Pharmacy", icon: "🥭" },
];

export type PatientTemplate = { complaint: string; room: RoomId | "any"; vip?: boolean };

export const PATIENT_TEMPLATES: PatientTemplate[] = [
  { complaint: "Slow-motion running injury", room: "xray" },
  { complaint: "Heartbreak after a rain song", room: "emergency" },
  { complaint: "Ate 6 mangoes in one go", room: "pharmacy" },
  { complaint: "Chronic dramatic entry syndrome", room: "opd" },
  { complaint: "Danced too hard at a sangeet", room: "xray" },
  { complaint: "Can't stop quoting dialogues", room: "opd" },
  { complaint: "Spice level: regretful", room: "pharmacy" },
  { complaint: "Twisted ankle mid-dandiya spin", room: "xray" },
  { complaint: "Crying during the interval", room: "emergency" },
  { complaint: "Forgot their own wedding hashtag", room: "opd" },
  { complaint: "Slipped on spilled chai", room: "xray" },
  { complaint: "Overdosed on plot twists", room: "pharmacy" },
  { complaint: "Second-hand embarrassment, acute", room: "emergency" },
  { complaint: "Refuses to believe the hero survives", room: "opd" },
];

export const VIP_PATIENT: PatientTemplate = { complaint: "Not sick, just here to say you're iconic", room: "any", vip: true };

export type ShiftConfig = { id: number; name: string; totalPatients: number; spawnMs: number; patienceMs: number; maxWaiting: number };

export const SHIFTS: ShiftConfig[] = [
  { id: 1, name: "Calm Morning", totalPatients: 8, spawnMs: 3200, patienceMs: 13000, maxWaiting: 3 },
  { id: 2, name: "Busy Evening", totalPatients: 12, spawnMs: 2400, patienceMs: 10000, maxWaiting: 4 },
  { id: 3, name: "Bollywood-Level Night Shift", totalPatients: 16, spawnMs: 1800, patienceMs: 8000, maxWaiting: 5 },
];

export const NEET_NOTES = ["Year 1: Didn't give up.", "Year 2: Didn't give up. Year 3: Didn't give up.", "Now: Dr. P."];

export const STARTING_HEARTS = 4;
export const POINTS_CORRECT = 10;
export const POINTS_VIP = 25;
export const CHILL_MS = 6000;
export const BADGE_SCORE = 300;
