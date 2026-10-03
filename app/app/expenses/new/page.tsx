"use client";

import { FormEvent, useState } from "react";

export default function NewExpensePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      const category = form.get("category");
      const amount = parseFloat(form.get("amount") as string);

      if (!amount || amount <= 0) {
        setError("Invalid amount");
        setLoading(false);
        return;
      }

      // TODO: Call server action to create expense
      console.log({ category, amount });
    } catch (err) {
      setError("Failed to create expense");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Finance</p>
          <h2 className="section-title">New expense</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ maxWidth: 500 }}>
        <article className="card">
          <div className="kpi-label"><span>Expense details</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label label-required">Category</label>
              <select name="category" className="input" required>
                <option>Rent</option>
                <option>Utilities</option>
                <option>Travel</option>
                <option>Supplies</option>
                <option>Maintenance</option>
                <option>Insurance</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label label-required">Amount</label>
              <input
                type="number"
                name="amount"
                className="input"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="label">Vendor</label>
              <input
                type="text"
                className="input"
                placeholder="Vendor or supplier name"
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                placeholder="Expense details and notes"
                rows={3}
              />
            </div>
            <div>
              <label className="label">Receipt attachment</label>
              <input type="file" className="input" />
            </div>
          </div>
        </article>

        {error && <p className="text-secondary" style={{ color: "var(--color-danger)", marginTop: 12 }}>{error}</p>}

        <div className="button-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn">Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Create expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
