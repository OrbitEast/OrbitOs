const purchases = [
  { po: "PO-048", supplier: "Acme Steel", date: "12 Aug 2026", amount: "₹82,400", due: "19 Aug", status: "Pending" },
  { po: "PO-047", supplier: "Indigo Packaging", date: "08 Aug 2026", amount: "₹45,600", due: "15 Aug", status: "Received" },
  { po: "PO-046", supplier: "Metro Electronics", date: "05 Aug 2026", amount: "₹1,12,800", due: "12 Aug", status: "Overdue" },
];

export default function PurchasesPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Procurement</p>
          <h2 className="section-title">Purchases</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Export</button>
          <button className="primary-btn" type="button">New purchase</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Purchase orders">
        <div className="table-toolbar">
          <strong>Purchase register</strong>
          <span className="muted">3 records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>PO</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Due date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((po) => (
              <tr key={po.po}>
                <td><strong>{po.po}</strong></td>
                <td>{po.supplier}</td>
                <td>{po.date}</td>
                <td>{po.amount}</td>
                <td>{po.due}</td>
                <td>
                  <span className={`status-pill ${po.status === "Received" ? "success" : po.status === "Pending" ? "info" : "danger"}`}>
                    {po.status}
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