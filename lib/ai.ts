import { weeklyAnalytics, type LogLike } from "@/lib/scoring";

export const weeklyInsightShape = {
  weeklySummary: "",
  returnScore: 0,
  bestDay: "",
  worstDay: "",
  addictionPattern: "",
  smokingInsight: "",
  alcoholInsight: "",
  moneyInsight: "",
  workoutInsight: "",
  mindInsight: "",
  bodyInsight: "",
  triggerPattern: "",
  hiddenPattern: "",
  whereUserLiedToHimself: "",
  biggestWin: "",
  biggestLeak: "",
  nextWeekMission: "",
  oneRuleForNextWeek: "",
  closingLine: ""
};

export function buildWeeklyPrompt(logs: LogLike[]) {
  const analytics = weeklyAnalytics(logs);

  return `You are the weekly reflection engine for a discipline tracking app called THE RETURN.

The user logs daily quantitative and qualitative discipline data:
- alcohol quantity, urge level, and context
- cigarette count, urge level, and context
- total spending, unnecessary spending, category, and financial control score
- workout duration, intensity, type, and body part
- meditation, journaling, and reflection minutes with quality scores
- water intake
- sleep hours
- mood score
- energy score
- discipline score
- emotional trigger
- botheredBy, proudOf, and lesson

Analyze the last 7 days.

Do not only count yes/no completion.
Look for intensity, quantity, patterns, escalation, reduction, triggers, and contradictions.

Your tone should be honest, direct, brother-like, practical, slightly sarcastic when useful, but not cruel.

Return only valid JSON:

${JSON.stringify(weeklyInsightShape, null, 2)}

Weekly analytics already calculated by the app:
${JSON.stringify(analytics, null, 2)}

Here are the logs:
${JSON.stringify(logs, null, 2)}

Important:
- Build analytics using quantities, not just yes/no.
- Mention weekly totals, averages, best/worst days, and trends.
- Analyze escalation, reduction, triggers, contradictions, and intensity.
- Use returnScore as the weekly return score out of 100.`;
}
