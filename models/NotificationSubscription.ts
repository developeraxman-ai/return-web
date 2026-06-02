import mongoose, { Schema, models } from "mongoose";

const NotificationSubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    },
    userAgent: { type: String, default: "" },
    lastSeenAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const NotificationSubscription =
  models.NotificationSubscription ||
  mongoose.model("NotificationSubscription", NotificationSubscriptionSchema);
