import Link from "next/link";
import { redirect } from "next/navigation";
import { InsightTabs } from "@/components/InsightTabs";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { toDateKey } from "@/lib/date";
import {
  alcoholScore,
  bodyScore,
  dailyReturnScore,
  mindScore,
  moneyScore,
  smokingScore,
  workoutScore
} from "@/lib/scoring";
import { DailyLog } from "@/models/DailyLog";

function verdict(log: any) {
  const leaks = [];
  if ((log.cigaretteCount ?? 0) > 0) leaks.push(`${log.cigaretteCount} cigarettes`);
  if ((log.alcoholQuantity ?? 0) > 0) leaks.push(`${log.alcoholQuantity} ${log.alcoholUnit}`);
  if ((log.unnecessarySpentAmount ?? 0) > 0) leaks.push(`Rs. ${log.unnecessarySpentAmount} unnecessary spend`);
  if ((log.workoutDurationMinutes ?? 0) <= 0) leaks.push("zero workout minutes");

  if (!leaks.length) return "Clean day. Don't get poetic. Repeat it tomorrow.";
  return `Today's leaks: ${leaks.join(", ")}. Not a tragedy, just evidence. Use it.`;
}

export default async function DailyInsightsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await connectDb();
  const today = toDateKey();
  const log: any = await DailyLog.findOne({ userId: user._id, date: today }).lean();

  return (
    <Shell>
      <InsightTabs active="daily" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Daily Truth</h1>
          <p className="mt-2 text-zinc-400">{today}</p>
        </div>
        <Link className="btn" href="/checkin">Add Ledger</Link>
      </div>

      {!log ? (
        <div className="card mt-8">
          <p className="text-zinc-300">No ledger today. Daily insight needs data, not vibes.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Return Score" value={`${dailyReturnScore(log)}%`} />
            <MetricCard label="Smoking Score" value={Math.round(smokingScore(log))} detail={`${log.cigaretteCount} cigarettes, urge ${log.smokingUrgeLevel}`} />
            <MetricCard label="Alcohol Score" value={Math.round(alcoholScore(log))} detail={`${log.alcoholQuantity} ${log.alcoholUnit}, urge ${log.alcoholUrgeLevel}`} />
            <MetricCard label="Money Score" value={Math.round(moneyScore(log))} detail={`Rs. ${log.unnecessarySpentAmount} unnecessary`} />
            <MetricCard label="Workout Score" value={Math.round(workoutScore(log))} detail={`${log.workoutDurationMinutes} min, intensity ${log.workoutIntensity}`} />
            <MetricCard label="Mind Score" value={Math.round(mindScore(log))} detail={`${(log.meditationMinutes ?? 0) + (log.journalingMinutes ?? 0) + (log.reflectionMinutes ?? 0)} min`} />
            <MetricCard label="Body Score" value={Math.round(bodyScore(log))} detail={`${log.waterLitres}L water, ${log.sleepHours}h sleep`} />
            <MetricCard label="Mood / Energy" value={`${log.moodScore}/${log.energyScore}`} detail={`Discipline ${log.disciplineScore}`} />
          </div>

          <div className="card mt-8">
            <h2 className="text-xl font-black text-return-amber">Read This Without Flinching</h2>
            <p className="mt-3 leading-7 text-zinc-200">{verdict(log)}</p>
            <p className="mt-3 text-zinc-300">Trigger: {log.mainTrigger || "None logged. Convenient, but maybe true."}</p>
            <p className="mt-2 text-zinc-300">Lesson: {log.lesson || "No lesson written. The day apparently taught nothing. Sure."}</p>
          </div>
        </>
      )}
    </Shell>
  );
}
