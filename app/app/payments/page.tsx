const payments = [
  { ref: "PAY-025", customer: "Riya Traders", date: "12 Aug 2026", amount: "₹12,000", method: "UPI", status: "Success" },
  { ref: "PAY-024", customer: "Urban Crafts", date: "10 Aug 2026", amount: "₹8,200", method: "Bank Transfer", status: "Success" },
  { ref: "PAY-023", customer: "Mehta Retail", date: "08 Aug 2026", amount: "₹15,600", method: "Cheque", status: "Pending" },
  { ref: "PAY-022", customer: "Green Leaf", date: "05 Aug 2026", amount: "₹9,860", method: "UPI", status: "Success" },
];

export default function PaymentsPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Collections</p>
          <h2 className="section-title">Payments</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Filter</button>
          <button className="primary-btn" type="button">Record payment</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Payments received">
        <div className="table-toolbar">
          <strong>Payment register</strong>
          <span className="muted">4 records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay.ref}>
                <td><strong>{pay.ref}</strong></td>
                <td>{pay.customer}</td>
                <td>{pay.date}</td>
                <td>{pay.amount}</td>
                <td>{pay.method}</td>
                <td>
                  <span className={`status-pill ${pay.status === "Success" ? "success" : "warning"}`}>
                    {pay.status}
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