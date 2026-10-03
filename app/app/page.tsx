import { AppLayout } from "@/components/layout/app-layout";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { businessMembers, businesses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const kpis = [
  { label: "Today's sales", value: "₹4,85,600", change: "+12.4%", trend: "up" },
  { label: "Today's purchases", value: "₹2,14,800", change: "-3.1%", trend: "down" },
  { label: "Receivables", value: "₹18,62,450", change: "+5.9%", trend: "up" },
  { label: "Payables", value: "₹7,48,200", change: "+2.2%", trend: "up" },
];

const salesBars = [64, 82, 58, 94, 70, 88, 118];

const recentActivity = [
  { title: "Invoice INV-104 issued", meta: "Riya Traders • 2 mins ago", status: "success" },
  { title: "Payment received", meta: "₹42,500 • Axis Bank UPI", status: "info" },
  { title: "Low stock alert", meta: "Product: Premium Cable • 8 units left", status: "warning" },
  { title: "Expense approved", meta: "Office rent • ₹18,000", status: "muted" },
];

const latestInvoices = [
  { customer: "Riya Traders", amount: "₹31,200", due: "Due in 4 days", status: "warning" },
  { customer: "Urban Crafts", amount: "₹18,460", due: "Paid", status: "success" },
  { customer: "Mehta Retail", amount: "₹25,100", due: "Due in 11 days", status: "info" },
  { customer: "Green Leaf", amount: "₹9,860", due: "Overdue", status: "muted" },
];

export default async function AppHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [membership] = await getDb()
    .select({
      businessId: businessMembers.businessId,
      role: businessMembers.role,
      businessName: businesses.name,
    })
    .from(businessMembers)
    .innerJoin(businesses, eq(businesses.id, businessMembers.businessId))
    .where(eq(businessMembers.userId, session.user.id))
    .limit(1);

  if (!membership) redirect("/onboarding");

  return (
    <AppLayout>
      <div>
        <div className="section-header" style={{ marginTop: 0 }}>
          <div>
            <p className="eyebrow">{membership.businessName}</p>
            <h2 className="section-title">Overview</h2>
          </div>
          <div className="button-row">
            <button className="secondary-btn" type="button">Export</button>
            <button className="primary-btn" type="button">Create invoice</button>
          </div>
        </div>

        <section className="dashboard-grid" aria-label="Business metrics">
          {kpis.map((kpi) => (
            <article className="card" key={kpi.label}>
              <div className="kpi-label">
                <span>{kpi.label}</span>
                <span className={`trend ${kpi.trend}`}>
                  {kpi.change}
                </span>
              </div>
              <div className="metric-value">{kpi.value}</div>
              <div className="metric-sub">vs previous period</div>
            </article>
          ))}
        </section>

        <div className="section-header">
          <h3 className="section-title">Performance</h3>
        </div>

        <section className="panel-grid">
          <article className="card chart-panel">
            <div className="kpi-label" style={{ marginBottom: 10 }}>
              <span>Revenue trend</span>
              <span className="trend up">+18.2%</span>
            </div>
            <div className="bars" aria-label="Revenue chart">
              {salesBars.map((height, index) => (
                <div
                  key={index}
                  className="bar"
                  style={{ height: `${height}%`, opacity: 0.25 + index * 0.1 }}
                  aria-label={`Revenue bar ${index + 1}`}
                />
              ))}
            </div>
          </article>

          <article className="card">
            <div className="kpi-label">
              <span>Recent activity</span>
              <span className="muted">Today</span>
            </div>
            <div className="list">
              {recentActivity.map((item) => (
                <div key={item.title} className="list-item">
                  <div>
                    <div className="text-card-title">{item.title}</div>
                    <div className="text-secondary">{item.meta}</div>
                  </div>
                  <span className={`status-pill ${item.status}`}>
                    {item.status === "success" ? "OK" : item.status === "warning" ? "Alert" : item.status === "info" ? "New" : "Info"}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <div className="section-header">
          <h3 className="section-title">Latest invoices</h3>
          <button className="secondary-btn" type="button">View all</button>
        </div>

        <section className="table-shell" aria-label="Latest invoices table">
          <div className="table-toolbar">
            <strong>Invoice activity</strong>
            <span className="muted">Updated 1 min ago</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestInvoices.map((invoice) => (
                <tr key={`${invoice.customer}-${invoice.amount}`}>
                  <td>{invoice.customer}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.due}</td>
                  <td>
                    <span className={`status-pill ${invoice.status}`}>
                      {invoice.status === "success"
                        ? "Paid"
                        : invoice.status === "warning"
                          ? "Pending"
                          : invoice.status === "info"
                            ? "Scheduled"
                            : "Review"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppLayout>
  );
}
