const invoiceDetail = {
  invoice: "INV-104",
  customer: "Riya Traders",
  date: "12 Aug 2026",
  dueDate: "16 Aug 2026",
  status: "Pending",
  items: [
    { description: "Premium Cable (100m)", qty: 5, unitPrice: "₹480", amount: "₹2,400" },
    { description: "Installation labor", qty: 1, unitPrice: "₹8,200", amount: "₹8,200" },
  ],
  subtotal: "₹10,600",
  tax: "₹1,908",
  discount: "₹908",
  total: "₹11,600",
  amountPaid: "₹0",
  balance: "₹11,600",
};

export default function InvoiceDetailPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Sales</p>
          <h2 className="section-title">{invoiceDetail.invoice}</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Print</button>
          <button className="primary-btn" type="button">Record payment</button>
        </div>
      </div>

      <div className="panel-grid">
        <article className="card">
          <div className="kpi-label"><span>Invoice details</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Customer</span><strong>{invoiceDetail.customer}</strong></div>
            <div className="list-item"><span className="muted">Invoice date</span><strong>{invoiceDetail.date}</strong></div>
            <div className="list-item"><span className="muted">Due date</span><strong>{invoiceDetail.dueDate}</strong></div>
            <div className="list-item"><span className="muted">Status</span><span className="status-pill info">{invoiceDetail.status}</span></div>
          </div>
        </article>

        <article className="card">
          <div className="kpi-label"><span>Payment status</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Total amount</span><strong>{invoiceDetail.total}</strong></div>
            <div className="list-item"><span className="muted">Amount paid</span><strong>{invoiceDetail.amountPaid}</strong></div>
            <div className="list-item"><span className="muted">Balance due</span><strong style={{ color: "var(--color-danger)" }}>{invoiceDetail.balance}</strong></div>
          </div>
        </article>
      </div>

      <section className="table-shell" style={{ marginTop: 24 }}>
        <div className="table-toolbar">
          <strong>Invoice items</strong>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceDetail.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.description}</td>
                <td>{item.qty}</td>
                <td>{item.unitPrice}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <article className="card" style={{ marginTop: 20, maxWidth: 400, marginLeft: "auto" }}>
        <div className="kpi-label"><span>Summary</span></div>
        <div className="list">
          <div className="list-item"><span className="muted">Subtotal</span><strong>{invoiceDetail.subtotal}</strong></div>
          <div className="list-item"><span className="muted">Tax (18%)</span><strong>{invoiceDetail.tax}</strong></div>
          <div className="list-item"><span className="muted">Discount</span><strong>-{invoiceDetail.discount}</strong></div>
          <div className="list-item" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 12, marginTop: 12 }}>
            <span className="muted">Total</span>
            <strong style={{ fontSize: 18 }}>{invoiceDetail.total}</strong>
          </div>
        </div>
      </article>
    </div>
  );
}
