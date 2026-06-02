import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-return-black px-4 py-10">
      <AuthForm mode="register" />
      <p className="mt-5 text-center text-sm text-zinc-400">
        Already registered? <Link href="/login" className="font-bold text-return-amber">Login</Link>
      </p>
    </main>
  );
}
