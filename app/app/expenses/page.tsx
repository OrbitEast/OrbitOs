const expenses = [
  { date: "12 Aug 2026", category: "Rent", description: "Office rent - August", amount: "₹18,000", vendor: "Landlord", status: "Approved" },
  { date: "10 Aug 2026", category: "Utilities", description: "Electricity bill", amount: "₹3,400", vendor: "Power Co.", status: "Approved" },
  { date: "08 Aug 2026", category: "Travel", description: "Client visit expenses", amount: "₹2,800", vendor: "Self", status: "Pending" },
  { date: "05 Aug 2026", category: "Supplies", description: "Office stationery", amount: "₹1,200", vendor: "Staples", status: "Approved" },
];

export default function ExpensesPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Finance</p>
          <h2 className="section-title">Expenses</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Filter</button>
          <button className="primary-btn" type="button">Log expense</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Expense log">
        <div className="table-toolbar">
          <strong>Expense register</strong>
          <span className="muted">4 records • ₹25,400 total</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Vendor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={`${exp.date}-${exp.category}`}>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td>{exp.amount}</td>
                <td>{exp.vendor}</td>
                <td>
                  <span className={`status-pill ${exp.status === "Approved" ? "success" : "warning"}`}>
                    {exp.status}
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