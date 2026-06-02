const daily = [
  "9 PM. Ledger time. Your excuses have had the whole day to rehearse.",
  "Add the ledger. Future you needs data, not your heroic memory.",
  "Daily insight is waiting. Go see if today was discipline or theatre.",
  "Check in now. The old routine would love you to skip this."
];

const weekly = [
  "Weekly truth unlocked. Seven days of evidence. Be brave, professor.",
  "Day 7. The pattern has fingerprints. Go look at them.",
  "Weekly insight is ready. Either take the challenge or protect the excuses.",
  "Seven days logged. Time to see whether you were serious or just dramatic."
];

const monthly = [
  "Monthly truth unlocked. Thirty days. That is not a mood, that is a pattern.",
  "Day 30. The scoreboard is open. Walk in like a man and read it.",
  "Monthly insight is ready. This is where the routine either bows or exposes you.",
  "Thirty days of receipts. Go collect the lesson before ego edits the story."
];

function pick(items: string[], seed: number) {
  return items[Math.abs(seed) % items.length];
}

export function dailyNotification(seed: number) {
  return {
    title: "THE RETURN: 9 PM",
    body: pick(daily, seed),
    url: "/insights/daily"
  };
}

export function weeklyNotification(seed: number) {
  return {
    title: "Weekly Truth Unlocked",
    body: pick(weekly, seed),
    url: "/insights"
  };
}

export function monthlyNotification(seed: number) {
  return {
    title: "Monthly Truth Unlocked",
    body: pick(monthly, seed),
    url: "/insights/monthly"
  };
}
