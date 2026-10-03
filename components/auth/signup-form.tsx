"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function SignupForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Could not create your account.");
      return;
    }
    window.location.href = "/login";
  }

  return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        <h1 className="text-page-title">Create your OrbitOS account</h1>
        <p className="text-secondary" style={{ marginTop: 8 }}>Start with your user account. Business setup comes next.</p>
        <form onSubmit={onSubmit} className="space-y-4" style={{ marginTop: 28 }}>
          <div>
            <label className="label">Full name</label>
            <input
              name="name"
              required
              minLength={2}
              placeholder="Your name"
              autoComplete="name"
              className="input"
            />
          </div>
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
              placeholder="8+ characters"
              autoComplete="new-password"
              className="input"
            />
          </div>
          {error && <p className="text-secondary" style={{ color: "var(--color-danger)" }}>{error}</p>}
          <button className="primary-btn" style={{ width: "100%", height: 40, marginTop: 20 }} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="text-secondary" style={{ textAlign: "center", marginTop: 20 }}>
          Already have an account? <Link href="/login" className="btn-link" style={{ fontWeight: 600, color: "var(--color-primary)" }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}