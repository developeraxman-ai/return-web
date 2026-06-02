import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { buildWeeklyPrompt, weeklyInsightShape } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { daysAgo, toDateKey } from "@/lib/date";
import { weeklyEligible } from "@/lib/eligibility";
import { weeklyAnalytics } from "@/lib/scoring";
import { DailyLog } from "@/models/DailyLog";
import { WeeklyInsight } from "@/models/WeeklyInsight";

async function weeklyLogs(userId: string) {
  await connectDb();
  return DailyLog.find({ userId, date: { $gte: toDateKey(daysAgo(6)), $lte: toDateKey() } })
    .sort({ date: 1 })
    .lean();
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDb();
  const insight = await WeeklyInsight.findOne({
    userId: user._id,
    weekStart: toDateKey(daysAgo(6)),
    weekEnd: toDateKey()
  }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ insight });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!weeklyEligible(user.createdAt)) {
    return NextResponse.json({ error: "Weekly truth unlocks on day 7, 14, 21... Earn the receipt first." }, { status: 403 });
  }
  const logs = await weeklyLogs(user._id.toString());
  if (!logs.length) return NextResponse.json({ error: "No logs found for the last 7 days." }, { status: 400 });

  const analytics = weeklyAnalytics(logs as any);
  let parsed = { ...weeklyInsightShape, returnScore: analytics.weeklyReturnScore };

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildWeeklyPrompt(logs as any) }],
      response_format: { type: "json_object" },
      temperature: 0.7
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    parsed = { ...parsed, ...JSON.parse(raw) };
  } else {
    parsed.weeklySummary = "OPENAI_API_KEY is not set, so only the app-calculated weekly score was saved.";
  }

  const insight = await WeeklyInsight.create({
    ...parsed,
    userId: user._id,
    weekStart: toDateKey(daysAgo(6)),
    weekEnd: toDateKey(),
    returnScore: Number(parsed.returnScore || analytics.weeklyReturnScore),
    rawAiResponse: parsed
  });

  return NextResponse.json({ insight });
}
