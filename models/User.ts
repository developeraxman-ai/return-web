import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    timezone: { type: String, default: "Asia/Calcutta" },
    lastDailyNotificationDate: { type: String, default: "" },
    lastWeeklyNotificationDay: { type: Number, default: 0 },
    lastMonthlyNotificationDay: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
