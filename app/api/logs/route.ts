import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { DailyLog } from "@/models/DailyLog";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDb();
  const logs = await DailyLog.find({ userId: user._id }).sort({ date: -1 }).lean();
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.date || !body.disciplineScore) {
    return NextResponse.json({ error: "Date and discipline score are required." }, { status: 400 });
  }
  await connectDb();
  const log = await DailyLog.findOneAndUpdate(
    { userId: user._id, date: body.date },
    { ...body, userId: user._id },
    { upsert: true, new: true, runValidators: true }
  );
  return NextResponse.json({ log });
}
