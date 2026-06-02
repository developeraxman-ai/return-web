export function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function startOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function daysAgo(days: number) {
  const date = startOfToday();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

export function lastSevenDayKeys() {
  return Array.from({ length: 7 }, (_, index) => toDateKey(daysAgo(6 - index)));
}
