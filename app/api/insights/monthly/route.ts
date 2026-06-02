import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { daysAgo, toDateKey } from "@/lib/date";
import { monthlyEligible } from "@/lib/eligibility";
import { buildMonthlyPrompt, monthlyInsightShape } from "@/lib/monthlyAi";
import { weeklyAnalytics } from "@/lib/scoring";
import { DailyLog } from "@/models/DailyLog";
import { MonthlyInsight } from "@/models/MonthlyInsight";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDb();
  const monthStart = toDateKey(daysAgo(29));
  const monthEnd = toDateKey();
  const insight = await MonthlyInsight.findOne({ userId: user._id, monthStart, monthEnd }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ insight });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!monthlyEligible(user.createdAt)) {
    return NextResponse.json({ error: "Monthly truth unlocks on day 30, 60, 90... Earn the receipt first." }, { status: 403 });
  }

  await connectDb();
  const monthStart = toDateKey(daysAgo(29));
  const monthEnd = toDateKey();
  const logs = await DailyLog.find({ userId: user._id, date: { $gte: monthStart, $lte: monthEnd } }).sort({ date: 1 }).lean();
  if (!logs.length) return NextResponse.json({ error: "No logs found for the last 30 days." }, { status: 400 });

  const stats = weeklyAnalytics(logs as any);
  let parsed = { ...monthlyInsightShape, returnScore: stats.weeklyReturnScore };

  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildMonthlyPrompt(logs as any) }],
      response_format: { type: "json_object" },
      temperature: 0.7
    });
    parsed = { ...parsed, ...JSON.parse(completion.choices[0]?.message?.content ?? "{}") };
  } else {
    parsed.summary = "OPENAI_API_KEY is not set, so only app-calculated monthly score was saved.";
  }

  const insight = await MonthlyInsight.create({
    ...parsed,
    userId: user._id,
    monthStart,
    monthEnd,
    returnScore: Number(parsed.returnScore || stats.weeklyReturnScore),
    rawAiResponse: parsed
  });

  return NextResponse.json({ insight });
}
