"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const bodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio", "Full Body", "Rest", "None"];
const alcoholUnits = ["pegs", "beers", "glasses", "ml", "other"];

function boolValue(value: unknown) {
  return value === true || value === "on";
}

export function CheckinForm({ initialLog }: { initialLog: Record<string, any> | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const log = initialLog ?? {};

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(form.entries());
    const numberFields = [
      "cigaretteCount", "smokingUrgeLevel", "alcoholQuantity", "alcoholUrgeLevel", "amountSpent",
      "unnecessarySpentAmount", "financialControlScore", "workoutDurationMinutes", "workoutIntensity",
      "meditationMinutes", "meditationQuality", "journalingMinutes", "journalingQuality",
      "reflectionMinutes", "reflectionQuality", "waterLitres", "sleepHours", "moodScore",
      "energyScore", "disciplineScore"
    ];
    const body: Record<string, any> = { ...raw };
    ["smoked", "alcoholConsumed", "badFinancialDecision", "workoutDone"].forEach((key) => {
      body[key] = boolValue(raw[key]);
    });
    numberFields.forEach((key) => {
      body[key] = Number(raw[key] ?? 0);
    });

    const res = await fetch("/api/logs/today", {
      method: initialLog ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const input = (name: string, fallback: string | number = "") => log[name] ?? fallback;

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-black">Addiction</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" name="smoked" defaultChecked={!!log.smoked} /> Smoked?</label>
          <div><label className="label">Cigarettes</label><input className="field" name="cigaretteCount" type="number" min="0" defaultValue={input("cigaretteCount", 0)} /></div>
          <div><label className="label">Smoking urge 1-10</label><input className="field" name="smokingUrgeLevel" type="number" min="1" max="10" defaultValue={input("smokingUrgeLevel", 1)} /></div>
          <div><label className="label">Smoking context</label><input className="field" name="smokingContext" defaultValue={input("smokingContext")} /></div>
          <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" name="alcoholConsumed" defaultChecked={!!log.alcoholConsumed} /> Alcohol?</label>
          <div><label className="label">Alcohol quantity</label><input className="field" name="alcoholQuantity" type="number" min="0" step="0.1" defaultValue={input("alcoholQuantity", 0)} /></div>
          <div><label className="label">Alcohol unit</label><select className="field" name="alcoholUnit" defaultValue={input("alcoholUnit", "pegs")}>{alcoholUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></div>
          <div><label className="label">Alcohol urge 1-10</label><input className="field" name="alcoholUrgeLevel" type="number" min="1" max="10" defaultValue={input("alcoholUrgeLevel", 1)} /></div>
          <div className="md:col-span-2"><label className="label">Alcohol context</label><input className="field" name="alcoholContext" defaultValue={input("alcoholContext")} /></div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-black">Money</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" name="badFinancialDecision" defaultChecked={!!log.badFinancialDecision} /> Bad decision?</label>
          <div><label className="label">Total spent</label><input className="field" name="amountSpent" type="number" min="0" defaultValue={input("amountSpent", 0)} /></div>
          <div><label className="label">Unnecessary spent</label><input className="field" name="unnecessarySpentAmount" type="number" min="0" defaultValue={input("unnecessarySpentAmount", 0)} /></div>
          <div><label className="label">Category</label><input className="field" name="spendingCategory" defaultValue={input("spendingCategory")} /></div>
          <div><label className="label">Financial control 1-10</label><input className="field" name="financialControlScore" type="number" min="1" max="10" defaultValue={input("financialControlScore", 5)} /></div>
          <div><label className="label">Spending note</label><input className="field" name="spendingNote" defaultValue={input("spendingNote")} /></div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-black">Workout and Mind</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" name="workoutDone" defaultChecked={!!log.workoutDone} /> Workout?</label>
          <div><label className="label">Minutes</label><input className="field" name="workoutDurationMinutes" type="number" min="0" defaultValue={input("workoutDurationMinutes", 0)} /></div>
          <div><label className="label">Intensity 1-10</label><input className="field" name="workoutIntensity" type="number" min="1" max="10" defaultValue={input("workoutIntensity", 1)} /></div>
          <div><label className="label">Body part</label><select className="field" name="workoutBodyPart" defaultValue={input("workoutBodyPart", "None")}>{bodyParts.map((part) => <option key={part}>{part}</option>)}</select></div>
          <div><label className="label">Type</label><input className="field" name="workoutType" defaultValue={input("workoutType")} /></div>
          <div><label className="label">Workout note</label><input className="field" name="workoutNote" defaultValue={input("workoutNote")} /></div>
          {["meditation", "journaling", "reflection"].map((key) => (
            <div key={key} className="grid gap-3 rounded-md border border-return-line p-3">
              <div className="font-bold capitalize">{key}</div>
              <input className="field" name={`${key}Minutes`} type="number" min="0" placeholder="Minutes" defaultValue={input(`${key}Minutes`, 0)} />
              <input className="field" name={`${key}Quality`} type="number" min="1" max="10" placeholder="Quality 1-10" defaultValue={input(`${key}Quality`, 1)} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-black">Body and Emotional Truth</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div><label className="label">Water litres</label><input className="field" name="waterLitres" type="number" min="0" step="0.1" defaultValue={input("waterLitres", 0)} /></div>
          <div><label className="label">Sleep hours</label><input className="field" name="sleepHours" type="number" min="0" step="0.1" defaultValue={input("sleepHours", 0)} /></div>
          <div><label className="label">Mood 1-10</label><input className="field" name="moodScore" type="number" min="1" max="10" defaultValue={input("moodScore", 5)} /></div>
          <div><label className="label">Energy 1-10</label><input className="field" name="energyScore" type="number" min="1" max="10" defaultValue={input("energyScore", 5)} /></div>
          <div><label className="label">Discipline 1-10</label><input className="field" name="disciplineScore" type="number" min="1" max="10" required defaultValue={input("disciplineScore", 5)} /></div>
          <div><label className="label">Main trigger</label><input className="field" name="mainTrigger" defaultValue={input("mainTrigger")} /></div>
          <div><label className="label">Bothered by</label><textarea className="field" name="botheredBy" defaultValue={input("botheredBy")} /></div>
          <div><label className="label">Proud of</label><textarea className="field" name="proudOf" defaultValue={input("proudOf")} /></div>
          <div><label className="label">Lesson</label><textarea className="field" name="lesson" defaultValue={input("lesson")} /></div>
        </div>
      </div>

      {error ? <p className="font-bold text-return-red">{error}</p> : null}
      <button className="btn" disabled={saving}>{saving ? "Saving..." : "Save today's ledger"}</button>
    </form>
  );
}
