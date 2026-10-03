"use client";

import { FormEvent, useState } from "react";

export default function NewPurchasePage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ id: "1", product: "", qty: 1, unitPrice: 0 }]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: implement actual purchase creation
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Procurement</p>
          <h2 className="section-title">New purchase</h2>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <article className="card" style={{ marginBottom: 20 }}>
          <div className="kpi-label"><span>Purchase header</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label className="label label-required">Supplier</label>
              <select className="input" required>
                <option>Select supplier</option>
                <option>Acme Steel</option>
                <option>Indigo Packaging</option>
              </select>
            </div>
            <div>
              <label className="label">PO date</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label">Expected delivery</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label">Reference</label>
              <input type="text" className="input" placeholder="Supplier PO number" />
            </div>
          </div>
        </article>

        <section className="table-shell" style={{ marginBottom: 20 }}>
          <div className="table-toolbar">
            <strong>Purchase items</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ width: 80 }}>Qty</th>
                <th style={{ width: 100 }}>Unit price</th>
                <th style={{ width: 100 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><input type="text" className="input" placeholder="Select product" /></td>
                  <td><input type="number" className="input" value={item.qty} min={1} /></td>
                  <td><input type="number" className="input" value={item.unitPrice} step="0.01" /></td>
                  <td>₹{(item.qty * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <article className="card" style={{ maxWidth: 400, marginLeft: "auto" }}>
          <div className="kpi-label"><span>Summary</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong></div>
            <div className="list-item"><span className="muted">Tax (18%)</span><strong>₹{tax.toFixed(2)}</strong></div>
            <div className="list-item" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 12, marginTop: 12 }}>
              <span className="muted">Total</span>
              <strong style={{ fontSize: 18 }}>₹{total.toFixed(2)}</strong>
            </div>
          </div>
        </article>

        <div className="button-row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn">Cancel</button>
          <button type="submit" className="primary-btn">Create purchase</button>
        </div>
      </form>
    </div>
  );
}
