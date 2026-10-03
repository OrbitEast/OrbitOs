# OrbitOS Progress Tracker

> Last updated: 2026-10-03
>
> This file is the execution/status record for the OrbitOS Master Product Requirements Document (PRD). The PRD remains the product source of truth; this file records what has actually been completed, what is partial/broken, and what comes next.

## 1. Current Status

**Current phase:** Phase 1 — Foundation (IN PROGRESS)

**Phase 0 — Audit:** COMPLETE

**Overall product status:** Foundation/backend groundwork is substantially established, but the actual business application workflows are not yet implemented. OrbitOS must not be considered production-ready or complete until the PRD Definition of Done and Golden Workflow pass.

---

## 2. What We Have Completed

### Repository / Architecture
- GitHub repository: `OrbitEast/OrbitOs`
- Canonical tenant model: `Business -> business_members -> business-owned data`
- Existing Next.js + React + TypeScript foundation preserved.
- Existing Drizzle ORM architecture preserved.
- Supabase PostgreSQL selected as the dedicated OrbitOS production backend.
- Documentation was synchronized to the Supabase direction.
- No parallel `organizations` tenant model introduced.

### Supabase Backend
Active project:
- Project: `OrbitOs`
- Ref: `pdataqrwihziwmltadez`
- Region: `ap-south-1`
- Status at audit: `ACTIVE_HEALTHY`
- PostgreSQL: 17.11

Foundation tables already created:
- `users`
- `accounts`
- `sessions`
- `verification_tokens`
- `authenticators`
- `businesses`
- `business_members`
- `customers`
- `vendors`
- `item_categories`
- `items`
- `invoices`
- `invoice_items`
- `payments`
- `purchases`
- `purchase_items`
- `expenses`
- `stock_movements`
- `audit_logs`
- `notifications`
- `auth_rate_limits`

Security/database groundwork:
- RLS enabled on all 21 application tables.
- Public `anon` / `authenticated` table and sequence privileges revoked.
- Public schema usage retained as required.
- Previously exposed public automatic-RLS SECURITY DEFINER function/event trigger was removed.
- Foreign-key indexes were added.
- Drizzle migrations applied:
  1. `orbit_os_foundation`
  2. `orbit_os_security_hardening`
  3. `orbit_os_foreign_key_indexes`
- Supabase TypeScript types generated and committed.
- `.env.example` points at the current Supabase project and does not contain real secrets.

### Application Foundation
- Server-side Drizzle database layer exists.
- Environment validation exists.
- Password hashing uses scrypt.
- Database-backed authentication rate limiting exists.
- Auth.js/NextAuth credentials authentication foundation exists.
- Signup API and login/signup UI foundation exist.
- Authenticated app entry checks authentication and business membership.

### Deployment Preparation
- Firebase project target: `orbitos-3cb9c`.
- Firebase Hosting configuration exists in the repository.
- Cloud Run service target: `orbitos-web`, region `asia-south1`.
- Next.js standalone Dockerfile exists.
- GitHub Actions deployment workflow was added for Cloud Run + Firebase Hosting.
- Latest deployment-preparation commit: `4543259e60eac6441252812b719178203f02c96a`.

**Important:** deployment is NOT complete. The Cloud Run service must actually exist and production secrets/environment variables must be configured before the public web.app URL can serve the dynamic application.

---

## 3. Current Errors / Blockers

### Firebase CLI local-directory error
The user successfully installed Firebase CLI and logged in as:
`support.orbiteast@gmail.com`

Then:
`firebase use orbitos-3cb9c`

returned:

> Error: firebase use must be run from a Firebase project directory.

This is a **local CLI context issue**, not evidence that the GitHub Firebase configuration is missing.

The user's desired workflow is GitHub-as-source-of-truth, so local Firebase initialization should not be treated as a product requirement.

### Deployment not yet verified
The repository contains deployment configuration, but the actual production deployment has not yet been verified.

Still required:
- Google Cloud/Firebase deployment credentials or GitHub Actions identity setup.
- Supabase production `DATABASE_URL`.
- `AUTH_SECRET` if Auth.js remains the selected authentication architecture.
- Production environment variables configured securely.
- Actual Cloud Run deployment.
- Actual Firebase Hosting deployment/rewrite verification.
- Final public URL smoke test.

### Authentication architecture decision still pending implementation
The current repository uses Auth.js/NextAuth + Drizzle against Supabase PostgreSQL.

A Supabase Auth architecture was discussed as a possible simplification, but **it has NOT been implemented**. Until deliberately migrated and tested, the current Auth.js foundation remains the implementation truth.

If authentication architecture is changed, update:
- `auth.ts`
- auth routes/UI
- environment documentation
- database assumptions
- security documentation
- roadmap/progress status

Do not mix two competing authentication systems without an explicit architecture decision.

### Supabase security hardening items
The roadmap audit recorded:
- Supabase Security Advisor reports five callable SECURITY DEFINER functions.
- Leaked-password protection is disabled.

These are hardening items to review deliberately. Do not recreate the database merely because of these findings.

---

## 4. What Is NOT Done Yet

Per the PRD/roadmap, the following phases are not complete:

- Phase 2 — Auth + Business Tenancy
- Phase 3 — OrbitOS Application Shell
- Phase 4 — People + Catalog
- Phase 5 — Inventory
- Phase 6 — Sales + Invoices
- Phase 7 — Payments + Khata
- Phase 8 — Purchases
- Phase 9 — Expenses
- Phase 10 — Dashboard + Reports
- Phase 11 — Staff + Security
- Phase 12 — Search + Notifications
- Phase 13 — Export + Import
- Phase 14 — Storage
- Phase 15 — Polish + Accessibility
- Phase 16 — Testing + Hardening
- Phase 17 — Deployment
- Phase 18 — AI

The repository must not mark these complete merely because routes/components/tables exist.

---

## 5. Phase-by-Phase Status

| Phase | Status | Evidence / next gate |
|---|---|---|
| 0 Audit | COMPLETE | Repository and live Supabase baseline audited. |
| 1 Foundation | IN PROGRESS | Finish verified DB/build/typecheck/lint/test gates and foundation boundaries. |
| 2 Auth + Business Tenancy | NOT STARTED | Complete full auth lifecycle, active business resolution, membership authorization, tenant isolation. |
| 3 Application Shell | NOT STARTED | Build real authenticated shell, navigation, command palette, notifications entry, responsive/dark UI. |
| 4 People + Catalog | NOT STARTED | Real customer/supplier/product/category CRUD with server authorization and persistence. |
| 5 Inventory | NOT STARTED | Transaction-based stock, atomic mutations, history, low stock, valuation. |
| 6 Sales + Invoices | NOT STARTED | Transactional invoice flow, decimal-safe totals, numbering, PDF/print. |
| 7 Payments + Khata | NOT STARTED | Atomic payment allocation, ledgers, outstanding, statements. |
| 8 Purchases | NOT STARTED | Purchase-to-stock and purchase-to-payable workflow. |
| 9 Expenses | NOT STARTED | Expense workflow + secure receipt attachment architecture. |
| 10 Dashboard + Reports | NOT STARTED | Real transaction-derived metrics only. |
| 11 Staff + Security | NOT STARTED | Roles, granular permissions, server enforcement, audit viewer. |
| 12 Search + Notifications | NOT STARTED | Authorized global search and persistent notifications. |
| 13 Export + Import | NOT STARTED | Validated CSV import/export and PDF/report exports. |
| 14 Storage | NOT STARTED | Private, business-isolated Supabase Storage. |
| 15 Polish | NOT STARTED | Mobile, accessibility, loading/error/empty states, performance. |
| 16 Testing | NOT STARTED | Unit/integration/E2E/golden workflow + security checks. |
| 17 Deployment | NOT STARTED | Reproducible production deployment and smoke test. |
| 18 AI | NOT STARTED | Authorized tool-based assistant only after core system stability. |

---

## 6. Known Repository Truth

The PRD explicitly requires:

`UI -> Server Action / Route Handler -> Zod -> Authentication -> Business Membership -> Permission -> Service -> Drizzle -> Supabase PostgreSQL`

Important rules:
- Never trust client-supplied `business_id`, user ID, role, permission, price, balance, or financial totals.
- Financial and inventory mutations must be server-authorized and transactional.
- PostgreSQL numeric/decimal is the financial source of truth.
- Preserve financial history; prefer cancellation/archive patterns.
- RLS is defense in depth when Supabase client access is exposed.
- No fake analytics, reports, payments, search, authentication, inventory, or AI responses.
- Secrets must never be committed.

---

## 7. Next Work — Continue Automatically From the PRD

After Phase 1 verification, continue in PRD order:

1. **Finish Phase 1 Foundation**
   - Verify package scripts.
   - Run typecheck/lint/tests/build.
   - Verify server-only DB access and environment handling.
   - Resolve any actual foundation failures.

2. **Implement Phase 2 Auth + Business Tenancy**
   - Complete registration/login/logout lifecycle.
   - Add email verification/password reset/change as required by the selected auth architecture.
   - Add Google OAuth only when credentials are available.
   - Implement business creation and active-business resolution.
   - Implement membership and server-side authorization primitives.
   - Verify tenant isolation with two businesses.

3. **Implement Phase 3 Application Shell**
   - Shared design system.
   - Authenticated layout/sidebar/header.
   - Responsive/mobile navigation.
   - Command palette/search entry.
   - Notifications entry.
   - Theme support.

4. Continue through Phases 4–18 in the exact PRD/roadmap order.

5. At every phase:
   - Inspect current implementation.
   - Implement the smallest coherent real slice.
   - Run relevant checks.
   - Fix failures.
   - Verify acceptance criteria.
   - Update this file.
   - Commit logically.

---

## 8. Golden Workflow — Final Acceptance Test

Before declaring OrbitOS production-ready, this must work with real persisted data:

```
Create Business
  ↓
Create Customer: Rahul
  ↓
Create Product: Product A
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

This workflow is the final product-level verification gate.

---

## 9. Deployment Notes

Desired production architecture:

```
GitHub main
   ↓
GitHub Actions
   ↓
Cloud Run (Next.js server)
   ↓
Supabase PostgreSQL / Storage

Firebase Hosting
   ↓
routes public web traffic to Cloud Run
```

Do not assume static Firebase Hosting is sufficient for this dynamic Next.js application.

Firebase CLI login is already complete for the user's Google account, but deployment authorization/configuration still needs verification.

---

## 10. Rule for Future Agents

**Read this file + `AGENTS.md` + `OrbitOS master plan.md` + `docs/DEVELOPMENT_ROADMAP.md` before continuing implementation.**

Do not erase historical progress.

Update this file whenever a material implementation, blocker, architecture decision, or verification result occurs.

**Goal:** turn OrbitOS into the real production-ready business operating system specified by the PRD — not a visual demo.
