import webpush, { type PushSubscription } from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  url: string;
};

export function pushConfigured() {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT
  );
}

export function configureWebPush() {
  if (!pushConfigured()) {
    throw new Error("VAPID env vars are not set");
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT as string,
    process.env.VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  );
}

export async function sendPush(subscription: PushSubscription, payload: PushPayload) {
  configureWebPush();
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

export function getPublicVapidKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || "";
}
