# OrbitOS Development Roadmap

This document outlines the phased build strategy for OrbitOS, following the strict build order defined in the PRD.

---

## Stage 01 — Foundation
**Goal:** Core infrastructure, Auth, DB schema, Design system setup.

- **Tasks:**
  - Git repository initialization and branch protection.
  - Project setup (Next.js 15, Tailwind v4, Drizzle ORM).
  - Design system implementation (centralized CSS variables, typography, button components).
  - Auth implementation (Auth.js, middleware, DB user tables).
  - CI/CD pipeline setup (automated linting, testing, deployment preview).
- **Acceptance Criteria:**
  - Functional authentication (login/logout/protected routes).
  - Basic design system components (palette/buttons/typography) implemented and verified in Storybook/docs.
  - Database schema initialized and connected.

## Stage 02 — Core Entities
**Goal:** Customers, Products, Suppliers.

- **Tasks:**
  - Schemas (Customers, Products, Suppliers).
  - CRUD APIs/Server Actions.
  - UI Data Tables and CRUD forms (with validation).
- **Acceptance Criteria:**
  - Customers, Products, and Suppliers can be created, edited, and archived.
  - Tables handle pagination, sorting, and search.

## Stage 03 — Operations
**Goal:** Inventory, Purchases, Sales Orders.

- **Tasks:**
  - Inventory tracking system (purchase/sale/damage/adj movements).
  - Purchase Order workflow.
  - Order management system.
  - UI workflows for stock updates and order processing.
- **Acceptance Criteria:**
  - Purchases increase stock.
  - Orders reduce inventory.
  - Inventory movements auditable and consistent.

## Stage 04 — Finance
**Goal:** Invoices, Payments, Khata (Ledger), Expenses.

- **Tasks:**
  - Invoice builder and generation.
  - Payment recording workflows.
  - Financial Ledger (Khata) calculations.
  - Expense management.
  - Audit trail integration.
- **Acceptance Criteria:**
  - Financials (Invoice totals, taxes) accurate.
  - Invoice statuses (Issued/Paid/Overdue) accurate.
  - Ledger balance consistent with transactions.

## Stage 05 — Intelligence
**Goal:** Dashboard, Reports, Analytics.

- **Tasks:**
  - Dashboard database queries (non-hardcoded).
  - Reports generation (Sales, Profit, Inventory, Invoices).
  - UI visualizations (Recharts integrated with design system).
- **Acceptance Criteria:**
  - Dashboard figures accurately reflect DB state.
  - Charts visualize data trends correctly.

## Stage 06 — Administration
**Goal:** Staff, RBAC, Audit logs, Notifications, Settings.

- **Tasks:**
  - RBAC implementation (Role-to-permission mapping).
  - Audit log viewer.
  - Business settings management.
  - Notification system implementation.
- **Acceptance Criteria:**
  - Permissions strictly restrict functionality.
  - Audit events captured for every financial mutation.

## Stage 07 — Advanced
**Goal:** CSV Import, PDF Export, Attachments, Search, CMD Palette.

- **Tasks:**
  - CSV Import workflow.
  - PDF generation (w/ @react-pdf/renderer).
  - Secure file attachment handling.
  - Global search implementation (pg_trgm).
  - Command Palette implementation.
- **Acceptance Criteria:**
  - Imports validate properly before commit.
  - Invoices export to professional PDF.
  - Global search works effectively.

## Stage 08 — Hardening
**Goal:** Tests, Security, Performance, Accessibility.

- **Tasks:**
  - Comprehensive unit/integration tests (business logic).
  - End-to-End "Golden Test" suite execution.
  - Load testing and optimization.
  - Accessibility audit and remediation.
  - Security review.
- **Acceptance Criteria:**
  - Unit/Int test coverage > 80% (business logic).
  - End-to-End "Golden Test" suite succeeds reliably.
  - Performance meets benchmarks.

## Stage 09 — AI
**Goal:** AI assistant.

- **Tasks:**
  - AI Agent setup for business queries.
  - Tool orchestration (LLM-authorized business tool access).
- **Acceptance Criteria:**
  - AI assistant answers business questions accurately using business tools, never direct DB access.
