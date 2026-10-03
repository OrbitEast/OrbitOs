const inventory = [
  { sku: "P-1001", product: "Premium Cable", category: "Electrical", opening: 100, current: 82, reorder: 50, value: "₹39,360" },
  { sku: "P-1002", product: "Industrial Bolt", category: "Hardware", opening: 500, current: 16, reorder: 100, value: "₹1,920" },
  { sku: "P-1003", product: "Safety Glass", category: "Material", opening: 200, current: 214, reorder: 80, value: "₹145,520" },
  { sku: "P-1004", product: "Packaging Roll", category: "Packaging", opening: 200, current: 49, reorder: 75, value: "₹10,780" },
];

export default function InventoryPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Stock control</p>
          <h2 className="section-title">Inventory</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Adjust stock</button>
          <button className="primary-btn" type="button">Purchase order</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Inventory levels">
        <div className="table-toolbar">
          <strong>Current stock</strong>
          <span className="muted">4 items • ₹1,97,580 total value</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Opening</th>
              <th>Current</th>
              <th>Reorder level</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.sku}>
                <td>{item.sku}</td>
                <td>{item.product}</td>
                <td>{item.category}</td>
                <td>{item.opening}</td>
                <td><strong>{item.current}</strong></td>
                <td>{item.reorder}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}