export type LogLike = {
  date: string;
  smoked?: boolean;
  cigaretteCount?: number;
  smokingUrgeLevel?: number;
  alcoholConsumed?: boolean;
  alcoholQuantity?: number;
  alcoholUrgeLevel?: number;
  workoutDone?: boolean;
  workoutDurationMinutes?: number;
  workoutIntensity?: number;
  meditationMinutes?: number;
  meditationQuality?: number;
  journalingMinutes?: number;
  journalingQuality?: number;
  reflectionMinutes?: number;
  reflectionQuality?: number;
  amountSpent?: number;
  unnecessarySpentAmount?: number;
  badFinancialDecision?: boolean;
  financialControlScore?: number;
  waterLitres?: number;
  sleepHours?: number;
  moodScore?: number;
  energyScore?: number;
  disciplineScore?: number;
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const n = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export function smokingScore(log: LogLike) {
  return clamp(100 - n(log.cigaretteCount) * 12 - Math.max(0, n(log.smokingUrgeLevel) - 5) * 4);
}

export function alcoholScore(log: LogLike) {
  return clamp(100 - n(log.alcoholQuantity) * 18 - Math.max(0, n(log.alcoholUrgeLevel) - 5) * 4);
}

export function workoutScore(log: LogLike) {
  if (!log.workoutDone || n(log.workoutDurationMinutes) <= 0) return 20;
  const duration = clamp(n(log.workoutDurationMinutes) / 60, 0, 1) * 70;
  const intensity = clamp(n(log.workoutIntensity) * 3, 0, 30);
  return clamp(duration + intensity);
}

export function mindScore(log: LogLike) {
  const minutes = n(log.meditationMinutes) + n(log.journalingMinutes) + n(log.reflectionMinutes);
  const quality = avg([n(log.meditationQuality), n(log.journalingQuality), n(log.reflectionQuality)].filter(Boolean));
  return clamp(minutes * 2 + quality * 6);
}

export function moneyScore(log: LogLike) {
  const leakPenalty = n(log.unnecessarySpentAmount) > 0 ? Math.min(45, n(log.unnecessarySpentAmount) / 20) : 0;
  const decisionPenalty = log.badFinancialDecision ? 20 : 0;
  return clamp(n(log.financialControlScore) * 10 - leakPenalty - decisionPenalty);
}

export function bodyScore(log: LogLike) {
  const water = clamp((n(log.waterLitres) / 3) * 35);
  const sleep = clamp((n(log.sleepHours) / 8) * 35);
  const moodEnergy = ((n(log.moodScore) + n(log.energyScore)) / 20) * 30;
  return clamp(water + sleep + moodEnergy);
}

export function dailyReturnScore(log: LogLike) {
  return Math.round(
    smokingScore(log) * 0.15 +
      alcoholScore(log) * 0.15 +
      workoutScore(log) * 0.15 +
      mindScore(log) * 0.15 +
      moneyScore(log) * 0.15 +
      bodyScore(log) * 0.15 +
      n(log.disciplineScore) * 10 * 0.1
  );
}

export function weeklyAnalytics(logs: LogLike[]) {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const scores = sorted.map((log) => ({ date: log.date, score: dailyReturnScore(log) }));
  const best = scores.reduce((top, item) => (!top || item.score > top.score ? item : top), null as null | { date: string; score: number });
  const worst = scores.reduce((low, item) => (!low || item.score < low.score ? item : low), null as null | { date: string; score: number });

  return {
    totalCigarettes: sorted.reduce((sum, log) => sum + n(log.cigaretteCount), 0),
    smokeFreeDays: sorted.filter((log) => !log.smoked && n(log.cigaretteCount) === 0).length,
    alcoholFreeDays: sorted.filter((log) => !log.alcoholConsumed && n(log.alcoholQuantity) === 0).length,
    totalAlcoholQuantity: sorted.reduce((sum, log) => sum + n(log.alcoholQuantity), 0),
    totalSpent: sorted.reduce((sum, log) => sum + n(log.amountSpent), 0),
    unnecessarySpending: sorted.reduce((sum, log) => sum + n(log.unnecessarySpentAmount), 0),
    workoutDays: sorted.filter((log) => log.workoutDone && n(log.workoutDurationMinutes) > 0).length,
    totalWorkoutMinutes: sorted.reduce((sum, log) => sum + n(log.workoutDurationMinutes), 0),
    meditationMinutes: sorted.reduce((sum, log) => sum + n(log.meditationMinutes), 0),
    journalingMinutes: sorted.reduce((sum, log) => sum + n(log.journalingMinutes), 0),
    reflectionMinutes: sorted.reduce((sum, log) => sum + n(log.reflectionMinutes), 0),
    averageWater: Number(avg(sorted.map((log) => n(log.waterLitres))).toFixed(1)),
    averageMood: Number(avg(sorted.map((log) => n(log.moodScore))).toFixed(1)),
    averageEnergy: Number(avg(sorted.map((log) => n(log.energyScore))).toFixed(1)),
    averageDiscipline: Number(avg(sorted.map((log) => n(log.disciplineScore))).toFixed(1)),
    weeklyReturnScore: Math.round(avg(scores.map((item) => item.score))),
    bestDay: best?.date ?? "",
    worstDay: worst?.date ?? "",
    dailyScores: scores
  };
}
