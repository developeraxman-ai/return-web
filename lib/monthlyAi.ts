import { weeklyAnalytics, type LogLike } from "@/lib/scoring";

export const monthlyInsightShape = {
  summary: "",
  returnScore: 0,
  bestPattern: "",
  worstPattern: "",
  addictionTrend: "",
  moneyTrend: "",
  workoutTrend: "",
  mindTrend: "",
  bodyTrend: "",
  nextMonthMission: "",
  oneRuleForNextMonth: "",
  closingLine: ""
};

export function buildMonthlyPrompt(logs: LogLike[]) {
  const analytics = weeklyAnalytics(logs);

  return `You are the monthly reflection engine for THE RETURN.

Analyze the last 30 days using quantities, not checkbox nonsense.
Look for escalation, reduction, repeated triggers, contradictions, and whether the user's words match the numbers.

Tone: honest, direct, brother-like, practical, challenging, slightly mocking when useful, not cruel.

Return only valid JSON:
${JSON.stringify(monthlyInsightShape, null, 2)}

30-day analytics:
${JSON.stringify(analytics, null, 2)}

Logs:
${JSON.stringify(logs, null, 2)}`;
}
