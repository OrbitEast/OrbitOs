# OrbitOS Agent Instructions

## Mission

Turn `OrbitEast/OrbitOs` into a real, production-ready OrbitOS business operating system.

Do not build a visual demo. Every completed feature must use real application logic, real persistence, real authorization, and verifiable tests.

## Read Order — Required

Before changing code, inspect in this order:

1. `AGENTS.md` (this file)
2. `OrbitOS master plan.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DATABASE.md`
5. `docs/SECURITY.md`
6. `docs/DESIGN-SYSTEM.md`
7. `docs/TESTING.md`
8. `docs/DEVELOPMENT_ROADMAP.md`
9. The actual source tree and current Git history

The source code and database migrations are the implementation truth. The master plan is the product requirement truth. The architecture/database/security/design documents define implementation constraints.

## Canonical Terminology

OrbitOS has one tenant concept:

- Product/UI term: **Business**
- Database table: `businesses`
- Membership table: `business_members`
- Tenant foreign key: `business_id`

Do not create a second parallel `organizations` tenant model unless an explicit architecture decision requires it.

Older documentation may use "organization" conceptually. Interpret that as the OrbitOS Business tenant and use the canonical names above.

## Non-Negotiable Rules

- No fake data pretending to be live data.
- No fake buttons, fake reports, fake payments, fake search, or fake authentication.
- No client-only authorization.
- Never trust client-supplied `business_id`, user ID, role, permission, price, balance, or financial totals.
- Financial and inventory mutations must be server-authorized and transactional.
- Use decimal-safe money handling; PostgreSQL numeric/decimal is the source of truth.
- Preserve financial history; use cancellation/archive/soft-delete patterns rather than destructive deletion where appropriate.
- Keep business logic out of presentation components.
- Use the existing stack unless there is a documented technical reason to change it.
- Do not introduce a second ORM or competing persistence layer.
- Never commit secrets.
- Never expose private storage objects publicly by accident.

## Preferred Runtime Architecture

```
UI
  -> Server Action / Route Handler
  -> Zod validation
  -> Authentication
  -> Business membership
  -> Permission check
  -> Domain/service layer
  -> Drizzle
  -> Supabase PostgreSQL
```

Use Supabase Storage for private business files.

Use RLS as defense in depth where Supabase client access is exposed; server-side authorization remains mandatory.

## Agent Execution Loop

For each phase:

```
Inspect
  -> identify current state
  -> implement the smallest coherent slice
  -> run typecheck/lint/tests/build
  -> fix failures
  -> verify against acceptance criteria
  -> document important decisions
  -> continue
```

Do not stop merely because a route or component exists.

A feature is complete only when its full data flow works, authorization is enforced, UI states are handled, and the relevant automated checks pass.

## Change Management

- Prefer small, logically grouped commits.
- Do not rewrite working architecture without evidence.
- Do not commit `.claude/worktrees/` artifacts as application source.
- Review the diff before committing.
- Keep documentation synchronized with architectural changes.
- Update the implementation status when a phase materially advances.

## When Requirements Conflict

Resolve conflicts in this order:

1. Security/data-integrity requirements
2. Actual working code and migrations
3. The canonical technical contract in the master plan
4. Architecture/database/security/design documentation
5. Roadmap sequencing

When a conflict cannot be resolved safely from the repository, record the decision and its reasoning in documentation before proceeding. Do not silently invent a second architecture.

## Definition of Done

OrbitOS is finished only when the master plan's Definition of Done is satisfied and the critical end-to-end business workflow passes with real persisted data.

Never claim completion based on a UI-only implementation.
