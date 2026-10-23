export const TZ = "Asia/Kolkata";

/** Today's date in India as YYYY-MM-DD. */
export function istDay(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

export function istHour(d = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false }).format(d)
  ) % 24;
}

export function istTime(d = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export function dayNumber(day: string) {
  const [y, m, dd] = day.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, dd) / 86400000);
}

export function prettyDate(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
