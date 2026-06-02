import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-return-black px-4 py-10">
      <AuthForm mode="login" />
      <p className="mt-5 text-center text-sm text-zinc-400">
        New here? <Link href="/register" className="font-bold text-return-amber">Register</Link>
      </p>
    </main>
  );
}
