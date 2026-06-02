import { redirect } from "next/navigation";
import { InsightButton } from "@/components/InsightButton";
import { InsightTabs } from "@/components/InsightTabs";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { daysAgo, toDateKey } from "@/lib/date";
import { daysSince, weeklyEligible } from "@/lib/eligibility";
import { weeklyAnalytics } from "@/lib/scoring";
import { DailyLog } from "@/models/DailyLog";
import { WeeklyInsight } from "@/models/WeeklyInsight";

const fields = [
  "weeklySummary", "addictionPattern", "smokingInsight", "alcoholInsight", "moneyInsight",
  "workoutInsight", "mindInsight", "bodyInsight", "triggerPattern", "hiddenPattern",
  "whereUserLiedToHimself", "biggestWin", "biggestLeak", "nextWeekMission",
  "oneRuleForNextWeek", "closingLine"
];

export default async function InsightsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await connectDb();
  const weekStart = toDateKey(daysAgo(6));
  const weekEnd = toDateKey();
  const logs = await DailyLog.find({ userId: user._id, date: { $gte: weekStart, $lte: weekEnd } }).sort({ date: 1 }).lean();
  const stats = weeklyAnalytics(logs as any);
  const insight: any = await WeeklyInsight.findOne({ userId: user._id, weekStart, weekEnd }).sort({ createdAt: -1 }).lean();
  const day = daysSince(user.createdAt);
  const eligible = weeklyEligible(user.createdAt);

  return (
    <Shell>
      <InsightTabs active="weekly" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Weekly Truth</h1>
          <p className="mt-2 text-zinc-400">Last 7 days: {weekStart} to {weekEnd}. Day {day}.</p>
        </div>
        <InsightButton disabled={!eligible} />
      </div>

      {!eligible ? (
        <div className="card mt-6">
          <p className="text-zinc-300">Weekly truth unlocks on day 7, 14, 21... No premature victory parade.</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Weekly Return Score" value={`${stats.weeklyReturnScore}%`} />
        <MetricCard label="Cigarettes" value={stats.totalCigarettes} detail={`${stats.smokeFreeDays}/7 smoke-free days`} />
        <MetricCard label="Alcohol-Free Days" value={`${stats.alcoholFreeDays}/7`} detail={`Quantity: ${stats.totalAlcoholQuantity}`} />
        <MetricCard label="Unnecessary Spending" value={`Rs. ${stats.unnecessarySpending}`} detail={`Total: Rs. ${stats.totalSpent}`} />
        <MetricCard label="Workout Minutes" value={stats.totalWorkoutMinutes} detail={`${stats.workoutDays} days`} />
        <MetricCard label="Mind Minutes" value={stats.meditationMinutes + stats.journalingMinutes + stats.reflectionMinutes} />
        <MetricCard label="Average Mood" value={stats.averageMood} />
        <MetricCard label="Average Energy" value={stats.averageEnergy} />
      </div>

      {insight ? (
        <section className="mt-8 grid gap-4">
          <div className="card border-return-amber">
            <div className="text-sm font-bold uppercase tracking-wide text-return-amber">Score {insight.returnScore}/100</div>
            <h2 className="mt-2 text-2xl font-black">Best: {insight.bestDay || stats.bestDay} | Worst: {insight.worstDay || stats.worstDay}</h2>
          </div>
          {fields.map((field) => (
            insight[field] ? (
              <article key={field} className="card">
                <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-return-amber">
                  {field.replace(/([A-Z])/g, " $1")}
                </h3>
                <p className="leading-7 text-zinc-200">{insight[field]}</p>
              </article>
            ) : null
          ))}
        </section>
      ) : (
        <div className="card mt-8">
          <p className="text-zinc-300">No weekly truth generated yet. Press the button. Yes, the scary one.</p>
        </div>
      )}
    </Shell>
  );
}
