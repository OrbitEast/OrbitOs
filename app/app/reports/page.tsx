export default function ReportsPage() {
  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Analysis</p>
          <h2 className="section-title">Reports</h2>
        </div>
        <div className="button-row">
          <button className="secondary-btn" type="button">Date range</button>
          <button className="primary-btn" type="button">Download PDF</button>
        </div>
      </div>

      <section className="dashboard-grid" aria-label="Financial summary">
        <article className="card">
          <div className="kpi-label"><span>Total revenue</span><span className="trend up">+18.2%</span></div>
          <div className="metric-value">₹1,58,360</div>
          <div className="metric-sub">Aug 2026</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Total expenses</span><span className="trend up">+5.2%</span></div>
          <div className="metric-value">₹25,400</div>
          <div className="metric-sub">This month</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Gross profit</span><span className="trend up">+22.1%</span></div>
          <div className="metric-value">₹1,32,960</div>
          <div className="metric-sub">After COGS</div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Net profit</span><span className="trend up">+28.3%</span></div>
          <div className="metric-value">₹1,07,560</div>
          <div className="metric-sub">Bottom line</div>
        </article>
      </section>

      <div className="panel-grid" style={{ marginTop: 24 }}>
        <article className="card">
          <div className="kpi-label"><span>Sales by customer</span></div>
          <div className="list">
            <div className="list-item"><span>Riya Traders</span><strong>₹50,700</strong></div>
            <div className="list-item"><span>Urban Crafts</span><strong>₹12,400</strong></div>
            <div className="list-item"><span>Mehta Retail</span><strong>₹25,100</strong></div>
            <div className="list-item"><span>Green Leaf</span><strong>₹9,860</strong></div>
          </div>
        </article>
        <article className="card">
          <div className="kpi-label"><span>Expense breakdown</span></div>
          <div className="list">
            <div className="list-item"><span>Rent</span><strong>₹18,000</strong></div>
            <div className="list-item"><span>Utilities</span><strong>₹3,400</strong></div>
            <div className="list-item"><span>Travel</span><strong>₹2,800</strong></div>
            <div className="list-item"><span>Supplies</span><strong>₹1,200</strong></div>
          </div>
        </article>
      </div>
    </div>
  );
}