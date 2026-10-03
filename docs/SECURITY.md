# OrbitOS — Security Model

## Security priorities

Security decisions are part of the product architecture, not optional UI behavior.

### 1. Tenant isolation

The single tenant concept is **Business**:

- `businesses`
- `business_members`
- `business_id`

Every business-owned query and mutation must be scoped to an authenticated business membership.

A user must never be able to read or mutate another business's:

- customers
- suppliers
- products
- inventory
- sales
- purchases
- invoices
- payments
- expenses
- ledger entries
- staff
- reports
- notifications
- files
- settings

Frontend filtering is never a security boundary.

### 2. Server-side authorization

Every protected operation must verify:

```text
authenticated user
    ↓
active session
    ↓
business membership
    ↓
permission
    ↓
operation
```

Never trust client-provided:

- `business_id`
- `user_id`
- role
- permission
- price
- balance
- financial totals

Resolve security-sensitive identity and authorization context on the server.

### 3. Row Level Security

The primary application data path is server-side Drizzle/PostgreSQL.

RLS is mandatory for any business data exposed through Supabase client access or otherwise reachable outside the trusted server path.

Where practical, use RLS as defense in depth even when server-side authorization is already enforced.

### 4. Authentication

Auth.js/NextAuth provides:

- secure sessions;
- credentials authentication;
- OAuth when configured;
- protected application routes;
- logout;
- password recovery/reset flows as implemented by the application.

Session secrets and provider credentials remain server-side.

### 5. Least privilege

Use explicit permission strings such as:

```text
customers.view
customers.create
customers.edit
customers.archive

products.view
products.create
products.edit
products.archive

inventory.view
inventory.adjust

sales.view
sales.create
sales.edit
sales.cancel

invoices.view
invoices.create
invoices.edit
invoices.cancel

payments.view
payments.create

expenses.view
expenses.create
expenses.edit
expenses.archive

reports.view

staff.view
staff.manage

settings.manage
```

The exact permission catalogue may expand, but permissions must be enforced server-side.

### 6. Financial and inventory integrity

Critical mutations must execute inside database transactions.

Examples:

- invoice creation;
- invoice cancellation;
- payment recording;
- purchase receiving;
- stock adjustment;
- sale confirmation.

If one required operation fails, the transaction must roll back.

Money calculations use decimal-safe PostgreSQL numeric/decimal values as the persistence source of truth.

### 7. Audit trail

Record significant mutations with enough information to reconstruct what happened:

```text
business_id
user_id
action
entity_type
entity_id
previous_state
next_state
metadata
created_at
```

Audit records should be append-only from the application perspective.

### 8. Destructive actions

Do not hard-delete financial history.

Prefer:

- archive for reference/master data;
- inactive state for products/staff where appropriate;
- cancellation/status transitions for financial records.

### 9. Storage security

Supabase Storage should be private by default.

Requirements:

- business-isolated object paths;
- validated file type;
- validated file size;
- safe object names;
- authorization before access;
- signed/private retrieval where required.

Never expose another business's private files.

### 10. Secret handling

Never commit:

- database passwords;
- OAuth client secrets;
- auth secrets;
- Supabase service-role keys;
- deployment credentials.

Keep secrets in environment configuration or the deployment provider's secret manager.

### 11. Security verification

Security is complete only when tests verify at minimum:

- cross-business read denial;
- cross-business mutation denial;
- permission denial on protected operations;
- private file access control;
- server-side validation;
- financial transaction atomicity.

