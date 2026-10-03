const customer = {
  name: "Riya Traders",
  phone: "+91 98765 43210",
  email: "riya@traders.in",
  gstin: "27ABCDE1234F1Z2",
  balance: "₹31,200",
  totalSpent: "₹2,48,500",
  status: "Active",
};

const transactions = [
  { type: "Invoice", ref: "INV-104", date: "12 Aug 2026", amount: "₹18,600", direction: "credit" },
  { type: "Payment", ref: "PAY-022", date: "09 Aug 2026", amount: "₹12,000", direction: "debit" },
  { type: "Invoice", ref: "INV-101", date: "03 Aug 2026", amount: "₹22,400", direction: "credit" },
];

export default function CustomerDetailPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Customer profile</p>
          <h2 className="section-title">{customer.name}</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Edit</button>
          <button className="primary-btn" type="button">New invoice</button>
        </div>
      </div>

      <section className="dashboard-grid" aria-label="Customer summary cards">
        <article className="card">
          <div className="kpi-label"><span>Open balance</span><span className="trend warning">Due</span></div>
          <div className="metric-value">{customer.balance}</div>
          <div className="metric-sub">Outstanding receivable</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Total spent</span><span className="trend up">+12%</span></div>
          <div className="metric-value">{customer.totalSpent}</div>
          <div className="metric-sub">Lifetime purchases</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>GSTIN</span><span className="trend up">Verified</span></div>
          <div className="metric-value" style={{ fontSize: 20 }}>{customer.gstin}</div>
          <div className="metric-sub">Tax registration</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Status</span><span className="trend up">Active</span></div>
          <div className="metric-value" style={{ fontSize: 24 }}>{customer.status}</div>
          <div className="metric-sub">Customer lifecycle</div>
        </article>
      </section>

      <div className="panel-grid" style={{ marginTop: 24 }}>
        <article className="card">
          <div className="kpi-label"><span>Contact details</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Phone</span><strong>{customer.phone}</strong></div>
            <div className="list-item"><span className="muted">Email</span><strong>{customer.email}</strong></div>
            <div className="list-item"><span className="muted">GSTIN</span><strong>{customer.gstin}</strong></div>
          </div>
        </article>

        <article className="card">
          <div className="kpi-label"><span>Recent transactions</span></div>
          <div className="list">
            {transactions.map((txn) => (
              <div key={txn.ref} className="list-item">
                <div>
                  <div className="text-card-title">{txn.type} · {txn.ref}</div>
                  <div className="text-secondary">{txn.date}</div>
                </div>
                <strong style={{ color: txn.direction === "credit" ? "var(--color-success)" : "var(--color-text-primary)" }}>
                  {txn.direction === "credit" ? "+" : "-"}{txn.amount}
                </strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
