const ledger = [
  { party: "Riya Traders", type: "Customer", opening: "₹0", debit: "₹50,700", credit: "₹24,000", balance: "₹26,700" },
  { party: "Urban Crafts", type: "Customer", opening: "₹0", debit: "₹12,400", credit: "₹8,200", balance: "₹4,200" },
  { party: "Acme Steel", type: "Supplier", opening: "₹0", debit: "₹0", credit: "₹82,400", balance: "₹-82,400" },
  { party: "Indigo Packaging", type: "Supplier", opening: "₹0", debit: "₹0", credit: "₹45,600", balance: "₹-45,600" },
];

export default function KhataPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Ledger</p>
          <h2 className="section-title">Khata</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Settlement</button>
          <button className="primary-btn" type="button">View statement</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Party ledger">
        <div className="table-toolbar">
          <strong>Party accounts</strong>
          <span className="muted">4 accounts active</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Party</th>
              <th>Type</th>
              <th>Opening</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((entry) => (
              <tr key={entry.party}>
                <td><strong>{entry.party}</strong></td>
                <td>{entry.type}</td>
                <td>{entry.opening}</td>
                <td>{entry.debit}</td>
                <td>{entry.credit}</td>
                <td><strong style={{ color: entry.balance.includes("-") ? "var(--color-danger)" : "var(--color-success)" }}>{entry.balance}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}