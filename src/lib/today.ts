const TIME_ZONE = "America/Bahia";

/** Today's date as 'YYYY-MM-DD' in the business's timezone, for comparing
 * against the plain-text dates stored on reservations/bills. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Today's day of week in the business's timezone: 0 = domingo ... 6 = sábado. */
export function todayDayOfWeek(): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "01";
  const todayInTz = new Date(Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day"))));
  return todayInTz.getUTCDay();
}

/** Adds `days` to a 'YYYY-MM-DD' string and returns the result in the same format. */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
