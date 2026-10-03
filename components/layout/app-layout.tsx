"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navigation: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", href: "/app", icon: "◫" },
      { label: "Customers", href: "/app/customers", icon: "◎" },
      { label: "Invoices", href: "/app/invoices", icon: "📄" },
      { label: "Payments", href: "/app/payments", icon: "💳" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Products", href: "/app/products", icon: "◧" },
      { label: "Inventory", href: "/app/inventory", icon: "📦" },
      { label: "Suppliers", href: "/app/suppliers", icon: "🏭" },
      { label: "Purchases", href: "/app/purchases", icon: "🛒" },
      { label: "Expenses", href: "/app/expenses", icon: "💰" },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/app/reports", icon: "📊" },
      { label: "Khata", href: "/app/khata", icon: "📖" },
    ],
  },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

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
          {navigation.map((section) => (
            <div key={section.title} className="nav-section">
              <p className="nav-section-title">{section.title}</p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "nav-item active" : "nav-item"}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
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
          </div>

          <div className="topbar-actions">
            <input
              type="text"
              placeholder="Search or use / for commands"
              className="search-trigger"
              aria-label="Global search"
            />
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
