"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = "/app";
  }

  return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        <h1 className="text-page-title">Sign in to OrbitOS</h1>
        <p className="text-secondary" style={{ marginTop: 8 }}>Your business workspace, in one place.</p>
        <form onSubmit={onSubmit} className="space-y-4" style={{ marginTop: 28 }}>
          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@business.com"
              autoComplete="email"
              className="input"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input"
            />
          </div>
          {error && <p className="text-secondary" style={{ color: "var(--color-danger)" }}>{error}</p>}
          <button className="primary-btn" style={{ width: "100%", height: 40, marginTop: 20 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-secondary" style={{ textAlign: "center", marginTop: 20 }}>
          New to OrbitOS? <Link href="/signup" className="btn-link" style={{ fontWeight: 600, color: "var(--color-primary)" }}>Create an account</Link>
        </p>
      </div>
    </main>
  );
}