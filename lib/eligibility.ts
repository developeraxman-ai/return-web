const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysSince(date: Date, now = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.floor((end - start) / MS_PER_DAY));
}

export function weeklyEligible(createdAt: Date, now = new Date()) {
  const day = daysSince(createdAt, now);
  return day >= 7 && day % 7 === 0;
}

export function monthlyEligible(createdAt: Date, now = new Date()) {
  const day = daysSince(createdAt, now);
  return day >= 30 && day % 30 === 0;
}

export function localParts(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);

  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    dateKey: `${value("year")}-${value("month")}-${value("day")}`,
    hour: Number(value("hour"))
  };
}
