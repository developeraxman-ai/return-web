import mongoose, { Schema, models } from "mongoose";

const MonthlyInsightSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    monthStart: { type: String, required: true },
    monthEnd: { type: String, required: true },
    summary: { type: String, default: "" },
    returnScore: { type: Number, default: 0 },
    bestPattern: { type: String, default: "" },
    worstPattern: { type: String, default: "" },
    addictionTrend: { type: String, default: "" },
    moneyTrend: { type: String, default: "" },
    workoutTrend: { type: String, default: "" },
    mindTrend: { type: String, default: "" },
    bodyTrend: { type: String, default: "" },
    nextMonthMission: { type: String, default: "" },
    oneRuleForNextMonth: { type: String, default: "" },
    closingLine: { type: String, default: "" },
    rawAiResponse: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

MonthlyInsightSchema.index({ userId: 1, monthStart: 1, monthEnd: 1 });

export const MonthlyInsight =
  models.MonthlyInsight || mongoose.model("MonthlyInsight", MonthlyInsightSchema);
