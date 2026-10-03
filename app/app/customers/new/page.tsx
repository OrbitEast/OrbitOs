"use client";

import { FormEvent, useState } from "react";

export default function NewCustomerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    // TODO: implement actual customer creation via server action
    setLoading(false);
  }

  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Business contacts</p>
          <h2 className="section-title">New customer</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ maxWidth: 600 }}>
        <article className="card">
          <div className="kpi-label"><span>Basic information</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label label-required">Customer name</label>
              <input type="text" className="input" placeholder="e.g., Riya Traders" required />
            </div>
            <div>
              <label className="label">Company name</label>
              <input type="text" className="input" placeholder="Legal entity name" />
            </div>
            <div>
              <label className="label label-required">Email</label>
              <input type="email" className="input" placeholder="email@customer.com" required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="input" placeholder="+91 98765 43210" />
            </div>
          </div>
        </article>

        <article className="card" style={{ marginTop: 20 }}>
          <div className="kpi-label"><span>Tax & compliance</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label">GSTIN</label>
              <input type="text" className="input" placeholder="27ABCDE1234F1Z2" />
            </div>
            <div>
              <label className="label">Opening balance</label>
              <input type="number" className="input" placeholder="0.00" step="0.01" />
            </div>
          </div>
        </article>

        {error && <p className="text-secondary" style={{ color: "var(--color-danger)", marginTop: 12 }}>{error}</p>}

        <div className="button-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn">Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
