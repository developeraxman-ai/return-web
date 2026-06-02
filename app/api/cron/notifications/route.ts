import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { daysSince, localParts } from "@/lib/eligibility";
import {
  dailyNotification,
  monthlyNotification,
  weeklyNotification
} from "@/lib/notificationCopy";
import { pushConfigured, sendPush } from "@/lib/push";
import { NotificationSubscription } from "@/models/NotificationSubscription";
import { User } from "@/models/User";

function authorized(req: NextRequest) {
  if (!process.env.CRON_SECRET) return process.env.NODE_ENV !== "production";
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

async function sendToUser(userId: string, payload: { title: string; body: string; url: string }) {
  const subscriptions = (await NotificationSubscription.find({ userId }).lean()) as any[];
  let sent = 0;

  for (const subscription of subscriptions) {
    try {
      await sendPush(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys
        },
        payload
      );
      sent += 1;
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await NotificationSubscription.deleteOne({ _id: subscription._id });
      }
    }
  }

  return sent;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!pushConfigured()) {
    return NextResponse.json({ error: "VAPID env vars are not set." }, { status: 500 });
  }

  await connectDb();
  const now = new Date();
  const users = (await User.find({})
    .select("_id timezone createdAt lastDailyNotificationDate lastWeeklyNotificationDay lastMonthlyNotificationDay")
    .lean()) as any[];
  const results = {
    checked: users.length,
    daily: 0,
    weekly: 0,
    monthly: 0,
    pushes: 0
  };

  for (const user of users) {
    const timezone = user.timezone || "Asia/Calcutta";
    const local = localParts(timezone, now);
    if (local.hour !== 21) continue;

    const userDay = daysSince(user.createdAt, now);
    const updates: Record<string, string | number> = {};
    const seed = userDay + local.dateKey.replaceAll("-", "").length;

    if (user.lastDailyNotificationDate !== local.dateKey) {
      results.pushes += await sendToUser(user._id.toString(), dailyNotification(seed));
      updates.lastDailyNotificationDate = local.dateKey;
      results.daily += 1;
    }

    if (userDay >= 7 && userDay % 7 === 0 && user.lastWeeklyNotificationDay !== userDay) {
      results.pushes += await sendToUser(user._id.toString(), weeklyNotification(seed + 7));
      updates.lastWeeklyNotificationDay = userDay;
      results.weekly += 1;
    }

    if (userDay >= 30 && userDay % 30 === 0 && user.lastMonthlyNotificationDay !== userDay) {
      results.pushes += await sendToUser(user._id.toString(), monthlyNotification(seed + 30));
      updates.lastMonthlyNotificationDay = userDay;
      results.monthly += 1;
    }

    if (Object.keys(updates).length) {
      await User.findByIdAndUpdate(user._id, updates);
    }
  }

  return NextResponse.json(results);
}
