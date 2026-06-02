"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MonthlyInsightButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/insights/monthly", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not generate monthly insight.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button className="btn" disabled={disabled || loading} onClick={generate} type="button">
        {loading ? "Generating..." : "Generate Monthly Truth"}
      </button>
      {error ? <p className="mt-2 text-sm font-bold text-return-red">{error}</p> : null}
    </div>
  );
}
