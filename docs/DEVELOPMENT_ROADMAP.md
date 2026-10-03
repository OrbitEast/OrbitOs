# OrbitOS Development Roadmap

This file defines **execution order and verification gates**. The product requirements remain in `OrbitOS master plan.md`; architecture and schema details remain in the canonical architecture/database documents.

## Agent status contract

**Repository baseline:** Next.js/React/TypeScript foundation; real business functionality is not yet implemented.

**Current phase:** Phase 1 — Foundation

**Phase 0 baseline check:** Completed against `main` on 2026-10-03. Live Supabase project was also inspected: the database already contains the business, customer, vendor, item, invoice, payment, expense, stock, procurement, accounting, audit, and RLS foundations. The OrbitOS backend target is the dedicated Supabase PostgreSQL project. The dedicated OrbitOS Supabase project is `pdataqrwihziwmltadez` in the `OrbitOs` organization.

**Important:** Status labels are evidence-based only. Do not mark a phase complete because files or routes exist.

## Phase execution rule

A phase may be marked **COMPLETE** only when:

- its acceptance criteria pass;
- relevant typecheck/lint/tests/build checks pass;
- security and tenant isolation requirements are satisfied;
- documentation is synchronized;
- no major feature in the phase is a fake or placeholder implementation.

If a dependency fails, fix it before advancing.

---

## Phase 0 — AUDIT
**Status:** COMPLETE (baseline audit)

Inspect the complete repository, Git history, configuration, current dependencies, actual source tree, and existing documentation.

Record:

- what exists and works;
- what is partial;
- what is missing;
- what is broken;
- architecture/schema conflicts;
- implementation order.

**Exit gate:** the agent has a concrete repository-state report and a verified implementation plan.

---

## Phase 1 — FOUNDATION
**Status:** IN PROGRESS

Implement and verify:

- Drizzle database layer;
- Supabase PostgreSQL connection;
- schema/migrations managed as code with Drizzle;
- environment configuration;
- strict TypeScript configuration;
- test/lint/typecheck/build scripts;
- application/service/domain directory boundaries;
- secure server-only database access.

**Exit gate:** application builds; database connection works; migrations can be applied; no secrets are committed.

---

### Phase 1 implementation notes

- The live Supabase database is the existing backend target for OrbitOS.
- The current physical schema uses `items` and `vendors`; the application may expose the domain concepts as products and suppliers without creating duplicate tables.
- Existing RLS and RPC security must be preserved and verified before feature work depends on them.
- Security Advisor currently reports five callable `SECURITY DEFINER` functions and leaked-password protection disabled; these are hardening items, not reasons to recreate the database.

## Phase 2 — AUTH + BUSINESS TENANCY
**Status:** NOT STARTED

Implement:

- registration;
- email verification;
- login/logout;
- password reset/change;
- Google OAuth when configured;
- sessions;
- `businesses`;
- `business_members`;
- active-business resolution;
- tenant isolation;
- authorization primitives.

**Exit gate:** two businesses can exist independently and one user's queries/mutations cannot access the other business.

---

## Phase 3 — ORBITOS APPLICATION SHELL
**Status:** NOT STARTED

Implement:

- authenticated app layout;
- responsive sidebar;
- header;
- active navigation;
- command palette;
- global search entry point;
- notifications entry point;
- profile/business menu;
- mobile navigation;
- light/dark theme;
- shared design-system primitives.

**Exit gate:** every authenticated route renders inside one consistent shell with correct access handling and loading/error/empty states.

---

## Phase 4 — PEOPLE + CATALOG
**Status:** NOT STARTED

Implement:

- customers;
- suppliers;
- product categories;
- products;
- CRUD/archive workflows;
- server validation;
- business-scoped search, sorting, filtering, pagination.

**Exit gate:** records persist in PostgreSQL and cannot cross business boundaries.

---

## Phase 5 — INVENTORY
**Status:** NOT STARTED

Implement transaction-based inventory:

- opening stock;
- purchase;
- sale;
- return;
- adjustment;
- damage;
- transfer;
- stock history;
- low-stock detection;
- inventory valuation.

**Exit gate:** stock changes are atomic, auditable, race-safe, and reconcile with source transactions.

---

## Phase 6 — SALES + INVOICES
**Status:** NOT STARTED

Implement:

- sales workflow;
- invoice creation/edit/cancel;
- invoice items;
- discounts;
- taxes;
- invoice numbering;
- invoice status;
- customer outstanding;
- invoice PDF;
- print/view actions.

**Exit gate:** invoice calculations are centralized, decimal-safe, persisted, and reflected consistently in customer balances and reports.

---

## Phase 7 — PAYMENTS + KHATA
**Status:** NOT STARTED

Implement:

- customer payments;
- supplier payments;
- payment methods;
- payment references;
- invoice allocation;
- customer ledger;
- supplier ledger;
- outstanding balances;
- statements;
- ledger exports/PDF where specified.

**Exit gate:** recording a payment updates the related invoice balance, ledger, outstanding amount, dashboard/report data, and audit trail atomically.

---

## Phase 8 — PURCHASES
**Status:** NOT STARTED

Implement:

- purchase orders/records;
- purchase items;
- receiving;
- supplier balances;
- purchase payments;
- inventory increases;
- cancellation rules.

**Exit gate:** purchase-to-stock and purchase-to-payable relationships are transactionally correct.

---

## Phase 9 — EXPENSES
**Status:** NOT STARTED

Implement:

- expense categories;
- expenses;
- payment method;
- vendor;
- notes;
- receipt attachment;
- expense reporting.

**Exit gate:** expenses persist securely, attachments are business-isolated, and financial reports use the same underlying transaction facts.

---

## Phase 10 — DASHBOARD + REPORTS
**Status:** NOT STARTED

Implement real database-backed:

- sales;
- purchases;
- expenses;
- revenue;
- gross/net profit;
- receivables;
- payables;
- inventory;
- outstanding;
- activity;
- alerts;
- date ranges;
- charts;
- exports.

**Exit gate:** no dashboard/report metric is hard-coded and every metric can be traced to underlying business transactions.

---

## Phase 11 — STAFF + SECURITY
**Status:** NOT STARTED

Implement:

- staff management;
- roles;
- granular permissions;
- role-permission mapping;
- server-side enforcement;
- audit log viewer;
- business settings authorization;
- security hardening.

**Exit gate:** permission-denied operations are rejected server-side even when invoked outside the UI.

---

## Phase 12 — SEARCH + NOTIFICATIONS
**Status:** NOT STARTED

Implement:

- global search;
- grouped results;
- business-scoped search;
- command palette actions;
- persistent notifications;
- read/unread state;
- activity surfaces.

**Exit gate:** search and notification results use real authorized data.

---

## Phase 13 — EXPORT + IMPORT
**Status:** NOT STARTED

Implement:

- CSV export;
- CSV import for specified entities;
- validation preview;
- atomic/controlled import;
- row-level error reporting;
- PDF/report export.

**Exit gate:** invalid data cannot silently become partial corrupted records.

---

## Phase 14 — STORAGE
**Status:** NOT STARTED

Use Supabase Storage for:

- business logos;
- product images;
- expense receipts;
- invoice attachments.

Requirements:

- private-by-default storage;
- business-isolated paths;
- safe filenames;
- file type/size validation;
- signed/private access where required.

**Exit gate:** users can access only files belonging to businesses they are authorized to access.

---

## Phase 15 — POLISH + ACCESSIBILITY
**Status:** NOT STARTED

Complete:

- responsive behavior;
- mobile UX;
- dark mode;
- loading/skeleton states;
- empty states;
- error states;
- keyboard navigation;
- focus management;
- accessible labels/dialogs;
- no horizontal overflow;
- performance cleanup.

**Exit gate:** core workflows work on desktop and mobile-sized viewports and pass the accessibility/security checks defined by the project.

---

## Phase 16 — TESTING + HARDENING
**Status:** NOT STARTED

Run and fix:

- unit tests;
- integration tests;
- E2E tests;
- golden business workflow;
- typecheck;
- lint;
- production build;
- tenant-isolation tests;
- permission tests;
- financial calculation tests.

**Exit gate:** critical tests pass reliably and no known blocking security/data-integrity defect remains.

---

## Phase 17 — DEPLOYMENT
**Status:** NOT STARTED

Finalize:

- production Supabase configuration;
- migrations;
- private object storage;
- environment variables;
- deployment target compatible with the actual Next.js architecture;
- production build;
- deployment documentation;
- rollback/recovery notes where appropriate.

Do not assume ordinary static hosting is sufficient for a server-rendered/dynamic Next.js application.

**Exit gate:** production deployment is reproducible from documented steps.

---

## Phase 18 — AI
**Status:** NOT STARTED

Only after the core system is stable.

Implement:

- AI business assistant;
- authorized read-only tools;
- intent/tool routing;
- business-scoped context;
- safe mutation confirmation;
- auditability.

Never give the LLM arbitrary SQL access.

**Exit gate:** AI can answer business questions using authorized application services and cannot bypass tenant/permission boundaries.

---

## Golden Workflow

This workflow must pass before the project is considered production-ready:

```
Create Business
  ↓
Create Customer
  ↓
Create Product
  ↓
Opening Stock = 100
  ↓
Create Invoice
  ↓
Sell 5 Units
  ↓
Stock = 95
  ↓
Customer Outstanding Updates
  ↓
Record Payment
  ↓
Invoice Balance Updates
  ↓
Khata Updates
  ↓
Dashboard Updates
  ↓
Reports Update
  ↓
Audit Event Exists

Then:

Create Supplier
  ↓
Create Purchase
  ↓
Stock Increases
  ↓
Supplier Balance Updates
  ↓
Purchase Appears In Reports

Then:

Create Expense
  ↓
Expense Appears In Reports
  ↓
Profit Calculation Updates
```

## Final rule

Do not advance phases for cosmetic progress. Advance phases for **verified working capability**.
