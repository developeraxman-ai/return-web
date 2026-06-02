import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";

const COOKIE_NAME = "return_session";

type TokenPayload = {
  userId: string;
  email: string;
};

function secret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
}

export function signSession(payload: TokenPayload) {
  return jwt.sign(payload, secret(), { expiresIn: "30d" });
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function readToken(req?: NextRequest) {
  return req?.cookies.get(COOKIE_NAME)?.value ?? cookies().get(COOKIE_NAME)?.value;
}

export async function getCurrentUser(req?: NextRequest) {
  const token = readToken(req);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret()) as TokenPayload;
    await connectDb();
    const user = await User.findById(decoded.userId).select("-passwordHash");
    return user;
  } catch {
    return null;
  }
}
