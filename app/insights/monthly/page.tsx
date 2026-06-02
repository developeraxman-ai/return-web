import { redirect } from "next/navigation";
import { InsightTabs } from "@/components/InsightTabs";
import { MetricCard } from "@/components/MetricCard";
import { MonthlyInsightButton } from "@/components/MonthlyInsightButton";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { daysAgo, toDateKey } from "@/lib/date";
import { daysSince, monthlyEligible } from "@/lib/eligibility";
import { weeklyAnalytics } from "@/lib/scoring";
import { DailyLog } from "@/models/DailyLog";
import { MonthlyInsight } from "@/models/MonthlyInsight";

const fields = [
  "summary",
  "bestPattern",
  "worstPattern",
  "addictionTrend",
  "moneyTrend",
  "workoutTrend",
  "mindTrend",
  "bodyTrend",
  "nextMonthMission",
  "oneRuleForNextMonth",
  "closingLine"
];

export default async function MonthlyInsightsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await connectDb();
  const monthStart = toDateKey(daysAgo(29));
  const monthEnd = toDateKey();
  const logs = await DailyLog.find({ userId: user._id, date: { $gte: monthStart, $lte: monthEnd } }).sort({ date: 1 }).lean();
  const stats = weeklyAnalytics(logs as any);
  const insight: any = await MonthlyInsight.findOne({ userId: user._id, monthStart, monthEnd }).sort({ createdAt: -1 }).lean();
  const day = daysSince(user.createdAt);
  const eligible = monthlyEligible(user.createdAt);

  return (
    <Shell>
      <InsightTabs active="monthly" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Monthly Truth</h1>
          <p className="mt-2 text-zinc-400">Day {day}. Unlocks on day 30, 60, 90...</p>
        </div>
        <MonthlyInsightButton disabled={!eligible} />
      </div>

      {!eligible ? (
        <div className="card mt-6">
          <p className="text-zinc-300">Monthly truth is locked. Thirty days first. Patience, warrior accountant.</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="30-Day Return Score" value={`${stats.weeklyReturnScore}%`} />
        <MetricCard label="Cigarettes" value={stats.totalCigarettes} />
        <MetricCard label="Alcohol-Free Days" value={stats.alcoholFreeDays} />
        <MetricCard label="Unnecessary Spending" value={`Rs. ${stats.unnecessarySpending}`} />
        <MetricCard label="Workout Minutes" value={stats.totalWorkoutMinutes} />
        <MetricCard label="Mind Minutes" value={stats.meditationMinutes + stats.journalingMinutes + stats.reflectionMinutes} />
        <MetricCard label="Average Mood" value={stats.averageMood} />
        <MetricCard label="Average Energy" value={stats.averageEnergy} />
      </div>

      {insight ? (
        <section className="mt-8 grid gap-4">
          <div className="card border-return-amber">
            <div className="text-sm font-bold uppercase tracking-wide text-return-amber">Score {insight.returnScore}/100</div>
            <h2 className="mt-2 text-2xl font-black">Thirty-day receipt</h2>
          </div>
          {fields.map((field) =>
            insight[field] ? (
              <article key={field} className="card">
                <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-return-amber">
                  {field.replace(/([A-Z])/g, " $1")}
                </h3>
                <p className="leading-7 text-zinc-200">{insight[field]}</p>
              </article>
            ) : null
          )}
        </section>
      ) : null}
    </Shell>
  );
}
