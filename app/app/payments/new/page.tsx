"use client";

import { FormEvent, useState } from "react";

export default function RecordPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      const amount = parseFloat(form.get("amount") as string);
      const method = form.get("method");
      const reference = form.get("reference");

      if (!amount || amount <= 0) {
        setError("Invalid amount");
        setLoading(false);
        return;
      }

      // TODO: Call server action to record payment
      console.log({ amount, method, reference });
    } catch (err) {
      setError("Failed to record payment");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Collections</p>
          <h2 className="section-title">Record payment</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ maxWidth: 500 }}>
        <article className="card">
          <div className="kpi-label"><span>Payment details</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label label-required">Invoice</label>
              <select className="input" required>
                <option>Select invoice</option>
                <option>INV-104 - Riya Traders - ₹18,600</option>
                <option>INV-102 - Mehta Retail - ₹25,100</option>
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
              <label className="label">Payment method</label>
              <select name="method" className="input">
                <option>UPI</option>
                <option>Bank transfer</option>
                <option>Cheque</option>
                <option>Cash</option>
              </select>
            </div>
            <div>
              <label className="label">Reference</label>
              <input
                type="text"
                name="reference"
                className="input"
                placeholder="Transaction ID or cheque number"
              />
            </div>
          </div>
        </article>

        {error && <p className="text-secondary" style={{ color: "var(--color-danger)", marginTop: 12 }}>{error}</p>}

        <div className="button-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn">Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Recording..." : "Record payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
