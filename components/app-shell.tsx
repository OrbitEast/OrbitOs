import type { ReactNode } from "react";

type NavSection = {
  title: string;
  items: { label: string; href: string; active?: boolean; icon: string }[];
};

const sections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", href: "/app", active: true, icon: "◫" },
      { label: "Customers", href: "/app/customers", icon: "◎" },
      { label: "Sales", href: "/app/sales", icon: "▣" },
      { label: "Invoices", href: "/app/invoices", icon: "◫" },
      { label: "Payments", href: "/app/payments", icon: "◍" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Products", href: "/app/products", icon: "◧" },
      { label: "Inventory", href: "/app/inventory", icon: "◨" },
      { label: "Suppliers", href: "/app/suppliers", icon: "◩" },
      { label: "Purchases", href: "/app/purchases", icon: "◬" },
      { label: "Expenses", href: "/app/expenses", icon: "◭" },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/app/reports", icon: "▤" },
      { label: "Khata", href: "/app/khata", icon: "◰" },
      { label: "Staff", href: "/app/staff", icon: "◱" },
    ],
  },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="orbit-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">O</div>
          <div>
            <p className="brand-name">OrbitOS</p>
            <p className="brand-subtitle">Business OS</p>
          </div>
        </div>

        <nav className="nav-stack">
          {sections.map((section) => (
            <div key={section.title} className="nav-section">
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={item.active ? "nav-item active" : "nav-item"}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="workspace-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="toolbar-button" aria-label="Toggle navigation">
              ☰
            </button>
            <div>
              <p className="eyebrow">Business workspace</p>
              <h1 className="page-title">{title}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="search-trigger" type="button">
              <span>⌕</span>
              <span>Search</span>
            </button>
            <button className="toolbar-button" type="button" aria-label="Notifications">
              🔔
            </button>
            <button className="toolbar-button" type="button" aria-label="Profile">
              👤
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
