import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { toDateKey } from "@/lib/date";
import { DailyLog } from "@/models/DailyLog";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDb();
  const log = await DailyLog.findOne({ userId: user._id, date: toDateKey() }).lean();
  return NextResponse.json({ log });
}

async function saveToday(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.disciplineScore) {
    return NextResponse.json({ error: "Discipline score is required." }, { status: 400 });
  }
  await connectDb();
  const log = await DailyLog.findOneAndUpdate(
    { userId: user._id, date: toDateKey() },
    { ...body, userId: user._id, date: toDateKey() },
    { upsert: true, new: true, runValidators: true }
  );
  return NextResponse.json({ log });
}

export const POST = saveToday;
export const PUT = saveToday;
