# OrbitOS — Database Specification

**Engine:** PostgreSQL 15+
**ORM:** Drizzle ORM (TypeScript)
**Migrations:** Drizzle Kit (versioned, reversible)
**Monetary precision:** `DECIMAL(12, 2)` — all currency values
**IDs:** UUID v4 (generated application-side via `crypto.randomUUID()`)
**Timestamps:** `TIMESTAMPTZ` — always UTC
**Soft deletes:** `deleted_at TIMESTAMPTZ NULL` on entities with financial history dependencies

---

## Entity Relationship Diagram

```text
                                    ┌──────────────┐
                                    │    users      │
                                    │──────────────│
                                    │ id (PK)       │
                                    │ email         │
                                    │ name          │
                                    │ password_hash │
                                    └──────┬───────┘
                                           │
                                           │ many-to-many
                                           ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│  businesses   │◄───│ business_members  │───►│    users      │
│──────────────│    │──────────────────│    └──────────────┘
│ id (PK)       │    │ user_id (FK)      │
│ name          │    │ business_id (FK)  │
│ slug          │    │ role              │
│ currency      │    │ permissions[]     │
└──────┬───────┘    └──────────────────┘
       │
       │ business_id scopes everything below
       │
       ├─────────────────┬─────────────────┬─────────────────┐
       ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  customers    │  │  suppliers    │  │  products     │  │  categories   │
│──────────────│  │──────────────│  │──────────────│  │──────────────│
│ id (PK)       │  │ id (PK)       │  │ id (PK)       │  │ id (PK)       │
│ business_id   │  │ business_id   │  │ business_id   │  │ business_id   │
│ name          │  │ name          │  │ sku           │  │ name          │
│ outstanding   │  │ status        │  │ category_id   │  │ parent_id     │
│ total_spent   │  └──────┬───────┘  │ supplier_id   │  └──────────────┘
└──────┬───────┘         │          │ current_stock  │
       │                 │          └──────┬───────┘
       │                 │                 │
       │                 ▼                 ▼
       │          ┌──────────────┐  ┌───────────────────┐
       │          │purchase_orders│  │inventory_movements │
       │          │──────────────│  │───────────────────│
       │          │ supplier_id   │  │ product_id         │
       │          │ po_number     │  │ type               │
       │          │ status        │  │ quantity (+/-)      │
       │          └──────┬───────┘  │ reference_type/id   │
       │                 │          └───────────────────┘
       │                 ▼
       │          ┌────────────────────┐
       │          │purchase_order_items │
       │          │────────────────────│
       │          │ product_id          │
       │          │ quantity            │
       │          └────────────────────┘
       │
       ├─────────────────┐
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   orders      │  │  invoices     │
│──────────────│  │──────────────│
│ customer_id   │  │ customer_id   │
│ order_number  │  │ order_id      │
│ status        │  │ invoice_number│
└──────┬───────┘  │ status        │
       │          │ balance_due   │
       ▼          └──────┬───────┘
┌──────────────┐         │
│ order_items   │         ├─────────────────┐
└──────────────┘         ▼                 ▼
                  ┌──────────────┐  ┌──────────────┐
                  │invoice_items  │  │  payments     │
                  └──────────────┘  │──────────────│
                                    │ invoice_id    │
                                    │ customer_id   │
                                    │ amount        │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ledger_entries  │
                                    │──────────────│
                                    │ customer_id   │
                                    │ supplier_id   │
                                    │ debit/credit  │
                                    │ running_balance│
                                    └──────────────┘

Cross-cutting (not shown for clarity):
  audit_events ← logs all mutations
  notifications ← user-facing alerts
  attachments ← polymorphic file references
  number_sequences ← auto-increment per entity type per business
  expenses ← standalone financial records
```

---

## Table Definitions

### 1. `users`

Core authentication table. Not scoped by business.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | | Lowercase, trimmed |
| `name` | `VARCHAR(255)` | `NOT NULL` | | Display name |
| `password_hash` | `VARCHAR(255)` | `NULL` | | NULL if OAuth-only |
| `avatar_url` | `VARCHAR(500)` | `NULL` | | |
| `email_verified_at` | `TIMESTAMPTZ` | `NULL` | | NULL = unverified |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Indexes:**
- `users_email_idx` UNIQUE on `email`

---

### 2. `businesses`

Top-level tenant. Every business-scoped entity references this.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `name` | `VARCHAR(255)` | `NOT NULL` | | Business display name |
| `slug` | `VARCHAR(100)` | `NOT NULL, UNIQUE` | | URL-safe identifier |
| `currency` | `VARCHAR(3)` | `NOT NULL` | `'INR'` | ISO 4217 |
| `timezone` | `VARCHAR(50)` | `NOT NULL` | `'Asia/Kolkata'` | IANA timezone |
| `address` | `TEXT` | `NULL` | | |
| `phone` | `VARCHAR(20)` | `NULL` | | |
| `email` | `VARCHAR(255)` | `NULL` | | Business contact email |
| `logo_url` | `VARCHAR(500)` | `NULL` | | |
| `settings` | `JSONB` | `NOT NULL` | `'{}'` | Invoice prefix, tax config, etc. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Indexes:**
- `businesses_slug_idx` UNIQUE on `slug`

---

### 3. `business_members`

Join table: which users belong to which businesses, with roles.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `role` | `VARCHAR(20)` | `NOT NULL, CHECK (role IN ('owner','admin','manager','staff','viewer'))` | `'staff'` | |
| `permissions` | `TEXT[]` | `NOT NULL` | `'{}'` | Fine-grained overrides, e.g. `{'invoice.create','inventory.view'}` |
| `invited_by` | `UUID` | `NULL, FK → users.id ON DELETE SET NULL` | | |
| `joined_at` | `TIMESTAMPTZ` | `NULL` | | NULL = pending invitation |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(user_id, business_id)` — one membership per user per business

**Indexes:**
- `bm_user_id_idx` on `user_id`
- `bm_business_id_idx` on `business_id`
- `bm_user_business_idx` UNIQUE on `(user_id, business_id)`

---

### 4. `customers`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `name` | `VARCHAR(255)` | `NOT NULL` | | |
| `email` | `VARCHAR(255)` | `NULL` | | |
| `phone` | `VARCHAR(20)` | `NULL` | | |
| `company` | `VARCHAR(255)` | `NULL` | | |
| `gstin` | `VARCHAR(15)` | `NULL` | | Indian GST number |
| `address` | `JSONB` | `NULL` | | `{line1, line2, city, state, pincode, country}` |
| `notes` | `TEXT` | `NULL` | | |
| `status` | `VARCHAR(20)` | `NOT NULL, CHECK (status IN ('active','archived'))` | `'active'` | |
| `total_spent` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Cached: sum of paid invoices |
| `outstanding_balance` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Cached: sum of unpaid invoice balances |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `deleted_at` | `TIMESTAMPTZ` | `NULL` | | Soft delete |

**Indexes:**
- `customers_business_id_idx` on `business_id`
- `customers_business_status_idx` on `(business_id, status)` WHERE `deleted_at IS NULL`
- `customers_business_name_trgm_idx` GIN trigram on `(business_id, name)` — for search
- `customers_email_idx` on `(business_id, email)` WHERE `email IS NOT NULL`

---

### 5. `suppliers`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `name` | `VARCHAR(255)` | `NOT NULL` | | |
| `email` | `VARCHAR(255)` | `NULL` | | |
| `phone` | `VARCHAR(20)` | `NULL` | | |
| `company` | `VARCHAR(255)` | `NULL` | | |
| `gstin` | `VARCHAR(15)` | `NULL` | | |
| `address` | `JSONB` | `NULL` | | Same shape as `customers.address` |
| `notes` | `TEXT` | `NULL` | | |
| `status` | `VARCHAR(20)` | `NOT NULL, CHECK (status IN ('active','archived'))` | `'active'` | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `deleted_at` | `TIMESTAMPTZ` | `NULL` | | Soft delete |

**Indexes:**
- `suppliers_business_id_idx` on `business_id`
- `suppliers_business_status_idx` on `(business_id, status)` WHERE `deleted_at IS NULL`

---

### 6. `categories`

Hierarchical product categories. Self-referencing for subcategories.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `name` | `VARCHAR(100)` | `NOT NULL` | | |
| `slug` | `VARCHAR(100)` | `NOT NULL` | | |
| `parent_id` | `UUID` | `NULL, FK → categories.id ON DELETE SET NULL` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(business_id, slug)`

**Indexes:**
- `categories_business_id_idx` on `business_id`
- `categories_parent_id_idx` on `parent_id`

---

### 7. `products`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `name` | `VARCHAR(255)` | `NOT NULL` | | |
| `sku` | `VARCHAR(50)` | `NOT NULL` | | Unique within business |
| `description` | `TEXT` | `NULL` | | |
| `category_id` | `UUID` | `NULL, FK → categories.id ON DELETE SET NULL` | | |
| `unit` | `VARCHAR(20)` | `NOT NULL` | `'pcs'` | pcs / kg / ltr / box / set / pair |
| `selling_price` | `DECIMAL(12,2)` | `NOT NULL` | | |
| `cost_price` | `DECIMAL(12,2)` | `NULL` | | |
| `tax_rate` | `DECIMAL(5,2)` | `NOT NULL` | `0` | Percentage, e.g. 18.00 |
| `hsn_code` | `VARCHAR(10)` | `NULL` | | Indian HSN/SAC code |
| `status` | `VARCHAR(20)` | `NOT NULL, CHECK (status IN ('active','archived'))` | `'active'` | |
| `current_stock` | `INTEGER` | `NOT NULL` | `0` | Cached; source of truth is `inventory_movements` |
| `low_stock_threshold` | `INTEGER` | `NOT NULL` | `10` | Alert when stock ≤ this |
| `image_url` | `VARCHAR(500)` | `NULL` | | |
| `supplier_id` | `UUID` | `NULL, FK → suppliers.id ON DELETE SET NULL` | | Default/primary supplier |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `deleted_at` | `TIMESTAMPTZ` | `NULL` | | Soft delete |

**Constraints:**
- `UNIQUE(business_id, sku)` WHERE `deleted_at IS NULL`
- `CHECK (selling_price >= 0)`
- `CHECK (cost_price IS NULL OR cost_price >= 0)`
- `CHECK (tax_rate >= 0 AND tax_rate <= 100)`
- `CHECK (low_stock_threshold >= 0)`

**Indexes:**
- `products_business_id_idx` on `business_id`
- `products_business_sku_idx` UNIQUE on `(business_id, sku)` WHERE `deleted_at IS NULL`
- `products_business_status_idx` on `(business_id, status)` WHERE `deleted_at IS NULL`
- `products_category_id_idx` on `category_id`
- `products_supplier_id_idx` on `supplier_id`
- `products_business_name_trgm_idx` GIN trigram on `(business_id, name)` — for search
- `products_low_stock_idx` on `(business_id)` WHERE `current_stock <= low_stock_threshold AND status = 'active' AND deleted_at IS NULL`

---

### 8. `inventory_movements`

**Source of truth for stock levels.** Never update `products.current_stock` directly — always create a movement record.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `product_id` | `UUID` | `NOT NULL, FK → products.id ON DELETE RESTRICT` | | RESTRICT: can't delete a product with movement history |
| `type` | `VARCHAR(20)` | `NOT NULL, CHECK (type IN ('purchase','sale','return','adjustment','damage','opening'))` | | |
| `quantity` | `INTEGER` | `NOT NULL` | | Positive = stock in, negative = stock out |
| `unit_cost` | `DECIMAL(12,2)` | `NULL` | | Cost per unit at time of movement |
| `reference_type` | `VARCHAR(30)` | `NULL` | | `'order'`, `'purchase_order'`, `'adjustment'`, `'return'` |
| `reference_id` | `UUID` | `NULL` | | FK to the originating record (not enforced — polymorphic) |
| `notes` | `TEXT` | `NULL` | | Reason for adjustment, damage description, etc. |
| `created_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Design note:** Movements are append-only. To correct a mistake, create a compensating movement (e.g., adjustment +2 to undo an erroneous damage -2), never delete or update a movement row.

**Indexes:**
- `im_business_id_idx` on `business_id`
- `im_product_id_idx` on `product_id`
- `im_business_product_idx` on `(business_id, product_id)`
- `im_reference_idx` on `(reference_type, reference_id)` WHERE `reference_id IS NOT NULL`
- `im_created_at_idx` on `(business_id, created_at DESC)` — for timeline queries

---

### 9. `purchase_orders`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `supplier_id` | `UUID` | `NOT NULL, FK → suppliers.id ON DELETE RESTRICT` | | |
| `po_number` | `VARCHAR(20)` | `NOT NULL` | | Auto-generated via `number_sequences`, e.g. `PO-001` |
| `status` | `VARCHAR(20)` | `NOT NULL, CHECK (status IN ('draft','ordered','received','partial','cancelled'))` | `'draft'` | |
| `items_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Sum of item totals before tax |
| `tax_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `grand_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | items_total + tax_total |
| `notes` | `TEXT` | `NULL` | | |
| `expected_date` | `DATE` | `NULL` | | Expected delivery |
| `received_date` | `DATE` | `NULL` | | Actual delivery |
| `created_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(business_id, po_number)`
- `CHECK (items_total >= 0)`
- `CHECK (tax_total >= 0)`
- `CHECK (grand_total >= 0)`

**Indexes:**
- `po_business_id_idx` on `business_id`
- `po_supplier_id_idx` on `supplier_id`
- `po_business_status_idx` on `(business_id, status)`
- `po_business_po_number_idx` UNIQUE on `(business_id, po_number)`

---

### 10. `purchase_order_items`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `purchase_order_id` | `UUID` | `NOT NULL, FK → purchase_orders.id ON DELETE CASCADE` | | |
| `product_id` | `UUID` | `NOT NULL, FK → products.id ON DELETE RESTRICT` | | |
| `quantity` | `INTEGER` | `NOT NULL, CHECK (quantity > 0)` | | Ordered quantity |
| `unit_cost` | `DECIMAL(12,2)` | `NOT NULL, CHECK (unit_cost >= 0)` | | |
| `tax_rate` | `DECIMAL(5,2)` | `NOT NULL` | `0` | |
| `tax_amount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `total` | `DECIMAL(12,2)` | `NOT NULL` | | `(quantity × unit_cost) + tax_amount` |
| `received_quantity` | `INTEGER` | `NOT NULL` | `0` | How many units actually received |

**Constraints:**
- `CHECK (received_quantity >= 0)`
- `CHECK (received_quantity <= quantity)`

**Indexes:**
- `poi_purchase_order_id_idx` on `purchase_order_id`
- `poi_product_id_idx` on `product_id`

---

### 11. `orders`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `customer_id` | `UUID` | `NOT NULL, FK → customers.id ON DELETE RESTRICT` | | |
| `order_number` | `VARCHAR(20)` | `NOT NULL` | | Auto-generated, e.g. `ORD-001` |
| `status` | `VARCHAR(20)` | `NOT NULL, CHECK (status IN ('draft','confirmed','fulfilled','cancelled'))` | `'draft'` | |
| `items_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `discount_amount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `discount_type` | `VARCHAR(10)` | `NULL, CHECK (discount_type IN ('percentage','fixed'))` | | NULL if no discount |
| `tax_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `grand_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | items_total - discount_amount + tax_total |
| `notes` | `TEXT` | `NULL` | | |
| `created_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(business_id, order_number)`
- `CHECK (items_total >= 0)`
- `CHECK (discount_amount >= 0)`
- `CHECK (grand_total >= 0)`

**Indexes:**
- `orders_business_id_idx` on `business_id`
- `orders_customer_id_idx` on `customer_id`
- `orders_business_status_idx` on `(business_id, status)`
- `orders_business_order_number_idx` UNIQUE on `(business_id, order_number)`

---

### 12. `order_items`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `order_id` | `UUID` | `NOT NULL, FK → orders.id ON DELETE CASCADE` | | |
| `product_id` | `UUID` | `NOT NULL, FK → products.id ON DELETE RESTRICT` | | |
| `quantity` | `INTEGER` | `NOT NULL, CHECK (quantity > 0)` | | |
| `unit_price` | `DECIMAL(12,2)` | `NOT NULL, CHECK (unit_price >= 0)` | | Snapshot of selling price at order time |
| `discount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Per-item discount amount |
| `tax_rate` | `DECIMAL(5,2)` | `NOT NULL` | `0` | Snapshot of tax rate at order time |
| `tax_amount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `total` | `DECIMAL(12,2)` | `NOT NULL` | | `(quantity × unit_price - discount) + tax_amount` |

**Indexes:**
- `oi_order_id_idx` on `order_id`
- `oi_product_id_idx` on `product_id`

---

### 13. `invoices`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `customer_id` | `UUID` | `NOT NULL, FK → customers.id ON DELETE RESTRICT` | | |
| `order_id` | `UUID` | `NULL, FK → orders.id ON DELETE SET NULL` | | Nullable: invoices can exist without an order |
| `invoice_number` | `VARCHAR(20)` | `NOT NULL` | | Auto-generated, e.g. `INV-001` |
| `status` | `VARCHAR(20)` | `NOT NULL, CHECK (status IN ('draft','issued','partially_paid','paid','overdue','cancelled'))` | `'draft'` | |
| `items_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `discount_amount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `discount_type` | `VARCHAR(10)` | `NULL, CHECK (discount_type IN ('percentage','fixed'))` | | |
| `tax_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `grand_total` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `amount_paid` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Sum of linked payments |
| `balance_due` | `DECIMAL(12,2)` | `NOT NULL` | `0` | `grand_total - amount_paid` |
| `due_date` | `DATE` | `NULL` | | |
| `issued_date` | `DATE` | `NULL` | | Set when status moves to `issued` |
| `notes` | `TEXT` | `NULL` | | |
| `payment_terms` | `VARCHAR(100)` | `NULL` | | e.g. "Net 30", "Due on receipt" |
| `created_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(business_id, invoice_number)`
- `CHECK (items_total >= 0)`
- `CHECK (discount_amount >= 0)`
- `CHECK (grand_total >= 0)`
- `CHECK (amount_paid >= 0)`
- `CHECK (balance_due >= 0)`
- `CHECK (amount_paid <= grand_total)` — prevents overpayment at DB level

**Status transition rules** (enforced in application logic):
```text
draft → issued → partially_paid → paid
                ↘ overdue
draft → cancelled
issued → cancelled (only if amount_paid = 0)
```

Contradictory states (e.g., `paid` + `overdue`) are prevented by application logic: a paid invoice's `balance_due` is 0 and cannot be overdue.

**Indexes:**
- `invoices_business_id_idx` on `business_id`
- `invoices_customer_id_idx` on `customer_id`
- `invoices_order_id_idx` on `order_id`
- `invoices_business_status_idx` on `(business_id, status)`
- `invoices_business_invoice_number_idx` UNIQUE on `(business_id, invoice_number)`
- `invoices_overdue_idx` on `(business_id, due_date)` WHERE `status = 'issued' AND due_date IS NOT NULL` — for overdue detection job

---

### 14. `invoice_items`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `invoice_id` | `UUID` | `NOT NULL, FK → invoices.id ON DELETE CASCADE` | | |
| `product_id` | `UUID` | `NULL, FK → products.id ON DELETE SET NULL` | | Nullable: allows free-text line items |
| `description` | `VARCHAR(500)` | `NOT NULL` | | Line item description |
| `quantity` | `DECIMAL(12,2)` | `NOT NULL, CHECK (quantity > 0)` | | DECIMAL to support fractional units (kg, hours) |
| `unit_price` | `DECIMAL(12,2)` | `NOT NULL, CHECK (unit_price >= 0)` | | |
| `discount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `tax_rate` | `DECIMAL(5,2)` | `NOT NULL` | `0` | |
| `tax_amount` | `DECIMAL(12,2)` | `NOT NULL` | `0` | |
| `total` | `DECIMAL(12,2)` | `NOT NULL` | | `(quantity × unit_price - discount) + tax_amount` |

**Indexes:**
- `ii_invoice_id_idx` on `invoice_id`
- `ii_product_id_idx` on `product_id`

---

### 15. `payments`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `invoice_id` | `UUID` | `NOT NULL, FK → invoices.id ON DELETE RESTRICT` | | |
| `customer_id` | `UUID` | `NOT NULL, FK → customers.id ON DELETE RESTRICT` | | Denormalized for query convenience |
| `payment_number` | `VARCHAR(20)` | `NOT NULL` | | Auto-generated, e.g. `PAY-001` |
| `amount` | `DECIMAL(12,2)` | `NOT NULL, CHECK (amount > 0)` | | |
| `payment_method` | `VARCHAR(20)` | `NOT NULL, CHECK (payment_method IN ('cash','bank_transfer','upi','cheque','card','other'))` | | |
| `payment_date` | `DATE` | `NOT NULL` | | |
| `reference_number` | `VARCHAR(100)` | `NULL` | | Cheque number, UPI ref, etc. |
| `notes` | `TEXT` | `NULL` | | |
| `created_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(business_id, payment_number)`

**Indexes:**
- `payments_business_id_idx` on `business_id`
- `payments_invoice_id_idx` on `invoice_id`
- `payments_customer_id_idx` on `customer_id`
- `payments_business_payment_number_idx` UNIQUE on `(business_id, payment_number)`
- `payments_business_date_idx` on `(business_id, payment_date DESC)`

---

### 16. `expenses`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `amount` | `DECIMAL(12,2)` | `NOT NULL, CHECK (amount > 0)` | | |
| `category` | `VARCHAR(50)` | `NOT NULL` | | e.g. rent, utilities, salaries, travel, supplies |
| `description` | `TEXT` | `NULL` | | |
| `expense_date` | `DATE` | `NOT NULL` | | |
| `payment_method` | `VARCHAR(20)` | `NULL` | | Same enum as payments |
| `vendor` | `VARCHAR(255)` | `NULL` | | |
| `receipt_url` | `VARCHAR(500)` | `NULL` | | |
| `created_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `deleted_at` | `TIMESTAMPTZ` | `NULL` | | Soft delete |

**Indexes:**
- `expenses_business_id_idx` on `business_id`
- `expenses_business_date_idx` on `(business_id, expense_date DESC)` WHERE `deleted_at IS NULL`
- `expenses_business_category_idx` on `(business_id, category)` WHERE `deleted_at IS NULL`

---

### 17. `ledger_entries`

The Khata — a double-entry-style ledger for all financial movements.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `customer_id` | `UUID` | `NULL, FK → customers.id ON DELETE RESTRICT` | | One of customer/supplier must be set |
| `supplier_id` | `UUID` | `NULL, FK → suppliers.id ON DELETE RESTRICT` | | |
| `entry_type` | `VARCHAR(20)` | `NOT NULL, CHECK (entry_type IN ('invoice','payment','credit_note','debit_note','expense','purchase'))` | | |
| `reference_type` | `VARCHAR(30)` | `NOT NULL` | | Entity type of the source record |
| `reference_id` | `UUID` | `NOT NULL` | | ID of the source record |
| `description` | `VARCHAR(500)` | `NOT NULL` | | Human-readable, e.g. "Invoice INV-042 issued" |
| `debit` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Amount owed TO the business |
| `credit` | `DECIMAL(12,2)` | `NOT NULL` | `0` | Amount owed BY the business |
| `running_balance` | `DECIMAL(12,2)` | `NOT NULL` | | Computed at insert time per customer/supplier |
| `entry_date` | `DATE` | `NOT NULL` | | The business date of this entry |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `CHECK (debit >= 0)`
- `CHECK (credit >= 0)`
- `CHECK (NOT (debit > 0 AND credit > 0))` — each entry is either a debit or a credit, not both
- `CHECK (customer_id IS NOT NULL OR supplier_id IS NOT NULL)` — must reference someone

**Running balance calculation:**
When inserting a new ledger entry for customer X:
```sql
running_balance = (previous running_balance for customer X) + debit - credit
```
Application code computes this within the same transaction that creates the entry.

**Indexes:**
- `le_business_id_idx` on `business_id`
- `le_customer_id_idx` on `customer_id`
- `le_supplier_id_idx` on `supplier_id`
- `le_business_customer_date_idx` on `(business_id, customer_id, entry_date, created_at)` — for chronological ledger view
- `le_business_supplier_date_idx` on `(business_id, supplier_id, entry_date, created_at)`
- `le_reference_idx` on `(reference_type, reference_id)`

---

### 18. `audit_events`

Append-only log of all business-critical mutations.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `action` | `VARCHAR(30)` | `NOT NULL, CHECK (action IN ('created','updated','deleted','cancelled','status_changed','archived','restored'))` | | |
| `entity_type` | `VARCHAR(30)` | `NOT NULL` | | `customer`, `product`, `invoice`, `payment`, etc. |
| `entity_id` | `UUID` | `NOT NULL` | | |
| `changes` | `JSONB` | `NULL` | | `{"field_name": {"old": "...", "new": "..."}}` |
| `ip_address` | `INET` | `NULL` | | |
| `user_agent` | `TEXT` | `NULL` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Design note:** Audit events are never updated or deleted. This table may be partitioned by `created_at` if it grows large.

**Indexes:**
- `ae_business_id_idx` on `business_id`
- `ae_entity_idx` on `(business_id, entity_type, entity_id)`
- `ae_business_created_at_idx` on `(business_id, created_at DESC)`
- `ae_user_id_idx` on `user_id`

---

### 19. `notifications`

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | | Recipient |
| `type` | `VARCHAR(30)` | `NOT NULL, CHECK (type IN ('low_stock','invoice_overdue','payment_received','staff_invited','system'))` | | |
| `title` | `VARCHAR(255)` | `NOT NULL` | | |
| `message` | `TEXT` | `NOT NULL` | | |
| `data` | `JSONB` | `NULL` | | Structured payload for deep-linking, e.g. `{"invoice_id": "..."}` |
| `read_at` | `TIMESTAMPTZ` | `NULL` | | NULL = unread |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Indexes:**
- `notif_user_id_idx` on `user_id`
- `notif_user_unread_idx` on `(user_id, created_at DESC)` WHERE `read_at IS NULL`
- `notif_business_id_idx` on `business_id`

---

### 20. `attachments`

Polymorphic file storage references.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `entity_type` | `VARCHAR(30)` | `NOT NULL` | | `expense`, `product`, `invoice`, etc. |
| `entity_id` | `UUID` | `NOT NULL` | | |
| `filename` | `VARCHAR(255)` | `NOT NULL` | | Original filename |
| `mime_type` | `VARCHAR(100)` | `NOT NULL` | | |
| `size_bytes` | `INTEGER` | `NOT NULL, CHECK (size_bytes > 0)` | | |
| `storage_path` | `VARCHAR(500)` | `NOT NULL` | | Internal path; never exposed to clients directly |
| `uploaded_by` | `UUID` | `NOT NULL, FK → users.id ON DELETE RESTRICT` | | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Indexes:**
- `attach_business_id_idx` on `business_id`
- `attach_entity_idx` on `(entity_type, entity_id)`

---

### 21. `number_sequences`

Auto-incrementing number generator per entity type per business.

| Column | Type | Constraints | Default | Notes |
|--------|------|-------------|---------|-------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` | |
| `business_id` | `UUID` | `NOT NULL, FK → businesses.id ON DELETE CASCADE` | | |
| `entity_type` | `VARCHAR(30)` | `NOT NULL` | | `invoice`, `order`, `purchase_order`, `payment` |
| `prefix` | `VARCHAR(10)` | `NOT NULL` | | `INV`, `ORD`, `PO`, `PAY` |
| `next_value` | `INTEGER` | `NOT NULL` | `1` | |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | |

**Constraints:**
- `UNIQUE(business_id, entity_type)`
- `CHECK (next_value > 0)`

**Usage pattern:**
```sql
-- Atomic next-number retrieval (no race conditions)
UPDATE number_sequences
SET next_value = next_value + 1, updated_at = NOW()
WHERE business_id = $1 AND entity_type = $2
RETURNING prefix || '-' || LPAD((next_value - 1)::TEXT, 3, '0');
```

**Indexes:**
- `ns_business_entity_idx` UNIQUE on `(business_id, entity_type)`

---

## Required PostgreSQL Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUID generation (fallback if using gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Trigram indexes for fuzzy search
CREATE EXTENSION IF NOT EXISTS "btree_gin";    -- GIN index support for composite types
```

---

## Computed / Cached Fields Strategy

These fields are cached in their parent table for query performance but are **derived from other tables**. They must be updated transactionally whenever the source data changes.

| Cached Field | Source of Truth | Update Trigger |
|---|---|---|
| `products.current_stock` | `SUM(inventory_movements.quantity) WHERE product_id = X` | After any `inventory_movements` INSERT |
| `invoices.amount_paid` | `SUM(payments.amount) WHERE invoice_id = X` | After any `payments` INSERT |
| `invoices.balance_due` | `grand_total - amount_paid` | After `amount_paid` update |
| `customers.total_spent` | `SUM(payments.amount) WHERE customer_id = X` | After any `payments` INSERT |
| `customers.outstanding_balance` | `SUM(invoices.balance_due) WHERE customer_id = X AND status NOT IN ('draft','cancelled','paid')` | After invoice status/balance changes |

**Implementation:** Application-level updates within the same database transaction. Not PostgreSQL triggers — keeping logic in application code makes it testable, debuggable, and ORM-compatible.

---

## Transactional Boundaries

These operations **must** execute within a single database transaction:

### Record Payment
```text
BEGIN
  1. INSERT payment
  2. UPDATE invoice.amount_paid += payment.amount
  3. UPDATE invoice.balance_due = grand_total - amount_paid
  4. UPDATE invoice.status (→ partially_paid / paid)
  5. UPDATE customer.total_spent += payment.amount
  6. UPDATE customer.outstanding_balance -= payment.amount
  7. INSERT ledger_entry (credit)
  8. INSERT audit_event
COMMIT
```

### Confirm Order (with inventory)
```text
BEGIN
  1. UPDATE order.status = 'confirmed'
  2. For each order_item:
     a. INSERT inventory_movement (type='sale', quantity=-N)
     b. UPDATE product.current_stock -= N
  3. INSERT audit_event
COMMIT
```

### Receive Purchase Order
```text
BEGIN
  1. UPDATE purchase_order.status = 'received'
  2. For each purchase_order_item:
     a. UPDATE purchase_order_item.received_quantity
     b. INSERT inventory_movement (type='purchase', quantity=+N)
     c. UPDATE product.current_stock += N
  3. INSERT ledger_entry (debit)
  4. INSERT audit_event
COMMIT
```

---

## Multi-Tenant Query Pattern

**Every** query for business-scoped data must include the `business_id` filter. This is enforced at the data-access layer, not left to individual page implementations.

```typescript
// In the data access layer — all queries go through this
function scopedQuery(businessId: string) {
  return {
    customers: db.select().from(customers).where(eq(customers.businessId, businessId)),
    products: db.select().from(products).where(eq(products.businessId, businessId)),
    // ... etc.
  }
}
```

An additional middleware check ensures the authenticated user has an active `business_members` row for the requested `business_id`.

---

## Migration Strategy

Using **Drizzle Kit** for migrations.

```text
database/
├── schema/
│   ├── users.ts
│   ├── businesses.ts
│   ├── customers.ts
│   ├── products.ts
│   ├── inventory.ts
│   ├── orders.ts
│   ├── invoices.ts
│   ├── payments.ts
│   ├── expenses.ts
│   ├── ledger.ts
│   ├── audit.ts
│   ├── notifications.ts
│   ├── attachments.ts
│   └── sequences.ts
├── migrations/
│   └── NNNN_description.sql
├── seed.ts
└── index.ts          ← re-exports all schema + db client
```

**Commands:**
```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Seed development database
npx tsx database/seed.ts
```

Migrations are SQL files, version-controlled, and applied in order. Destructive migrations (column drops, table removals) require manual review before execution.

---

## Seed Data Requirements

Development mode seeds with realistic synthetic data (see PRD §53):

| Entity | Count | Notes |
|--------|------:|-------|
| Users | 10 | Mixed roles |
| Businesses | 3 | Different sizes |
| Customers | 150 | Realistic Indian names, companies |
| Products | 300 | Multiple categories |
| Suppliers | 40 | |
| Categories | 25 | 3 levels deep |
| Orders | 1,000 | Mixed statuses |
| Invoices | 1,000 | Mixed statuses including overdue |
| Payments | 1,500 | |
| Expenses | 2,000 | 12 months of history |
| Purchase Orders | 200 | |
| Inventory Movements | 10,000 | Covering all types |
| Ledger Entries | 3,000+ | Auto-generated from invoices/payments |
| Audit Events | 5,000+ | Auto-generated from all mutations |

Seed data must be internally consistent — invoice amounts must match their items, ledger balances must add up, inventory counts must match movement sums.
