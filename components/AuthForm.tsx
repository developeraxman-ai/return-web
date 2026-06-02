"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something broke.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card mx-auto mt-10 max-w-md space-y-4">
      <div>
        <h1 className="text-3xl font-black">{mode === "login" ? "Login" : "Register"}</h1>
        <p className="mt-2 text-sm text-zinc-400">No speeches today. Just the truth.</p>
      </div>
      {mode === "register" ? (
        <div>
          <label className="label">Name</label>
          <input className="field" name="name" required />
        </div>
      ) : null}
      <div>
        <label className="label">Email</label>
        <input className="field" name="email" type="email" required />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="field" name="password" type="password" required minLength={6} />
      </div>
      {error ? <p className="text-sm font-bold text-return-red">{error}</p> : null}
      <button className="btn w-full" disabled={loading}>
        {loading ? "Working..." : mode === "login" ? "Login" : "Create Account"}
      </button>
    </form>
  );
}
