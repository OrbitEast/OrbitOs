"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function LoginForm() {
  const [error, setError] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (result?.error) { setError("Invalid email or password."); return; }
    window.location.href = "/app";
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to OrbitOS</h1>
        <p className="mt-2 text-sm text-zinc-500">Your business workspace, in one place.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input name="email" type="email" required placeholder="Email" autoComplete="email" className="w-full rounded-xl border px-4 py-3" />
          <input name="password" type="password" required minLength={8} placeholder="Password" autoComplete="current-password" className="w-full rounded-xl border px-4 py-3" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white">Sign in</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">New to OrbitOS? <Link href="/signup" className="font-medium text-black">Create an account</Link></p>
      </div>
    </main>
  );
}
