import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8)
      return NextResponse.json({ error: "Please provide a valid name, email, and 8+ character password." }, { status: 400 });
    const existing = await getDb().select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    await getDb().insert(users).values({ id: crypto.randomUUID(), name, email, passwordHash: await hashPassword(password) });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}
