const supplierDetail = {
  name: "Acme Steel",
  phone: "+91 99812 11100",
  email: "sales@acmesteel.in",
  gstin: "27ABCDE5678G1Z2",
  balance: "₹82,400",
  totalPurchased: "₹4,12,000",
  status: "Active",
};

const recentPurchases = [
  { po: "PO-048", date: "12 Aug 2026", amount: "₹82,400", status: "Pending" },
  { po: "PO-045", date: "28 Jul 2026", amount: "₹56,200", status: "Received" },
  { po: "PO-042", date: "15 Jul 2026", amount: "₹48,100", status: "Received" },
];

export default function SupplierDetailPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Procurement</p>
          <h2 className="section-title">{supplierDetail.name}</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Edit</button>
          <button className="primary-btn" type="button">New purchase</button>
        </div>
      </div>

      <section className="dashboard-grid" aria-label="Supplier summary">
        <article className="card">
          <div className="kpi-label"><span>Outstanding balance</span></div>
          <div className="metric-value">{supplierDetail.balance}</div>
          <div className="metric-sub">Amount payable</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Total purchased</span></div>
          <div className="metric-value" style={{ fontSize: 24 }}>{supplierDetail.totalPurchased}</div>
          <div className="metric-sub">Lifetime value</div>
        </article>
      </section>

      <div className="panel-grid" style={{ marginTop: 24 }}>
        <article className="card">
          <div className="kpi-label"><span>Contact details</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Phone</span><strong>{supplierDetail.phone}</strong></div>
            <div className="list-item"><span className="muted">Email</span><strong>{supplierDetail.email}</strong></div>
            <div className="list-item"><span className="muted">GSTIN</span><strong>{supplierDetail.gstin}</strong></div>
          </div>
        </article>

        <article className="card">
          <div className="kpi-label"><span>Recent purchases</span></div>
          <div className="list">
            {recentPurchases.map((po) => (
              <div key={po.po} className="list-item">
                <div>
                  <div className="text-card-title">{po.po}</div>
                  <div className="text-secondary">{po.date}</div>
                </div>
                <strong>{po.amount}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
