const productDetail = {
  sku: "P-1001",
  name: "Premium Cable",
  category: "Electrical",
  unit: "Meter",
  sellingPrice: "₹480",
  purchasePrice: "₹320",
  taxRate: "18%",
  opening: 100,
  current: 82,
  reorder: 50,
  status: "In stock",
};

export default function ProductDetailPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Catalog</p>
          <h2 className="section-title">{productDetail.name}</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Edit</button>
          <button className="primary-btn" type="button">Adjust stock</button>
        </div>
      </div>

      <section className="dashboard-grid" aria-label="Product metrics">
        <article className="card">
          <div className="kpi-label"><span>SKU</span></div>
          <div className="metric-value" style={{ fontSize: 20 }}>{productDetail.sku}</div>
          <div className="metric-sub">Product identifier</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Current stock</span></div>
          <div className="metric-value">{productDetail.current}</div>
          <div className="metric-sub">{productDetail.unit}s in hand</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Selling price</span></div>
          <div className="metric-value" style={{ fontSize: 24 }}>{productDetail.sellingPrice}</div>
          <div className="metric-sub">Per {productDetail.unit.toLowerCase()}</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Status</span><span className="trend up">In stock</span></div>
          <div className="metric-value" style={{ fontSize: 20 }}>✓</div>
          <div className="metric-sub">Available</div>
        </article>
      </section>

      <div className="panel-grid" style={{ marginTop: 24 }}>
        <article className="card">
          <div className="kpi-label"><span>Product details</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Category</span><strong>{productDetail.category}</strong></div>
            <div className="list-item"><span className="muted">Unit</span><strong>{productDetail.unit}</strong></div>
            <div className="list-item"><span className="muted">Purchase price</span><strong>{productDetail.purchasePrice}</strong></div>
            <div className="list-item"><span className="muted">Tax rate</span><strong>{productDetail.taxRate}</strong></div>
          </div>
        </article>

        <article className="card">
          <div className="kpi-label"><span>Stock information</span></div>
          <div className="list">
            <div className="list-item"><span className="muted">Opening stock</span><strong>{productDetail.opening}</strong></div>
            <div className="list-item"><span className="muted">Current stock</span><strong>{productDetail.current}</strong></div>
            <div className="list-item"><span className="muted">Reorder level</span><strong>{productDetail.reorder}</strong></div>
            <div className="list-item"><span className="muted">Status</span><span className="status-pill success">In stock</span></div>
          </div>
        </article>
      </div>
    </div>
  );
}
