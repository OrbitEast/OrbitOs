# OrbitOS — Architecture

**Version:** 2.0
**Status:** Build Reference
**Stack:** Next.js 15 · React 19 · TypeScript · PostgreSQL · Drizzle ORM

---

## 1. System Overview

OrbitOS is a local-first, multi-tenant business operating system. All business logic runs server-side. The frontend is a Next.js App Router application that communicates with the database through server actions and a thin domain layer.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
│  React 19 (Server Components + Client Components)               │
│  TanStack Query (client-side cache for mutations/optimistic UI) │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│                      Next.js 15 Server                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Middleware   │  │ Server       │  │  API Routes           │  │
│  │  (auth,      │  │ Actions      │  │  (webhooks, PDF,      │  │
│  │   tenancy)   │  │ (mutations)  │  │   file upload)        │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                      │              │
│  ┌──────▼─────────────────▼──────────────────────▼───────────┐  │
│  │                   Domain Layer (/lib)                      │  │
│  │  Calculations · Validation · Permissions · Audit · RBAC   │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │               Infrastructure Layer                        │  │
│  │  Drizzle ORM · Auth.js · File Storage · Search            │  │
│  └──────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ TCP
┌─────────────────────────────▼───────────────────────────────────┐
│                        PostgreSQL                               │
│  Tables · Indexes · Foreign Keys · Constraints · Triggers       │
│  pg_trgm (search) · Transactions                                │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow — Read (Server Component)

```
Browser GET /customers
  → Next.js Middleware (verify session, resolve business_id)
  → Server Component renders
    → calls db.query.customers.findMany({ where: { businessId } })
    → Drizzle generates SQL with business_id scope
    → PostgreSQL returns rows
  → React streams HTML to browser
```

### Request Flow — Write (Server Action)

```
Browser submits "Create Invoice" form
  → Server Action: createInvoice(formData)
    → Zod validates input
    → lib/permissions checks invoice.create for current user+business
    → lib/calculations computes totals (decimal-safe)
    → db.transaction:
        INSERT invoice
        INSERT invoice_items
        UPDATE inventory (decrement stock)
        INSERT inventory_movements
        INSERT audit_event
    → revalidatePath('/invoices')
  → Server returns { success: true, data: invoice }
  → Browser updates via revalidation
```

---

## 2. Application Layers

The application has four strict layers. Dependencies flow downward only.

```
Presentation  →  Application  →  Domain  →  Infrastructure
```

No layer may skip a level. Presentation never touches the database directly. Infrastructure never contains business rules.

### 2.1 Presentation Layer

**Location:** `app/`, `components/`

Responsible for:
- Page routing and layouts (Next.js App Router)
- Server Components for data display (zero client JS by default)
- Client Components for interactivity (forms, modals, dropdowns)
- Design system components (`components/ui/`)
- Feature-specific UI (`features/*/components/`)

Rules:
- No database imports in components
- No business calculations in components
- No direct SQL in components
- Components receive data as props or fetch via server component patterns
- Client components call server actions for mutations

### 2.2 Application Layer

**Location:** `app/*/actions.ts`, `app/api/`

Responsible for:
- Server actions (form submissions, mutations)
- API routes (webhooks, PDF generation, file uploads)
- Input validation (Zod schemas)
- Orchestrating domain calls
- Returning structured responses
- Path revalidation after mutations

Server action signature:

```typescript
// Every server action returns this shape
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; field?: string } }

// Example
export async function createCustomer(
  formData: FormData
): Promise<ActionResult<Customer>> {
  const session = await requireAuth();
  const input = customerSchema.safeParse(Object.fromEntries(formData));
  
  if (!input.success) {
    return { success: false, error: { code: 'VALIDATION', message: input.error.issues[0].message } };
  }

  await requirePermission(session, 'customer.create');
  
  const customer = await customerService.create(session.businessId, input.data);
  
  revalidatePath('/customers');
  return { success: true, data: customer };
}
```

### 2.3 Domain Layer

**Location:** `lib/`

Responsible for:
- Business logic and rules
- Financial calculations (decimal-safe)
- Permission evaluation
- Validation schemas (shared with frontend)
- Audit event generation
- Inventory management logic
- Invoice state machine
- Ledger operations

Rules:
- Pure functions where possible
- No React imports
- No Next.js imports
- Framework-agnostic business logic
- All monetary math uses decimal-safe operations

### 2.4 Infrastructure Layer

**Location:** `lib/database/`, `lib/auth/`, `lib/storage/`

Responsible for:
- Database connection and schema (Drizzle)
- Authentication (Auth.js)
- File storage abstraction
- Search indexing
- Email/notification dispatch (future)
- External service clients (future)

Rules:
- Abstractions over concrete providers
- Storage uses an interface so local filesystem can be swapped for S3
- Database schema is the source of truth for data structure

---

## 3. Directory Structure

```
orbit-os/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, register)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Minimal layout, no sidebar
│   │
│   ├── (app)/                    # Authenticated app route group
│   │   ├── layout.tsx            # App shell: sidebar + header
│   │   ├── page.tsx              # Dashboard / Overview
│   │   │
│   │   ├── customers/
│   │   │   ├── page.tsx          # Customer list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Customer profile
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Create customer
│   │   │   └── actions.ts        # Server actions
│   │   │
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── khata/
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   ├── expenses/
│   │   ├── reports/
│   │   ├── analytics/
│   │   ├── staff/
│   │   ├── notifications/
│   │   └── settings/
│   │
│   ├── api/                      # API routes (non-action endpoints)
│   │   ├── auth/[...nextauth]/   # Auth.js handler
│   │   ├── webhooks/
│   │   ├── pdf/
│   │   └── upload/
│   │
│   ├── layout.tsx                # Root layout (html, body, providers)
│   ├── globals.css               # Design tokens, Tailwind base
│   └── not-found.tsx
│
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   └── ...
│   │
│   ├── layout/                   # App shell components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── command-palette.tsx
│   │   └── notification-center.tsx
│   │
│   ├── tables/                   # Reusable data table infrastructure
│   │   ├── data-table.tsx        # Core table component
│   │   ├── table-pagination.tsx
│   │   ├── table-filters.tsx
│   │   ├── table-sort.tsx
│   │   ├── table-columns.tsx
│   │   └── table-toolbar.tsx
│   │
│   └── charts/                   # Chart wrappers (Recharts)
│       ├── revenue-chart.tsx
│       ├── sales-breakdown.tsx
│       ├── chart-container.tsx
│       └── ...
│
├── features/                     # Feature-specific non-UI logic
│   ├── customers/
│   │   ├── queries.ts            # Database queries
│   │   ├── schemas.ts            # Zod schemas
│   │   └── types.ts              # TypeScript types
│   │
│   ├── products/
│   │   ├── queries.ts
│   │   ├── schemas.ts
│   │   └── types.ts
│   │
│   ├── inventory/
│   │   ├── queries.ts
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── movements.ts          # Inventory movement logic
│   │
│   ├── orders/
│   ├── invoices/
│   │   ├── queries.ts
│   │   ├── schemas.ts
│   │   ├── types.ts
│   │   └── state-machine.ts      # Invoice status transitions
│   │
│   ├── payments/
│   ├── khata/
│   ├── suppliers/
│   ├── purchases/
│   ├── expenses/
│   ├── reports/
│   └── staff/
│
├── lib/
│   ├── auth/
│   │   ├── config.ts             # Auth.js configuration
│   │   ├── session.ts            # Session helpers (requireAuth, getSession)
│   │   └── middleware.ts         # Auth middleware logic
│   │
│   ├── database/
│   │   ├── index.ts              # Drizzle client singleton
│   │   ├── schema/               # All table definitions
│   │   │   ├── index.ts          # Re-exports all schemas
│   │   │   ├── users.ts
│   │   │   ├── businesses.ts
│   │   │   ├── customers.ts
│   │   │   ├── products.ts
│   │   │   ├── inventory.ts
│   │   │   ├── orders.ts
│   │   │   ├── invoices.ts
│   │   │   ├── payments.ts
│   │   │   ├── expenses.ts
│   │   │   ├── suppliers.ts
│   │   │   ├── staff.ts
│   │   │   ├── audit.ts
│   │   │   └── notifications.ts
│   │   ├── migrations/           # Drizzle migration files
│   │   └── seed.ts               # Realistic seed data generator
│   │
│   ├── permissions/
│   │   ├── index.ts              # Permission checking functions
│   │   ├── roles.ts              # Role definitions and permission maps
│   │   └── types.ts              # Permission string literals
│   │
│   ├── validation/
│   │   └── schemas.ts            # Shared Zod schemas (used by both client & server)
│   │
│   ├── calculations/
│   │   ├── money.ts              # Decimal-safe monetary arithmetic
│   │   ├── invoice.ts            # Invoice total, tax, discount calculations
│   │   ├── inventory.ts          # Stock level calculations
│   │   └── ledger.ts             # Running balance calculations
│   │
│   ├── logging/
│   │   ├── audit.ts              # Audit event creation
│   │   └── logger.ts             # Application logger
│   │
│   ├── storage/
│   │   ├── index.ts              # Storage interface
│   │   ├── local.ts              # Local filesystem implementation
│   │   └── types.ts              # Storage types
│   │
│   └── utils/
│       ├── format.ts             # Currency, date, number formatting
│       ├── ids.ts                # ID generation (prefixed nanoid)
│       └── constants.ts          # Application constants
│
├── tests/
│   ├── unit/
│   │   ├── calculations/
│   │   │   ├── money.test.ts
│   │   │   ├── invoice.test.ts
│   │   │   ├── inventory.test.ts
│   │   │   └── ledger.test.ts
│   │   └── permissions/
│   │       └── rbac.test.ts
│   │
│   ├── integration/
│   │   ├── invoice-inventory.test.ts
│   │   ├── payment-invoice.test.ts
│   │   ├── purchase-inventory.test.ts
│   │   └── order-flow.test.ts
│   │
│   └── e2e/
│       ├── golden-flow.spec.ts   # The PRD §52 golden test
│       ├── auth.spec.ts
│       └── ...
│
├── database/
│   └── erd.md                    # Entity-relationship documentation
│
├── docs/
│   ├── SECURITY.md
│   ├── DESIGN-SYSTEM.md
│   ├── TESTING.md
│   ├── API.md
│   └── DATABASE.md
│
├── scripts/
│   ├── seed.ts                   # Run seed data
│   ├── migrate.ts                # Run migrations
│   └── reset-db.ts               # Reset and re-seed for development
│
├── public/
│   └── ...
│
├── ARCHITECTURE.md               # This file
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
├── next.config.ts
├── middleware.ts                  # Next.js middleware (auth + tenancy)
├── .env.example
└── .gitignore
```

---

## 4. Data Flow

### 4.1 Server Component Read Path

Server Components fetch data directly during render. No API call, no client-side fetch.

```
Page (Server Component)
  │
  ├── await requireAuth()            # Verifies session, returns user + businessId
  │
  ├── await customerQueries.list({   # Feature query function
  │     businessId,                   # Always scoped
  │     page, sort, filter            # From searchParams
  │   })
  │
  ├── Drizzle generates:
  │   SELECT * FROM customers
  │   WHERE business_id = $1
  │   ORDER BY $2
  │   LIMIT $3 OFFSET $4
  │
  └── Returns JSX with data props to child components
```

### 4.2 Client Mutation Path

Client components submit mutations through server actions. TanStack Query manages optimistic updates and cache invalidation on the client side where needed.

```
Client Component
  │
  ├── User clicks "Create Customer"
  │
  ├── Calls server action: createCustomer(formData)
  │   │
  │   ├── Zod validates input
  │   ├── requirePermission(session, 'customer.create')
  │   ├── db.insert(customers).values({ ...data, businessId })
  │   ├── audit.log('customer.created', { ... })
  │   ├── revalidatePath('/customers')
  │   └── return { success: true, data: customer }
  │
  └── UI shows success toast, list refreshes via revalidation
```

### 4.3 Transactional Mutation Path (Multi-Table)

For operations that touch multiple tables (e.g., recording a payment):

```
recordPayment(invoiceId, amount)
  │
  └── db.transaction(async (tx) => {
        // 1. Insert payment record
        const payment = await tx.insert(payments).values({ ... });
        
        // 2. Update invoice paid amount + status
        await tx.update(invoices)
          .set({ paidAmount: sql`paid_amount + ${amount}`, status: newStatus })
          .where(eq(invoices.id, invoiceId));
        
        // 3. Insert ledger entry
        await tx.insert(ledgerEntries).values({ ... });
        
        // 4. Log audit event
        await tx.insert(auditEvents).values({ ... });
        
        return payment;
      });
```

If any step fails, the entire transaction rolls back. No partial updates.

---

## 5. Multi-Tenancy

### 5.1 Model

OrbitOS uses **shared database, shared schema** multi-tenancy. Every business-scoped table has a `business_id` column.

```
users (global)
  └── business_members (junction)
        └── businesses
              ├── customers      (business_id FK)
              ├── products       (business_id FK)
              ├── invoices       (business_id FK)
              ├── payments       (business_id FK)
              ├── expenses       (business_id FK)
              ├── inventory      (business_id FK)
              ├── suppliers      (business_id FK)
              ├── orders         (business_id FK)
              ├── staff          (business_id FK)
              ├── audit_events   (business_id FK)
              └── notifications  (business_id FK)
```

### 5.2 Enforcement

**Middleware** resolves the active business from the session and injects it into every request context:

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session) return redirect('/login');

  const businessId = session.activeBusinessId;
  if (!businessId) return redirect('/select-business');

  // Verify membership
  const member = await db.query.businessMembers.findFirst({
    where: and(
      eq(businessMembers.userId, session.userId),
      eq(businessMembers.businessId, businessId)
    ),
  });

  if (!member) return new Response('Forbidden', { status: 403 });
}
```

**Query functions** always require `businessId` as a parameter. There is no way to call a query without it.

```typescript
// features/customers/queries.ts
export async function listCustomers(businessId: string, opts: ListOptions) {
  return db.query.customers.findMany({
    where: eq(customers.businessId, businessId),
    // ...
  });
}
```

**Type safety** — the `businessId` parameter is not optional. Forgetting it is a compile error, not a runtime bug.

### 5.3 Cross-Tenant Protection

A user requesting `/invoices/INV-123` triggers:

```typescript
const invoice = await db.query.invoices.findFirst({
  where: and(
    eq(invoices.id, invoiceId),
    eq(invoices.businessId, session.businessId)  // Always scoped
  ),
});

if (!invoice) return notFound();  // 404, not 403 — don't leak existence
```

---

## 6. Authentication & Authorization

### 6.1 Authentication

Auth.js (NextAuth v5) handles authentication.

```
Supported providers:
  - Credentials (email + password, bcrypt-hashed)
  - Google OAuth (future)
  - GitHub OAuth (future, for dev convenience)
```

Session strategy: **JWT** (stateless, no session table needed for basic auth).

Session shape:

```typescript
interface Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
  activeBusinessId: string;
  activeMemberRole: string;  // 'owner' | 'admin' | 'member' | 'viewer'
}
```

### 6.2 Authorization (RBAC)

Every feature action has a permission string:

```typescript
// lib/permissions/types.ts
type Permission =
  // Customers
  | 'customer.view' | 'customer.create' | 'customer.edit' | 'customer.archive' | 'customer.export'
  // Products
  | 'product.view' | 'product.create' | 'product.edit' | 'product.archive'
  // Inventory
  | 'inventory.view' | 'inventory.create' | 'inventory.adjust' | 'inventory.export'
  // Orders
  | 'order.view' | 'order.create' | 'order.edit' | 'order.cancel'
  // Invoices
  | 'invoice.view' | 'invoice.create' | 'invoice.edit' | 'invoice.cancel' | 'invoice.export'
  // Payments
  | 'payment.view' | 'payment.create' | 'payment.reverse'
  // Expenses
  | 'expense.view' | 'expense.create' | 'expense.edit' | 'expense.delete'
  // Suppliers
  | 'supplier.view' | 'supplier.create' | 'supplier.edit' | 'supplier.archive'
  // Reports
  | 'report.view' | 'report.export'
  // Staff
  | 'staff.view' | 'staff.invite' | 'staff.edit' | 'staff.remove' | 'staff.roles'
  // Settings
  | 'settings.view' | 'settings.edit'
  // Audit
  | 'audit.view';
```

Roles map to permission sets:

```typescript
// lib/permissions/roles.ts
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ['*'],               // All permissions
  admin: [/* everything except staff.roles, settings.edit */],
  member: [/* day-to-day operations */],
  viewer: [/* *.view, *.export only */],
};
```

Permission checks are server-side only:

```typescript
// lib/permissions/index.ts
export async function requirePermission(
  session: Session,
  permission: Permission
): Promise<void> {
  const role = session.activeMemberRole;
  const allowed = hasPermission(role, permission);

  if (!allowed) {
    throw new ForbiddenError(`Missing permission: ${permission}`);
  }
}
```

**The frontend may hide UI elements based on role for UX purposes, but the server always re-checks.** A hidden button is not security.

---

## 7. Business Logic Layer

### 7.1 Location

All business logic lives in `lib/`. It is framework-agnostic TypeScript.

```
lib/calculations/
  ├── money.ts        # Core monetary operations
  ├── invoice.ts      # Invoice-specific calculations
  ├── inventory.ts    # Stock level computations
  └── ledger.ts       # Running balance calculations
```

### 7.2 Decimal-Safe Arithmetic

All monetary values are stored as **integers in paisa** (1/100 of ₹) in the database. Display formatting happens at the boundary.

```typescript
// lib/calculations/money.ts

/** All money values in the system are in paisa (integer cents) */
export type Paisa = number & { readonly __brand: 'Paisa' };

export function toPaisa(rupees: number): Paisa {
  return Math.round(rupees * 100) as Paisa;
}

export function toRupees(paisa: Paisa): number {
  return paisa / 100;
}

export function addMoney(a: Paisa, b: Paisa): Paisa {
  return (a + b) as Paisa;
}

export function subtractMoney(a: Paisa, b: Paisa): Paisa {
  return (a - b) as Paisa;
}

export function multiplyMoney(amount: Paisa, quantity: number): Paisa {
  return Math.round(amount * quantity) as Paisa;
}

export function calculatePercentage(amount: Paisa, percent: number): Paisa {
  return Math.round((amount * percent) / 100) as Paisa;
}
```

### 7.3 Invoice Calculation Example

```typescript
// lib/calculations/invoice.ts

export interface InvoiceLineInput {
  unitPrice: Paisa;
  quantity: number;
  discountPercent: number;
  taxPercent: number;
}

export interface InvoiceCalculation {
  subtotal: Paisa;
  discountAmount: Paisa;
  taxableAmount: Paisa;
  taxAmount: Paisa;
  total: Paisa;
}

export function calculateInvoice(lines: InvoiceLineInput[]): InvoiceCalculation {
  let subtotal = 0 as Paisa;
  let totalDiscount = 0 as Paisa;
  let totalTax = 0 as Paisa;

  for (const line of lines) {
    const lineTotal = multiplyMoney(line.unitPrice, line.quantity);
    const lineDiscount = calculatePercentage(lineTotal, line.discountPercent);
    const taxable = subtractMoney(lineTotal, lineDiscount);
    const lineTax = calculatePercentage(taxable, line.taxPercent);

    subtotal = addMoney(subtotal, lineTotal);
    totalDiscount = addMoney(totalDiscount, lineDiscount);
    totalTax = addMoney(totalTax, lineTax);
  }

  const taxableAmount = subtractMoney(subtotal, totalDiscount);
  const total = addMoney(taxableAmount, totalTax);

  return { subtotal, discountAmount: totalDiscount, taxableAmount, taxAmount: totalTax, total };
}
```

This function is pure. It runs identically on server and client. It is the single source of truth for invoice math.

---

## 8. Transactional Integrity

### 8.1 Transaction Boundaries

Any operation that modifies more than one table must run in a transaction.

Critical transactional operations:

| Operation | Tables Modified |
|---|---|
| Record payment | `payments`, `invoices`, `ledger_entries`, `audit_events` |
| Create order from invoice | `orders`, `order_items`, `invoices`, `invoice_items`, `inventory`, `inventory_movements`, `audit_events` |
| Purchase stock | `purchases`, `purchase_items`, `inventory`, `inventory_movements`, `audit_events` |
| Cancel invoice | `invoices`, `inventory` (restore stock), `inventory_movements`, `audit_events` |

### 8.2 Transaction Pattern

```typescript
export async function recordPayment(
  businessId: string,
  invoiceId: string,
  amount: Paisa,
  method: PaymentMethod,
  userId: string
): Promise<Payment> {
  return db.transaction(async (tx) => {
    // 1. Verify invoice exists, belongs to business, is not cancelled/fully-paid
    const invoice = await tx.query.invoices.findFirst({
      where: and(
        eq(invoices.id, invoiceId),
        eq(invoices.businessId, businessId),
      ),
    });

    if (!invoice) throw new NotFoundError('Invoice not found');
    if (invoice.status === 'cancelled') throw new BusinessError('Cannot pay cancelled invoice');
    if (invoice.status === 'paid') throw new BusinessError('Invoice already fully paid');

    const newPaidAmount = addMoney(invoice.paidAmount as Paisa, amount);
    if (newPaidAmount > invoice.total) {
      throw new BusinessError('Payment exceeds invoice balance');
    }

    // 2. Insert payment
    const [payment] = await tx.insert(payments).values({
      id: generateId('pay'),
      businessId,
      invoiceId,
      customerId: invoice.customerId,
      amount,
      method,
      paidAt: new Date(),
      createdBy: userId,
    }).returning();

    // 3. Update invoice
    const newStatus: InvoiceStatus = newPaidAmount === invoice.total ? 'paid' : 'partially_paid';
    await tx.update(invoices)
      .set({ paidAmount: newPaidAmount, status: newStatus, updatedAt: new Date() })
      .where(eq(invoices.id, invoiceId));

    // 4. Insert ledger entry
    await tx.insert(ledgerEntries).values({
      id: generateId('le'),
      businessId,
      customerId: invoice.customerId,
      type: 'credit',
      amount,
      description: `Payment for Invoice ${invoice.number}`,
      referenceType: 'payment',
      referenceId: payment.id,
      createdAt: new Date(),
    });

    // 5. Audit
    await tx.insert(auditEvents).values({
      id: generateId('aud'),
      businessId,
      userId,
      action: 'payment.created',
      entityType: 'payment',
      entityId: payment.id,
      metadata: { invoiceId, amount, method, newStatus },
      createdAt: new Date(),
    });

    return payment;
  });
}
```

### 8.3 Inventory Movement Integrity

Stock is never set to an absolute value. Every change is a movement.

```typescript
export async function adjustInventory(
  tx: Transaction,
  businessId: string,
  productId: string,
  change: number,           // positive = in, negative = out
  reason: MovementReason,   // 'sale' | 'purchase' | 'return' | 'damage' | 'adjustment'
  referenceType: string,
  referenceId: string,
  userId: string
) {
  // 1. Update current stock
  await tx.update(products)
    .set({ stock: sql`stock + ${change}` })
    .where(and(eq(products.id, productId), eq(products.businessId, businessId)));

  // 2. Record movement
  await tx.insert(inventoryMovements).values({
    id: generateId('im'),
    businessId,
    productId,
    change,
    reason,
    referenceType,
    referenceId,
    createdBy: userId,
    createdAt: new Date(),
  });
}
```

---

## 9. Audit System

### 9.1 What Gets Audited

Every create, update, delete/cancel/archive operation on business entities.

```typescript
interface AuditEvent {
  id: string;
  businessId: string;
  userId: string;
  action: string;           // 'customer.created', 'invoice.updated', 'payment.created'
  entityType: string;       // 'customer', 'invoice', 'payment'
  entityId: string;         // ID of the affected entity
  metadata: JsonValue;      // Before/after values, relevant context
  ipAddress?: string;
  createdAt: Date;
}
```

### 9.2 Metadata for Updates

When updating an entity, the audit event captures before and after values:

```typescript
metadata: {
  changes: {
    total: { before: 500000, after: 550000 },     // in paisa
    status: { before: 'draft', after: 'issued' },
  }
}
```

### 9.3 Audit Helper

```typescript
// lib/logging/audit.ts
export async function logAudit(
  tx: Transaction,
  params: {
    businessId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }
) {
  await tx.insert(auditEvents).values({
    id: generateId('aud'),
    ...params,
    createdAt: new Date(),
  });
}
```

---

## 10. Error Handling

### 10.1 Error Types

```typescript
// lib/errors.ts

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super('FORBIDDEN', message, 403);
  }
}

export class BusinessError extends AppError {
  constructor(message: string) {
    super('BUSINESS_RULE', message, 422);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string
  ) {
    super('VALIDATION', message, 400);
  }
}
```

### 10.2 Server Action Error Handling

```typescript
export async function createInvoice(formData: FormData): Promise<ActionResult<Invoice>> {
  try {
    const session = await requireAuth();
    // ... validation, permission check, business logic ...
    return { success: true, data: invoice };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: { code: error.code, message: error.message } };
    }
    // Log unexpected errors, return generic message
    console.error('Unexpected error in createInvoice:', error);
    return { success: false, error: { code: 'INTERNAL', message: 'Something went wrong. Please try again.' } };
  }
}
```

### 10.3 UI Error Handling

The UI maps error codes to user-friendly messages and recovery actions:

```typescript
// components/ui/error-state.tsx
<ErrorState
  title="Couldn't load your invoices"
  description="This might be a temporary issue."
  action={{ label: 'Retry', onClick: () => router.refresh() }}
/>
```

---

## 11. API Design

### 11.1 Primary Pattern: Server Actions

Most data mutations use Next.js server actions. They are type-safe, colocated with the route, and automatically handle serialization.

Server actions live in `app/(app)/[feature]/actions.ts`.

### 11.2 API Routes (Exceptions Only)

API routes (`app/api/`) are used only when server actions are inappropriate:

| Route | Purpose |
|---|---|
| `POST /api/auth/[...nextauth]` | Auth.js handler |
| `GET /api/pdf/invoice/[id]` | Generate and stream invoice PDF |
| `POST /api/upload` | File upload (multipart form data) |
| `POST /api/webhooks/[provider]` | Incoming webhooks from external services |

### 11.3 No REST API

OrbitOS does not expose a general REST API. All data access goes through server components and server actions. If an external API is needed in the future, it will be built on top of the existing domain layer with its own authentication (API keys) and rate limiting.

---

## 12. Caching Strategy

### 12.1 Server-Side

- **Next.js route cache:** Dynamic routes (`export const dynamic = 'force-dynamic'`) for all business data pages. No stale financial data.
- **`revalidatePath`:** Called after every mutation to refresh affected routes.
- **Database indexes:** Primary performance mechanism. Every `business_id` column indexed. Composite indexes on frequent query patterns.

### 12.2 Client-Side

- **TanStack Query:** Used sparingly for client-interactive patterns (e.g., search-as-you-type, infinite scroll). Default stale time: 30 seconds. Mutations invalidate related queries.
- **`useOptimistic`:** For UI patterns that benefit from instant feedback (status toggles, inline edits).

### 12.3 Database Optimization

```sql
-- Every business-scoped table
CREATE INDEX idx_customers_business ON customers(business_id);

-- Common query patterns
CREATE INDEX idx_invoices_business_status ON invoices(business_id, status);
CREATE INDEX idx_invoices_business_customer ON invoices(business_id, customer_id);
CREATE INDEX idx_invoices_business_due_date ON invoices(business_id, due_date);
CREATE INDEX idx_payments_business_invoice ON payments(business_id, invoice_id);
CREATE INDEX idx_inventory_movements_product ON inventory_movements(business_id, product_id);

-- Full-text search
CREATE INDEX idx_customers_search ON customers USING gin(
  (name || ' ' || coalesce(email, '') || ' ' || coalesce(phone, '')) gin_trgm_ops
);
```

---

## 13. Environment Configuration

### `.env.example`

```bash
# ─── Database ────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/orbitos"

# ─── Authentication ──────────────────────────────────
AUTH_SECRET="generate-a-strong-random-secret-here"
AUTH_URL="http://localhost:3000"

# Optional OAuth providers
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""

# ─── Storage ─────────────────────────────────────────
STORAGE_PROVIDER="local"                    # "local" | "s3"
STORAGE_LOCAL_PATH="./uploads"

# S3 (when STORAGE_PROVIDER=s3)
# S3_BUCKET=""
# S3_REGION=""
# S3_ACCESS_KEY=""
# S3_SECRET_KEY=""
# S3_ENDPOINT=""                            # For S3-compatible providers

# ─── Application ─────────────────────────────────────
NEXT_PUBLIC_APP_NAME="OrbitOS"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# ─── Feature Flags ───────────────────────────────────
FEATURE_AI_ASSISTANT="false"
FEATURE_INTEGRATIONS="false"

# ─── Development ─────────────────────────────────────
SEED_ON_MIGRATE="false"                     # Auto-seed after migration in dev
LOG_LEVEL="debug"                           # "debug" | "info" | "warn" | "error"
```

### Environment Loading

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_PATH: z.string().default('./uploads'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse(process.env);
```

Validated at startup. Missing or invalid env vars cause an immediate, clear error rather than a runtime crash.

---

## Appendix: Technology Choices — Rationale

| Choice | Why |
|---|---|
| **Next.js 15 App Router** | Server Components eliminate client-side data fetching boilerplate. Server actions provide type-safe mutations. Streaming SSR for fast initial load. |
| **React 19** | `useOptimistic`, `useFormStatus`, improved server component support. |
| **TypeScript (strict)** | Compile-time safety for business logic. Shared types between client and server. |
| **Tailwind CSS v4** | Utility-first styling with CSS custom properties for design tokens. No CSS-in-JS runtime cost. |
| **Drizzle ORM** | Type-safe SQL with zero abstraction overhead. Explicit queries (not magic). Migration support. |
| **PostgreSQL** | ACID transactions, foreign keys, check constraints, full-text search, JSON columns. Production-grade. |
| **Auth.js v5** | Battle-tested auth with session management, CSRF protection, multiple providers. |
| **Zod** | Schema validation that works identically on client and server. Type inference. |
| **TanStack Query** | Client-side cache management for interactive patterns. Not the primary data fetching layer. |
| **Lucide React** | Consistent, well-maintained icon set. Single stroke width. Tree-shakeable. |
| **Recharts** | React-native charting. Composable. Good for business dashboards without excessive customization. |
| **Vitest** | Fast, ESM-native, compatible with the TypeScript setup. |
| **Playwright** | Cross-browser E2E testing. Reliable for complex user flows. |
