const rows = [
  { name: "Acme Steel", phone: "+91 99812 11100", email: "sales@acmesteel.in", amount: "₹94,800", status: "Active" },
  { name: "Indigo Packaging", phone: "+91 98100 22230", email: "hello@indigopack.in", amount: "₹61,200", status: "Active" },
  { name: "Metro Electronics", phone: "+91 98989 90011", email: "ops@metroelectronics.in", amount: "₹1,12,600", status: "VIP" },
  { name: "Northwind Foods", phone: "+91 98234 12309", email: "accounts@northwindfoods.in", amount: "₹38,500", status: "Dormant" },
];

export default function SuppliersPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Procurement</p>
          <h2 className="section-title">Suppliers</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Filter</button>
          <button className="primary-btn" type="button">Add supplier</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Suppliers directory">
        <div className="table-toolbar">
          <strong>Supplier directory</strong>
          <span className="muted">4 records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Outstanding</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.phone}</td>
                <td>{row.email}</td>
                <td>{row.amount}</td>
                <td>
                  <span className={`status-pill ${row.status === "Active" ? "success" : row.status === "VIP" ? "info" : row.status === "Dormant" ? "muted" : "warning"}`}>
                    {row.status}
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
