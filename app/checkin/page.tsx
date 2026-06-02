import { redirect } from "next/navigation";
import { CheckinForm } from "@/components/CheckinForm";
import { Shell } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { toDateKey } from "@/lib/date";
import { DailyLog } from "@/models/DailyLog";

export default async function CheckinPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await connectDb();
  const log = await DailyLog.findOne({ userId: user._id, date: toDateKey() }).lean();

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-4xl font-black">Today&apos;s Return Score</h1>
        <p className="mt-2 text-zinc-400">Track the quantity. The yes/no game is how people lie politely.</p>
      </div>
      <CheckinForm initialLog={log ? JSON.parse(JSON.stringify(log)) : null} />
    </Shell>
  );
}
