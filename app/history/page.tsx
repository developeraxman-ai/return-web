import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { DailyLog } from "@/models/DailyLog";
import { dailyReturnScore } from "@/lib/scoring";

export default async function HistoryPage({ searchParams }: { searchParams: { range?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await connectDb();
  const range = searchParams.range ?? "week";
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (range === "week") start.setUTCDate(start.getUTCDate() - 6);
  if (range === "month") start.setUTCDate(start.getUTCDate() - 30);
  const query = range === "all" ? { userId: user._id } : { userId: user._id, date: { $gte: start.toISOString().slice(0, 10) } };
  const logs = await DailyLog.find(query).sort({ date: -1 }).lean();

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">History</h1>
          <p className="mt-2 text-zinc-400">The pattern is the enemy.</p>
        </div>
        <div className="flex gap-2">
          {["week", "month", "all"].map((item) => (
            <a key={item} href={`/history?range=${item}`} className={item === range ? "btn" : "btn-secondary"}>
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {logs.map((log: any) => (
          <article key={log._id.toString()} className="card">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{log.date}</h2>
                <p className="text-sm text-zinc-400">Return Score: {dailyReturnScore(log)}/100</p>
              </div>
              <div className="text-right text-sm text-zinc-300">
                <div>{log.cigaretteCount} cigarettes | Alcohol {log.alcoholQuantity} {log.alcoholUnit}</div>
                <div>Rs. {log.amountSpent} spent | Rs. {log.unnecessarySpentAmount} unnecessary</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-3">
              <p>Workout: {log.workoutDurationMinutes} min, intensity {log.workoutIntensity}</p>
              <p>Mind: {(log.meditationMinutes ?? 0) + (log.journalingMinutes ?? 0) + (log.reflectionMinutes ?? 0)} min</p>
              <p>Water: {log.waterLitres}L | Sleep: {log.sleepHours}h</p>
              <p>Mood: {log.moodScore} | Energy: {log.energyScore} | Discipline: {log.disciplineScore}</p>
              <p>Trigger: {log.mainTrigger || "None logged"}</p>
              <p>Lesson: {log.lesson || "No lesson logged"}</p>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
