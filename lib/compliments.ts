import { dayNumber } from "./dates";

function seededShuffle(n: number, seedStr: string) {
  let seed = 0;
  for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/** Same compliment all day; no repeats until the whole list has been seen. */
export function complimentFor(slug: string, list: string[], day: string) {
  const n = dayNumber(day);
  const cycle = Math.floor(n / list.length);
  const order = seededShuffle(list.length, `${slug}-${cycle}`);
  return list[order[n % list.length]];
}
