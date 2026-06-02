import mongoose, { Schema, models } from "mongoose";

const WeeklyInsightSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekStart: { type: String, required: true },
    weekEnd: { type: String, required: true },
    weeklySummary: { type: String, default: "" },
    returnScore: { type: Number, default: 0 },
    bestDay: { type: String, default: "" },
    worstDay: { type: String, default: "" },
    addictionPattern: { type: String, default: "" },
    smokingInsight: { type: String, default: "" },
    alcoholInsight: { type: String, default: "" },
    moneyInsight: { type: String, default: "" },
    workoutInsight: { type: String, default: "" },
    mindInsight: { type: String, default: "" },
    bodyInsight: { type: String, default: "" },
    triggerPattern: { type: String, default: "" },
    hiddenPattern: { type: String, default: "" },
    whereUserLiedToHimself: { type: String, default: "" },
    biggestWin: { type: String, default: "" },
    biggestLeak: { type: String, default: "" },
    nextWeekMission: { type: String, default: "" },
    oneRuleForNextWeek: { type: String, default: "" },
    closingLine: { type: String, default: "" },
    rawAiResponse: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

WeeklyInsightSchema.index({ userId: 1, weekStart: 1, weekEnd: 1 });

export const WeeklyInsight =
  models.WeeklyInsight || mongoose.model("WeeklyInsight", WeeklyInsightSchema);
