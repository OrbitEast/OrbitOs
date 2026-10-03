const products = [
  { sku: "P-1001", name: "Premium Cable", category: "Electrical", stock: 82, unitPrice: "₹480", status: "In stock" },
  { sku: "P-1002", name: "Industrial Bolt", category: "Hardware", stock: 16, unitPrice: "₹120", status: "Low stock" },
  { sku: "P-1003", name: "Safety Glass", category: "Material", stock: 214, unitPrice: "₹680", status: "In stock" },
  { sku: "P-1004", name: "Packaging Roll", category: "Packaging", stock: 49, unitPrice: "₹220", status: "Low stock" },
];

export default function ProductsPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Catalog</p>
          <h2 className="section-title">Products</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Filter</button>
          <button className="primary-btn" type="button">Add product</button>
        </div>
      </div>

      <section className="table-shell" aria-label="Products catalog">
        <div className="table-toolbar">
          <strong>Product catalog</strong>
          <span className="muted">4 records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.sku}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{product.unitPrice}</td>
                <td>
                  <span className={`status-pill ${product.status === "In stock" ? "success" : "warning"}`}>
                    {product.status}
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
