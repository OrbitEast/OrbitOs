"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function SignupForm() {
  const [error, setError] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }),
    });
    if (!response.ok) { const data = await response.json().catch(() => null); setError(data?.error ?? "Could not create your account."); return; }
    window.location.href = "/login";
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Create your OrbitOS account</h1>
        <p className="mt-2 text-sm text-zinc-500">Start with your user account. Business setup comes next.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input name="name" required minLength={2} placeholder="Your name" autoComplete="name" className="w-full rounded-xl border px-4 py-3" />
          <input name="email" type="email" required placeholder="Email" autoComplete="email" className="w-full rounded-xl border px-4 py-3" />
          <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" autoComplete="new-password" className="w-full rounded-xl border px-4 py-3" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white">Create account</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">Already have an account? <Link href="/login" className="font-medium text-black">Sign in</Link></p>
      </div>
    </main>
  );
}
