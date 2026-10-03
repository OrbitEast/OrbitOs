import Link from "next/link";

const rows = [
  { name: "Riya Traders", phone: "+91 98765 43210", email: "riya@traders.in", balance: "₹31,200", status: "Active" },
  { name: "Urban Crafts", phone: "+91 99887 77661", email: "hello@urbancrafts.in", balance: "₹18,460", status: "Active" },
  { name: "Green Leaf", phone: "+91 98222 33445", email: "sales@greenleaf.co", balance: "₹9,860", status: "VIP" },
  { name: "Mehta Retail", phone: "+91 98990 11223", email: "accounts@mehtaretail.in", balance: "₹25,100", status: "Active" },
  { name: "Nexus Supply", phone: "+91 98111 77221", email: "ops@nexussupply.com", balance: "₹42,800", status: "Dormant" },
];

export default function CustomersPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Business contacts</p>
          <h2 className="section-title">Customers</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Filter</button>
          <Link href="/app/customers/new" className="primary-btn">Add customer</Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input className="search-trigger" style={{ minWidth: 260 }} placeholder="Search by name, email, or phone" aria-label="Search customers" />
          <button className="secondary-btn" type="button">All status</button>
          <button className="secondary-btn" type="button">This month</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Customers table">
        <div className="table-toolbar">
          <strong>Customer directory</strong>
          <span className="muted">5 records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Open balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.phone}</td>
                <td>{row.email}</td>
                <td>{row.balance}</td>
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
