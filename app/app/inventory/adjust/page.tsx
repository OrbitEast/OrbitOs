"use client";

import { FormEvent, useState } from "react";

export default function AdjustStockPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"purchase" | "sale" | "adjustment" | "damage">("adjustment");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      const quantity = parseInt(form.get("quantity") as string);

      if (!quantity || quantity <= 0) {
        setError("Invalid quantity");
        setLoading(false);
        return;
      }

      // TODO: Call server action to record inventory transaction
      console.log({ type, quantity });
    } catch (err) {
      setError("Failed to adjust stock");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Stock control</p>
          <h2 className="section-title">Adjust inventory</h2>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ maxWidth: 500 }}>
        <article className="card">
          <div className="kpi-label"><span>Inventory adjustment</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label label-required">Product</label>
              <select className="input" required>
                <option>Select product</option>
                <option>P-1001 - Premium Cable - Current: 82</option>
                <option>P-1002 - Industrial Bolt - Current: 16</option>
              </select>
            </div>
            <div>
              <label className="label label-required">Transaction type</label>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                required
              >
                <option value="adjustment">Adjustment</option>
                <option value="purchase">Purchase receiving</option>
                <option value="sale">Sale dispatch</option>
                <option value="damage">Damage/loss</option>
              </select>
            </div>
            <div>
              <label className="label label-required">Quantity</label>
              <input
                type="number"
                name="quantity"
                className="input"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="label">Reference</label>
              <input
                type="text"
                className="input"
                placeholder="PO, delivery note, or memo number"
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                className="input"
                placeholder="Additional details"
                rows={3}
              />
            </div>
          </div>
        </article>

        {error && <p className="text-secondary" style={{ color: "var(--color-danger)", marginTop: 12 }}>{error}</p>}

        <div className="button-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn">Cancel</button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Adjusting..." : "Adjust inventory"}
          </button>
        </div>
      </form>
    </div>
  );
}
