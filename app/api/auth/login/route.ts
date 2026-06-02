import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { setSessionCookie, signSession } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDb();
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  setSessionCookie(signSession({ userId: user._id.toString(), email: user.email }));
  return NextResponse.json({ ok: true });
}
