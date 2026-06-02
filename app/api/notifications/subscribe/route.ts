import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { NotificationSubscription } from "@/models/NotificationSubscription";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subscription, timezone } = await req.json();
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: "Invalid push subscription." }, { status: 400 });
  }

  await connectDb();
  await NotificationSubscription.findOneAndUpdate(
    { endpoint: subscription.endpoint },
    {
      userId: user._id,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userAgent: req.headers.get("user-agent") ?? "",
      lastSeenAt: new Date()
    },
    { upsert: true, new: true }
  );

  if (timezone) {
    await User.findByIdAndUpdate(user._id, { timezone });
  }

  return NextResponse.json({ ok: true });
}
