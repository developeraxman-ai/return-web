import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { setSessionCookie, signSession } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json({ error: "Name, email, and a 6+ character password are required." }, { status: 400 });
  }

  await connectDb();
  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) return NextResponse.json({ error: "Email already registered." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  setSessionCookie(signSession({ userId: user._id.toString(), email: user.email }));
  return NextResponse.json({ ok: true });
}
