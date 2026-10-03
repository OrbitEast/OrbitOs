const invoices = [
  { invoice: "INV-104", customer: "Riya Traders", date: "12 Aug 2026", amount: "₹18,600", due: "16 Aug", status: "Pending" },
  { invoice: "INV-103", customer: "Urban Crafts", date: "08 Aug 2026", amount: "₹12,400", due: "15 Aug", status: "Paid" },
  { invoice: "INV-102", customer: "Mehta Retail", date: "05 Aug 2026", amount: "₹25,100", due: "12 Aug", status: "Overdue" },
  { invoice: "INV-101", customer: "Green Leaf", date: "01 Aug 2026", amount: "₹9,860", due: "08 Aug", status: "Paid" },
];

export default function InvoicesPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Sales</p>
          <h2 className="section-title">Invoices</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Export</button>
          <button className="primary-btn" type="button">New invoice</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Invoices list">
        <div className="table-toolbar">
          <strong>Invoice register</strong>
          <span className="muted">4 records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Due date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoice}>
                <td><strong>{inv.invoice}</strong></td>
                <td>{inv.customer}</td>
                <td>{inv.date}</td>
                <td>{inv.amount}</td>
                <td>{inv.due}</td>
                <td>
                  <span className={`status-pill ${inv.status === "Paid" ? "success" : inv.status === "Pending" ? "info" : "danger"}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}