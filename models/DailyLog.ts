import mongoose, { Schema, models } from "mongoose";

const DailyLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },

    smoked: { type: Boolean, default: false },
    cigaretteCount: { type: Number, default: 0 },
    smokingUrgeLevel: { type: Number, default: 1, min: 1, max: 10 },
    smokingContext: { type: String, default: "" },

    alcoholConsumed: { type: Boolean, default: false },
    alcoholQuantity: { type: Number, default: 0 },
    alcoholUnit: { type: String, enum: ["pegs", "beers", "glasses", "ml", "other"], default: "pegs" },
    alcoholUrgeLevel: { type: Number, default: 1, min: 1, max: 10 },
    alcoholContext: { type: String, default: "" },

    badFinancialDecision: { type: Boolean, default: false },
    amountSpent: { type: Number, default: 0 },
    unnecessarySpentAmount: { type: Number, default: 0 },
    spendingCategory: { type: String, default: "" },
    financialControlScore: { type: Number, default: 5, min: 1, max: 10 },
    spendingNote: { type: String, default: "" },

    workoutDone: { type: Boolean, default: false },
    workoutDurationMinutes: { type: Number, default: 0 },
    workoutIntensity: { type: Number, default: 1, min: 1, max: 10 },
    workoutBodyPart: {
      type: String,
      enum: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio", "Full Body", "Rest", "None"],
      default: "None"
    },
    workoutType: { type: String, default: "" },
    workoutNote: { type: String, default: "" },

    meditationMinutes: { type: Number, default: 0 },
    meditationQuality: { type: Number, default: 1, min: 1, max: 10 },
    journalingMinutes: { type: Number, default: 0 },
    journalingQuality: { type: Number, default: 1, min: 1, max: 10 },
    reflectionMinutes: { type: Number, default: 0 },
    reflectionQuality: { type: Number, default: 1, min: 1, max: 10 },

    waterLitres: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    moodScore: { type: Number, default: 5, min: 1, max: 10 },
    energyScore: { type: Number, default: 5, min: 1, max: 10 },
    disciplineScore: { type: Number, required: true, min: 1, max: 10 },

    mainTrigger: { type: String, default: "" },
    botheredBy: { type: String, default: "" },
    proudOf: { type: String, default: "" },
    lesson: { type: String, default: "" }
  },
  { timestamps: true }
);

DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyLog = models.DailyLog || mongoose.model("DailyLog", DailyLogSchema);
