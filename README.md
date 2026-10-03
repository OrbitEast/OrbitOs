# OrbitOS

OrbitOS is a cloud-backed business operating system by Orbit East.

The repository is being developed as a real multi-tenant application, not a static demo.

## Product scope

OrbitOS connects:

Customers · Suppliers · Products · Inventory · Sales · Purchases · Invoices · Payments · Expenses · Khata · Staff · Reports · Notifications · Search · Settings · AI

## Canonical project documentation

Start here before changing code:

1. [AGENTS.md](./AGENTS.md) — AI agent execution contract
2. [CLAUDE.md](./CLAUDE.md) — Claude Code bootstrap instructions
3. [OrbitOS master plan.md](./OrbitOS%20master%20plan.md) — canonical product requirements
4. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — application architecture
5. [docs/DATABASE.md](./docs/DATABASE.md) — database specification
6. [docs/SECURITY.md](./docs/SECURITY.md) — security model
7. [docs/DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md) — visual system
8. [docs/TESTING.md](./docs/TESTING.md) — testing strategy
9. [docs/DEVELOPMENT_ROADMAP.md](./docs/DEVELOPMENT_ROADMAP.md) — implementation order/status

## Canonical tenant model

OrbitOS uses one tenant concept:

```text
User
  ↓
Business
  ↓
Business Membership
  ↓
Business Data
```

Database naming:

```text
businesses
business_members
business_id
```

Do not introduce a parallel organizations/organization_id model without a documented architecture decision.

## Current codebase

The repository currently contains a Next.js App Router foundation and project documentation. Do not infer feature completion from the documentation; inspect the actual source before coding.

## Development

Use the package scripts defined in `package.json`.

The repository is expected to grow to include:

```text
app/
components/
db/
lib/
tests/
public/
```

Keep UI, domain/business logic, authorization, validation, and database access separated.

## Core engineering rule

No fake functionality.

A feature is complete only when its real data flow, authorization, persistence, error handling, and relevant tests work.

