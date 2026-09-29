# OrbitOS — Security Model

## Core Principles
1. **Zero-Trust Multi-Tenancy**: Every DB query must explicitly filter by `business_id`.
2. **Server-Side Enforcement**: Permissions are checked before *every* server action, not just UI-side.
3. **Audit Everything**: All record mutations (create, update, delete, cancel) logged in `audit_events`.
4. **Least Privilege**: Users possess fine-grained permission strings (e.g., `invoice.edit`).

## Infrastructure Security
- Postgres access restricted via row-level security (RLS) as a secondary defense (optional)
- Secrets managed via environment variables (never committed)
- File storage (attachments) is private by default; accessed via secure, short-lived signed URLs.

## Authentication & Authorization
- **Auth**: Auth.js with secure HTTP-only session cookies. Credentials + OAuth.
- **RBAC**: Middleware validates user session -> user membership in business -> permission.
- **Permission Mapping**:
  - `admin`: All permissions
  - `manager`: CRUD on core entities
  - `staff`: Limited CRUD, view-only on reports
  - `viewer`: Read-only

## Destructive Actions
- **No hard deletes**: Crucial financial entities use soft deletion or status (canceled/archived), never destructive `DELETE` queries.

## Audit Trails
- Logged: `user_id`, `entity_id`, `action`, `previous_state`, `next_state` (stored in JSONB `changes` field).
