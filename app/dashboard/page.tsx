import Link from "next/link";
import { redirect } from "next/navigation";
import { MetricCard } from "@/components/MetricCard";
import { PwaNotifications } from "@/components/PwaNotifications";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { daysAgo, toDateKey } from "@/lib/date";
import { weeklyAnalytics } from "@/lib/scoring";
import { DailyLog } from "@/models/DailyLog";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await connectDb();
  const today = toDateKey();
  const logs = await DailyLog.find({ userId: user._id, date: { $gte: toDateKey(daysAgo(6)), $lte: today } })
    .sort({ date: 1 })
    .lean();
  const todaysLog = logs.find((log) => log.date === today);
  const stats = weeklyAnalytics(logs as any);

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-return-amber">{today}</p>
          <h1 className="mt-2 text-4xl font-black">Daily Ledger</h1>
          <p className="mt-2 text-zinc-400">Did you keep your word?</p>
        </div>
        <div className="flex gap-3">
          <Link className="btn" href="/checkin">{todaysLog ? "Update Today" : "Check In"}</Link>
          <Link className="btn-secondary" href="/insights">Generate Weekly Truth</Link>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-return-line bg-return-panel p-4">
        <span className="font-bold text-zinc-100">Today:</span>{" "}
        <span className={todaysLog ? "text-return-amber" : "text-return-red"}>
          {todaysLog ? "Logged. Now the numbers can judge you." : "No log yet. Convenient."}
        </span>
      </div>

      <div className="mt-6">
        <PwaNotifications />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Weekly Return Score" value={`${stats.weeklyReturnScore}%`} detail="Calculated from quantity, intensity, and recovery." />
        <MetricCard label="Total Cigarettes" value={stats.totalCigarettes} detail={`${stats.smokeFreeDays}/7 smoke-free days`} />
        <MetricCard label="Alcohol-Free Days" value={`${stats.alcoholFreeDays}/7`} detail={`Total alcohol: ${stats.totalAlcoholQuantity}`} />
        <MetricCard label="Money Spent" value={`Rs. ${stats.totalSpent}`} detail={`Unnecessary: Rs. ${stats.unnecessarySpending}`} />
        <MetricCard label="Workout Days" value={stats.workoutDays} detail={`${stats.totalWorkoutMinutes} total minutes`} />
        <MetricCard label="Mind Minutes" value={stats.meditationMinutes + stats.journalingMinutes + stats.reflectionMinutes} detail={`Med ${stats.meditationMinutes} / Journal ${stats.journalingMinutes} / Reflect ${stats.reflectionMinutes}`} />
        <MetricCard label="Average Water" value={`${stats.averageWater}L`} />
        <MetricCard label="Mood / Energy / Discipline" value={`${stats.averageMood}/${stats.averageEnergy}/${stats.averageDiscipline}`} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link className="btn-secondary" href="/checkin">Check-in</Link>
        <Link className="btn-secondary" href="/history">History</Link>
        <Link className="btn-secondary" href="/insights">Insights</Link>
      </div>
    </Shell>
  );
}
