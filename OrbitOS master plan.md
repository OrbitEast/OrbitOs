# OrbitOS

## Master Product Requirements Document + Autonomous Implementation Specification

**Repository:** `OrbitEast/OrbitOs`

**Product:** OrbitOS
**Company/Brand:** Orbit East
**Purpose:** Complete the repository into a production-ready business operating system.

---

# 1. ROLE

You are the primary software engineer responsible for completing the OrbitOS repository.

You have access to the GitHub repository:

`OrbitEast/OrbitOs`

The repository is already initialized with a Next.js/React/TypeScript foundation and related backend dependencies.

Your job is to:

1. Inspect the ENTIRE existing repository first.
2. Understand the existing architecture and code.
3. Preserve useful existing code.
4. Fix architectural problems where necessary.
5. Implement the remaining product.
6. Connect the application to Supabase.
7. Implement persistent cloud database/storage functionality.
8. Prepare deployment through Firebase hosting/app hosting where appropriate.
9. Test the application.
10. Fix build/type/lint/runtime errors.
11. Continue until the project satisfies the Definition of Done in this document.

Do NOT simply generate a mock UI.

The final result must be a functioning application backed by a real database.

---

# 2. IMPORTANT EXECUTION RULE

## DO NOT START CODING IMMEDIATELY.

First perform a complete repository audit.

Inspect:

* `package.json`
* `app/`
* `components/`
* `lib/`
* `db/`
* configuration files
* authentication code
* database code
* environment configuration
* Tailwind configuration
* TypeScript configuration
* existing migrations
* existing API/server code
* existing UI components
* README
* tests
* Git history where useful

Determine:

```text
WHAT EXISTS
WHAT WORKS
WHAT IS PARTIALLY IMPLEMENTED
WHAT IS MISSING
WHAT SHOULD BE REUSED
WHAT SHOULD BE REFACTORED
WHAT SHOULD BE REMOVED
```

Do not assume the repository is empty.

Do not replace working architecture merely because you prefer another architecture.

---

# 3. CURRENT TECHNOLOGY DIRECTION

The project currently uses a foundation based around:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Drizzle ORM
* PostgreSQL
* NextAuth
* Zod

Use the existing stack where practical.

## Cloud infrastructure

The intended infrastructure is:

### GitHub

Source code and version control.

### Supabase

Use Supabase as the primary cloud backend infrastructure:

* PostgreSQL database
* Storage
* database hosting
* file storage
* database backups/features provided by the selected plan

### Firebase

Use Firebase primarily for deployment/hosting if appropriate for the final Next.js architecture.

Before implementing Firebase deployment, verify which Firebase hosting product is appropriate for the current Next.js version.

Do NOT force an incompatible static-hosting architecture onto a server-side Next.js application.

If Firebase App Hosting is the appropriate deployment mechanism, use that.

If another Firebase deployment configuration is technically required, document it.

---

# 4. INFRASTRUCTURE RULE

The application must have a clean separation between:

```text
Application
    ↓
Service layer
    ↓
Database / Storage
```

Do not hard-code Supabase calls throughout UI components.

Create service abstractions where appropriate.

Example:

```text
lib/
  db/
  storage/
  services/
  auth/
  permissions/
  validations/
```

---

# 5. DATABASE DECISION

Supabase PostgreSQL should be the production database.

If the existing Drizzle architecture is usable:

```text
Next.js
   ↓
Drizzle
   ↓
Supabase PostgreSQL
```

Continue using it.

Do NOT introduce a second ORM unnecessarily.

Do NOT maintain two competing database systems.

Drizzle should remain the schema/migration layer if it is already integrated correctly.

---

# 6. STORAGE

Supabase Storage should be used for user/business files.

Potential storage categories:

```text
business-assets/
    logos/

products/
    images/

expenses/
    receipts/

invoices/
    attachments/
```

Storage must be isolated by organization/business.

A user from Organization A must not be able to access Organization B's files.

Never expose unrestricted storage buckets containing private business data.

---

# 7. ENVIRONMENT VARIABLES

Create/update:

```text
.env.example
```

Never commit real credentials.

Expected configuration should be documented.

Possible variables include:

```env
DATABASE_URL=

AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

Only include variables actually required by the final architecture.

Never expose:

```text
DATABASE_URL
AUTH_SECRET
SUPABASE_SERVICE_ROLE_KEY
```

to the browser.

---

# 8. PRODUCT VISION

OrbitOS is an operating system for businesses.

It should combine:

```text
Customers
Suppliers
Products
Inventory
Sales
Purchases
Invoices
Payments
Expenses
Khata
Staff
Reports
Notifications
Search
Settings
AI
```

into one connected system.

The application should not feel like separate CRUD pages.

Everything should share consistent data relationships.

---

# 9. CORE BUSINESS FLOW

The system must connect business events.

Example:

```text
Customer
    ↓
Sale
    ↓
Invoice
    ↓
Payment
    ↓
Outstanding
    ↓
Khata
    ↓
Reports
```

Inventory:

```text
Supplier
    ↓
Purchase
    ↓
Stock increases
    ↓
Sale
    ↓
Stock decreases
```

Financial:

```text
Sales
   +
Other income
   -
Expenses
   -
Cost of goods
   =
Profit
```

Every calculation must come from real transaction data.

---

# 10. MULTI-TENANCY

This is mandatory.

OrbitOS must support multiple businesses.

Architecture:

```text
User
  ↓
Organization
  ↓
Organization Membership
  ↓
Business Data
```

A user may belong to one or more organizations.

Every organization-owned record must be associated with an organization.

Example:

```text
customers.organization_id
products.organization_id
invoices.organization_id
expenses.organization_id
```

etc.

---

# 11. TENANT ISOLATION

This is a critical security requirement.

A user must NEVER be able to access another organization's:

* customers
* suppliers
* invoices
* products
* inventory
* expenses
* payments
* staff
* reports
* files
* settings

Do not rely only on frontend filtering.

Authorization must be enforced server-side.

If using Supabase directly from client-side code, implement appropriate Row Level Security.

If using server-side Drizzle queries, enforce organization membership in the service/server layer.

Prefer defense in depth where practical.

---

# 12. AUTHENTICATION

Implement:

## Registration

* email
* password
* account creation
* verification

## Login

* email/password
* Google OAuth if configured

## Account management

* logout
* forgot password
* reset password
* change password
* email verification
* session handling

Protect all authenticated application routes.

---

# 13. USER STATES

Support:

```text
UNVERIFIED
ACTIVE
SUSPENDED
DELETED
```

Suspended users cannot access business data.

---

# 14. ONBOARDING

After registration:

```text
Welcome
   ↓
Create Business
   ↓
Business Details
   ↓
Business Configuration
   ↓
Dashboard
```

Business details:

```text
Business name
Business type
Phone
Email
Address
City
State
Country
GSTIN
Currency
Timezone
```

GSTIN should be optional.

---

# 15. ORGANIZATION MEMBERS

A business owner can invite/manage staff.

Structure:

```text
Organization
    ↓
Members
    ↓
Roles
    ↓
Permissions
```

---

# 16. ORBITOS APPLICATION SHELL

Build a professional application shell.

Desktop:

```text
┌─────────────────────────────────────────────────────┐
│ OrbitOS       Search / Command        🔔     User   │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│ Dashboard     │                                     │
│ Customers     │                                     │
│ Suppliers     │                                     │
│ Products      │              CONTENT                │
│ Inventory     │                                     │
│ Sales         │                                     │
│ Purchases     │                                     │
│ Invoices      │                                     │
│ Payments      │                                     │
│ Expenses      │                                     │
│ Khata         │                                     │
│ Reports       │                                     │
│ Staff         │                                     │
│               │                                     │
│ Settings      │                                     │
└───────────────┴─────────────────────────────────────┘
```

Requirements:

* responsive sidebar
* collapsible sidebar
* active route
* global search
* command palette
* notifications
* profile menu
* responsive mobile navigation
* dark mode

---

# 17. DESIGN LANGUAGE

OrbitOS should feel:

```text
Modern
Premium
Minimal
Professional
Fast
Clean
Consistent
```

Visual inspiration can take cues from modern operating systems and premium SaaS products, but do not copy another company's interface.

Avoid:

```text
clutter
excessive gradients
random colors
giant decorative cards
cheap ERP aesthetics
inconsistent spacing
inconsistent typography
```

Create a reusable design system.

---

# 18. DESIGN SYSTEM

Build reusable components:

```text
Button
Input
Select
Textarea
Checkbox
Switch
Dialog
Drawer
Dropdown
Tabs
Card
Badge
Toast
Tooltip
Table
Pagination
DatePicker
Search
CommandPalette
Skeleton
EmptyState
ErrorState
ConfirmDialog
```

Business components:

```text
CustomerCard
SupplierCard
ProductCard
ProductPicker
InvoiceTable
PaymentForm
LedgerTable
StockMovementTable
```

Do not duplicate UI logic.

---

# 19. DASHBOARD

Dashboard must use real database data.

Display:

```text
Today's Sales
Today's Purchases
Outstanding Receivables
Outstanding Payables
Expenses
Net Profit
Inventory Value
```

Charts:

```text
Sales
Purchases
Expenses
Profit
```

Date ranges:

```text
Today
7 days
30 days
3 months
1 year
Custom
```

Recent activity:

```text
Invoice created
Payment received
Product purchased
Expense recorded
Customer added
Staff added
```

Alerts:

```text
Low stock
Overdue invoices
Large outstanding balances
System notifications
```

Never use fake numbers after real data is available.

---

# 20. CUSTOMERS

Create complete customer management.

Fields:

```text
id
organization_id
name
phone
email
address
GSTIN
credit_limit
opening_balance
notes
created_at
updated_at
```

Customer profile:

```text
Overview
Invoices
Payments
Khata
Transactions
Outstanding
Activity
```

Actions:

```text
Create
Edit
Delete/archive
Search
Filter
View
```

---

# 21. SUPPLIERS

Implement the same quality level as customers.

Fields:

```text
name
phone
email
address
GSTIN
opening_balance
notes
```

Supplier profile:

```text
Overview
Purchases
Payments
Outstanding
Transactions
Activity
```

---

# 22. PRODUCTS

Fields:

```text
name
SKU
barcode
category
unit
purchase_price
selling_price
tax
opening_stock
minimum_stock
supplier
description
image
status
```

Support:

* product search
* category filtering
* SKU
* barcode
* product image
* active/inactive
* low-stock threshold

---

# 23. INVENTORY

Inventory must be transaction based.

Do NOT silently mutate stock.

Use:

```text
stock_transactions
```

Transaction types:

```text
OPENING_STOCK
PURCHASE
SALE
RETURN
ADJUSTMENT
DAMAGE
TRANSFER
```

Each transaction should record:

```text
organization
product
quantity
type
reference
date
user
notes
```

Current stock should be derived safely from transactions or maintained with a consistent transactional strategy.

Avoid race conditions.

---

# 24. SALES

Sales flow:

```text
New Sale
   ↓
Customer
   ↓
Products
   ↓
Quantity
   ↓
Discount
   ↓
Tax
   ↓
Total
   ↓
Payment
   ↓
Invoice
```

Statuses:

```text
DRAFT
CONFIRMED
PAID
PARTIAL
UNPAID
CANCELLED
```

---

# 25. INVOICES

Invoice must contain:

```text
Invoice number
Customer
Items
Subtotal
Discount
Tax
Total
Paid amount
Balance
Due date
Status
Notes
```

Actions:

```text
View
Edit
Duplicate
Print
Download PDF
Record Payment
Cancel
```

Invoice numbers must be unique per organization according to the configured numbering strategy.

---

# 26. INVOICE PDF

Create professional invoice PDFs.

Include:

```text
Business logo
Business details
Customer details
Invoice number
Invoice date
Due date
Items
Quantity
Price
Discount
Tax
Subtotal
Total
Payment status
Notes
```

PDF must use actual invoice data.

Do not create fake/static PDFs.

---

# 27. PAYMENTS

Payment is a separate transaction.

Fields:

```text
amount
date
method
reference
customer/supplier
invoice
notes
```

Methods:

```text
Cash
UPI
Bank
Card
Cheque
Other
```

Recording a payment must correctly update:

```text
invoice balance
customer/supplier balance
ledger
reports
```

---

# 28. PURCHASES

Purchase flow:

```text
Supplier
 ↓
Purchase
 ↓
Items
 ↓
Tax
 ↓
Total
 ↓
Payment
 ↓
Inventory increase
```

Statuses:

```text
DRAFT
RECEIVED
PARTIAL
PAID
CANCELLED
```

---

# 29. EXPENSES

Fields:

```text
title
category
amount
date
payment_method
vendor
notes
receipt
```

Categories:

```text
Rent
Salary
Electricity
Internet
Transport
Marketing
Maintenance
Office
Tax
Other
```

Expense receipt files should use Supabase Storage.

---

# 30. KHATA

Khata must provide a proper ledger.

Example:

```text
Date       Description       Debit      Credit     Balance
-----------------------------------------------------------
01 Sep     Sale              10,000                10,000
05 Sep     Payment                       4,000      6,000
```

Support:

```text
Customer ledger
Supplier ledger
Debit
Credit
Payment
Opening balance
Outstanding
Statement
Print
PDF
Export
```

---

# 31. LEDGER INTEGRITY

Avoid maintaining multiple conflicting balance systems.

Create a consistent transaction model.

If balances are cached for performance, make sure they are updated transactionally and can be reconciled from ledger entries.

---

# 32. STAFF

Staff management:

```text
Employee
Role
Permissions
Status
```

Roles:

```text
OWNER
ADMIN
MANAGER
ACCOUNTANT
SALES
INVENTORY
STAFF
VIEWER
```

---

# 33. PERMISSIONS

Permissions must be granular.

Examples:

```text
customers.view
customers.create
customers.edit
customers.delete

products.view
products.create
products.edit
products.delete

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
expenses.delete

reports.view

staff.view
staff.manage

settings.manage
```

Frontend hiding is not authorization.

Server must enforce permissions.

---

# 34. AUDIT LOG

Create an immutable or tightly controlled audit trail.

Record important events:

```text
User created customer
User edited product
User created invoice
User cancelled invoice
User recorded payment
User changed permissions
User changed business settings
```

Fields:

```text
organization_id
user_id
action
entity
entity_id
metadata
created_at
```

---

# 35. NOTIFICATIONS

Notification center:

```text
Low stock
Invoice overdue
Payment received
Expense recorded
Staff changes
System notifications
```

Store notifications persistently.

Support:

```text
read
unread
mark as read
mark all as read
```

---

# 36. GLOBAL SEARCH

Implement:

```text
Ctrl + K
```

Search:

```text
Customers
Suppliers
Products
Invoices
Payments
Expenses
Staff
```

Results should be grouped.

Example:

```text
Search: Rahul

CUSTOMERS
Rahul Sharma

INVOICES
INV-1042

PAYMENTS
₹5,000 payment
```

Search only within the user's authorized organization.

---

# 37. COMMAND PALETTE

Commands should include:

```text
New Customer
New Product
New Invoice
New Expense
New Purchase
Record Payment
Open Reports
Open Settings
Search
```

Keyboard-friendly.

---

# 38. REPORTS

Implement real reports.

## Sales

```text
Daily sales
Monthly sales
Sales by product
Sales by customer
```

## Purchases

```text
Purchases by supplier
Purchases by product
```

## Inventory

```text
Current stock
Low stock
Stock movement
Inventory valuation
```

## Finance

```text
Revenue
Expenses
Gross profit
Net profit
Receivables
Payables
```

## Khata

```text
Customer outstanding
Supplier outstanding
Ledger
```

Support:

```text
Date filters
Export
Print
PDF
CSV
```

---

# 39. FINANCIAL CALCULATION ENGINE

Do not implement financial calculations independently inside each UI page.

Create centralized functions/services:

```text
calculateInvoiceSubtotal()
calculateDiscount()
calculateTax()
calculateInvoiceTotal()
calculateOutstanding()
calculateCustomerBalance()
calculateSupplierBalance()
calculateStockValue()
calculateProfit()
```

All important calculations must have tests.

---

# 40. MONEY HANDLING

Never rely on JavaScript floating-point numbers as the financial source of truth.

Use PostgreSQL numeric/decimal values appropriately.

Normalize monetary calculations.

Avoid:

```text
0.1 + 0.2
```

style floating-point errors.

---

# 41. DATABASE TABLES

Implement an appropriate normalized schema around:

```text
users
accounts
sessions

organizations
organization_members

roles
permissions
role_permissions

customers
suppliers

product_categories
products

stock_transactions

sales
sale_items

invoices
invoice_items

purchases
purchase_items

payments

expenses
expense_categories

ledger_entries

notifications

audit_logs
```

Additional tables may be introduced when genuinely required.

Do not create redundant tables without purpose.

---

# 42. DATABASE INDEXES

Add appropriate indexes for common queries.

At minimum consider:

```text
organization_id
customer_id
supplier_id
product_id
invoice_id
created_at
status
```

Do not blindly index every column.

---

# 43. DATABASE FOREIGN KEYS

Use proper relationships.

Examples:

```text
invoice → organization
invoice → customer
invoice_item → invoice
invoice_item → product
payment → invoice
payment → customer
purchase → supplier
purchase_item → purchase
stock_transaction → product
```

Define deletion behavior intentionally.

Never accidentally cascade-delete critical business history.

---

# 44. SOFT DELETE / ARCHIVING

For important business entities, prefer archiving/deactivation over destructive deletion where appropriate.

Examples:

```text
Customer → archived
Product → inactive
Staff → inactive
```

Invoices and financial transactions should generally not simply disappear.

Cancellation should preserve historical records.

---

# 45. VALIDATION

Use Zod for external input.

Create schemas such as:

```text
CreateCustomerSchema
UpdateCustomerSchema
CreateSupplierSchema
CreateProductSchema
CreateInvoiceSchema
CreatePaymentSchema
CreatePurchaseSchema
CreateExpenseSchema
```

Validate on the server.

Client validation is only additional UX.

---

# 46. SERVER ARCHITECTURE

Preferred:

```text
UI
 ↓
Server Action / Route Handler
 ↓
Zod Validation
 ↓
Authentication
 ↓
Organization Membership
 ↓
Permission Check
 ↓
Service Layer
 ↓
Database
```

Do not put business logic directly into presentation components.

---

# 47. TRANSACTIONAL OPERATIONS

Important operations should be atomic.

For example:

## Create invoice

```text
BEGIN
 ↓
create invoice
 ↓
create invoice items
 ↓
update/create ledger entry
 ↓
create stock transactions
 ↓
record payment if applicable
 ↓
COMMIT
```

If one required step fails:

```text
ROLLBACK
```

Do not leave half-created invoices.

Same principle applies to:

* purchases
* payments
* stock adjustments

---

# 48. ERROR HANDLING

Every important UI operation requires:

```text
Loading
Success
Error
Empty
```

User-facing errors should be clear.

Do not expose:

```text
SQL
stack traces
internal secrets
database connection strings
```

---

# 49. MOBILE

The application must work on:

```text
Desktop
Laptop
Tablet
Mobile
```

On mobile:

* sidebar becomes drawer/bottom navigation
* tables become responsive
* forms remain usable
* buttons remain accessible
* no horizontal page overflow

---

# 50. DARK MODE

Implement a consistent dark mode.

Do not create dark mode by simply inverting colors.

All components must use the shared theme.

---

# 51. ACCESSIBILITY

Support:

* keyboard navigation
* visible focus
* labels
* semantic HTML
* accessible dialogs
* accessible buttons
* screen-reader-friendly controls
* sensible contrast

---

# 52. FILE UPLOADS

For:

```text
Business logo
Product images
Expense receipts
Invoice attachments
```

Use Supabase Storage.

Requirements:

* validate file type
* validate file size
* generate safe paths
* enforce organization ownership
* avoid exposing private files publicly unless intentionally required

---

# 53. DATA EXPORT

Implement:

```text
Customers CSV
Products CSV
Invoices CSV
Expenses CSV
Transactions CSV
```

where useful.

Export must respect organization permissions.

---

# 54. DATA IMPORT

Support CSV import for at least:

```text
Customers
Products
Suppliers
```

Import process:

```text
Upload
 ↓
Parse
 ↓
Validate every row
 ↓
Show preview
 ↓
User confirms
 ↓
Transaction/import
 ↓
Report success/errors
```

Do not partially import invalid data without clearly reporting it.

---

# 55. SECURITY

Mandatory:

```text
Authentication
Authorization
Tenant isolation
Input validation
Secure sessions
Secure cookies
Rate limiting where appropriate
Safe file uploads
Environment secret protection
Audit logging
```

Never trust client-provided:

```text
organization_id
user_id
role
permission
price
balance
```

without server-side verification.

---

# 56. PERFORMANCE

Do not load the entire business database on every dashboard visit.

Use:

```text
pagination
filtering
server-side queries
appropriate indexes
caching where appropriate
```

Use Server Components where client interactivity isn't required.

Avoid enormous client components.

---

# 57. AI LAYER

AI is a later layer.

The core application must work without AI.

Once the business system is stable, add:

```text
AI Business Assistant
```

Examples:

```text
"How much did I sell this month?"

"Who owes me the most?"

"Which products are low on stock?"

"What were my biggest expenses?"

"Show invoices overdue by more than 30 days."
```

AI should query authorized application services/tools.

Do NOT allow the model to execute arbitrary SQL.

Architecture:

```text
User
 ↓
AI
 ↓
Intent
 ↓
Authorized Tool
 ↓
Business Service
 ↓
Database
 ↓
Result
 ↓
AI
```

---

# 58. AI TOOLS

Potential read-only tools:

```text
search_customers
search_products
get_sales
get_purchases
get_inventory
get_expenses
get_outstanding
get_invoice
get_profit
get_customer_statement
```

Each tool must enforce:

```text
authenticated user
organization membership
permissions
```

---

# 59. AI MUTATIONS

If AI eventually performs mutations:

```text
"Create an invoice for Rahul"
```

require explicit confirmation before destructive or financially significant actions.

For example:

```text
You're about to create:

Customer: Rahul
Items: 3
Total: ₹4,500

[Confirm]
[Cancel]
```

Do not let an LLM silently execute financial mutations.

---

# 60. NOTIFICATIONS / FUTURE AUTOMATION

Architecture should allow future:

```text
payment reminders
low-stock alerts
invoice reminders
scheduled reports
```

but do not build unnecessary complexity before the core product works.

---

# 61. TESTING

Implement tests for critical calculations and workflows.

Unit tests:

```text
invoice totals
tax
discount
outstanding
ledger
stock
profit
```

Integration tests:

```text
create customer
create product
create invoice
record payment
create purchase
create expense
```

E2E flow:

```text
Register
 ↓
Create business
 ↓
Create customer
 ↓
Create product
 ↓
Create invoice
 ↓
Record payment
 ↓
View dashboard
```

---

# 62. SEED DATA

Create development seed data.

Example:

```text
1 organization
5 customers
3 suppliers
20 products
10 invoices
5 purchases
10 payments
10 expenses
```

Do not use seed data in production.

---

# 63. ROUTES

Create appropriate authenticated routes such as:

```text
/dashboard

/customers
/customers/[id]

/suppliers
/suppliers/[id]

/products
/products/[id]

/inventory

/sales
/sales/[id]

/purchases
/purchases/[id]

/invoices
/invoices/[id]

/payments

/expenses

/khata
/khata/[id]

/reports

/staff

/notifications

/settings
```

Route names can be adjusted if existing repository architecture suggests a better convention.

---

# 64. AUTH ROUTES

Public:

```text
/login
/register
/forgot-password
/reset-password
```

Authenticated routes must be protected.

---

# 65. UI STATE

Every data page should correctly handle:

```text
loading
empty
success
error
```

Example:

```text
No customers yet.

Add your first customer to start managing
sales and outstanding balances.

[ Add Customer ]
```

---

# 66. NO FAKE FUNCTIONALITY

This rule is extremely important.

Do NOT create fake:

```text
analytics
reports
notifications
payments
invoices
search
authentication
AI responses
inventory
```

If a feature is not implemented, either:

1. implement it properly, or
2. clearly mark it as unavailable/coming soon.

Never make a static UI pretend to be a working system.

---

# 67. NO UNNECESSARY REWRITES

Do not rewrite:

```text
Next.js
React
TypeScript
Drizzle
```

just because another stack is preferred.

Only change foundational technology if the current architecture makes the required product technically impractical.

If a major architectural change is necessary:

1. explain why
2. document it
3. migrate safely
4. remove obsolete code

---

# 68. CODE ORGANIZATION

Use:

```text
app/
components/
lib/
db/
types/
tests/
public/
```

Keep:

```text
UI
Business logic
Database logic
Validation
Authentication
Authorization
```

separated.

---

# 69. TYPESCRIPT

Use strict TypeScript.

Avoid:

```text
any
```

unless absolutely necessary.

Do not silence errors with:

```text
@ts-ignore
```

without a documented reason.

Fix the underlying type problem.

---

# 70. QUALITY GATE

After every significant implementation phase:

```text
npm run lint
npm run build
```

and run the appropriate type/test commands.

If scripts don't exist, create them.

Fix errors rather than ignoring them.

---

# 71. PACKAGE MANAGEMENT

Before adding a dependency:

Ask:

```text
Do we actually need this?
Does an existing dependency already solve it?
Will this increase complexity?
Is it maintained?
```

Do not install huge UI libraries unnecessarily.

---

# 72. DOCUMENTATION

Update README with:

```text
Project overview
Features
Architecture
Environment variables
Local development
Supabase setup
Database setup
Migrations
Storage setup
Authentication setup
Deployment
Testing
```

Create useful developer documentation where needed.

---

# 73. SUPABASE SETUP DOCUMENTATION

Document:

```text
Create Supabase project
Get database connection string
Configure environment variables
Run migrations
Configure Storage
Configure policies/RLS if used
Seed development data
```

Do not require the developer to guess configuration steps.

---

# 74. FIREBASE DEPLOYMENT

Prepare deployment configuration for Firebase.

First determine whether the current Next.js application should use:

```text
Firebase App Hosting
```

or another supported Firebase deployment method.

Because OrbitOS uses server-side functionality, database access, authentication and dynamic routes, do NOT assume ordinary static Firebase Hosting is sufficient.

Deployment must preserve:

```text
server-side rendering
API/server actions
authentication
database connectivity
```

Document the exact deployment process.

---

# 75. GITHUB WORKFLOW

You are connected to the GitHub repository.

Use GitHub properly.

Before editing:

```text
inspect current branch
inspect relevant files
understand current state
```

After implementing:

```text
run checks
review changes
commit logically
```

Use meaningful commits.

Examples:

```text
feat: establish database architecture
feat: implement authentication
feat: build OrbitOS application shell
feat: implement customers
feat: implement inventory
feat: implement invoicing
feat: implement payments
feat: implement reports
feat: implement staff permissions
fix: correct invoice balance calculation
```

---

# 76. DEVELOPMENT PHASES

Implement in this order.

## PHASE 0 — AUDIT

Inspect everything.

Deliver internally:

```text
Existing architecture
Existing features
Missing features
Architecture problems
Recommended implementation order
```

Then begin implementation.

---

## PHASE 1 — FOUNDATION

Implement/fix:

```text
database connection
Drizzle
Supabase PostgreSQL
migrations
environment configuration
authentication foundation
organization architecture
```

---

## PHASE 2 — AUTH + ORGANIZATION

Implement:

```text
registration
login
Google OAuth
sessions
password reset
business creation
organization membership
tenant isolation
```

---

## PHASE 3 — ORBITOS SHELL

Implement:

```text
sidebar
header
dashboard shell
command palette
search
notifications
user menu
dark mode
responsive navigation
design system
```

---

## PHASE 4 — PEOPLE + CATALOG

Implement:

```text
customers
suppliers
products
categories
```

---

## PHASE 5 — INVENTORY

Implement:

```text
stock transactions
stock adjustments
low stock
inventory history
inventory valuation
```

---

## PHASE 6 — SALES + INVOICES

Implement:

```text
sales
invoice creation
invoice items
tax
discount
invoice numbering
PDF
printing
```

---

## PHASE 7 — PAYMENTS + KHATA

Implement:

```text
payments
customer ledger
supplier ledger
outstanding
statements
```

---

## PHASE 8 — PURCHASES

Implement:

```text
purchases
purchase items
supplier balances
inventory increases
purchase payments
```

---

## PHASE 9 — EXPENSES

Implement:

```text
expense categories
expenses
receipt upload
expense reports
```

---

## PHASE 10 — DASHBOARD + REPORTS

Replace all placeholder analytics with real calculations.

Implement:

```text
sales
purchases
expenses
profit
inventory
outstanding
receivables
payables
```

---

## PHASE 11 — STAFF + SECURITY

Implement:

```text
staff
roles
permissions
organization management
audit logs
security checks
```

---

## PHASE 12 — SEARCH + NOTIFICATIONS

Implement:

```text
global search
command palette
notifications
activity
```

---

## PHASE 13 — EXPORT / IMPORT

Implement:

```text
CSV exports
PDF reports
CSV imports
```

---

## PHASE 14 — STORAGE

Implement Supabase Storage for:

```text
business logo
product images
receipts
invoice attachments
```

---

## PHASE 15 — POLISH

Implement:

```text
responsive UI
mobile
dark mode
accessibility
loading states
empty states
error states
performance
```

---

## PHASE 16 — TESTING

Run:

```text
lint
typecheck
unit tests
integration tests
build
E2E
```

Fix all issues.

---

## PHASE 17 — DEPLOYMENT

Configure:

```text
Supabase production database
Supabase Storage
Firebase deployment
environment variables
production build
```

Document the final deployment procedure.

---

## PHASE 18 — AI

Only after the core system is stable.

Implement:

```text
AI business assistant
authorized data tools
business questions
AI insights
```

---

# 77. DEFINITION OF DONE

OrbitOS is NOT considered complete because all routes exist.

The project is complete only when:

```text
✓ Users can register
✓ Users can log in
✓ Users can create a business
✓ Organizations are isolated
✓ Customers work
✓ Suppliers work
✓ Products work
✓ Inventory works
✓ Sales work
✓ Purchases work
✓ Invoices work
✓ Payments work
✓ Khata works
✓ Expenses work
✓ Reports use real data
✓ Dashboard uses real data
✓ Staff works
✓ Permissions work
✓ Notifications work
✓ Search works
✓ Storage works
✓ Invoice PDF works
✓ CSV export works
✓ Critical workflows are tested
✓ Authentication is protected
✓ Server authorization works
✓ Production build succeeds
✓ No fake business data is used
✓ No secrets are committed
✓ Supabase integration works
✓ Deployment configuration works
```

---

# 78. CRITICAL BUSINESS TEST

The following scenario must work end-to-end:

```text
Create organization
        ↓
Create customer: Rahul
        ↓
Create product: Product A
        ↓
Opening stock: 100
        ↓
Create invoice
        ↓
Sell 5 units
        ↓
Stock becomes 95
        ↓
Customer outstanding updates
        ↓
Record ₹X payment
        ↓
Outstanding updates
        ↓
Ledger updates
        ↓
Dashboard updates
        ↓
Reports update
```

Then:

```text
Create supplier
        ↓
Create purchase
        ↓
Stock increases
        ↓
Supplier balance updates
        ↓
Purchase appears in reports
```

Then:

```text
Create expense
        ↓
Expense appears in reports
        ↓
Profit calculation updates
```

This scenario must be tested.

---

# 79. DATA CONSISTENCY RULE

The same financial fact must never produce different numbers in different modules.

For example:

If invoice total is:

```text
₹10,000
```

then:

```text
Invoice = ₹10,000
Customer ledger = corresponding ₹10,000 debit
Outstanding = corresponding balance
Dashboard sales = corresponding amount
Reports sales = corresponding amount
```

Do not create separate ad-hoc calculations for each screen.

---

# 80. PRODUCTION QUALITY

Before declaring completion, perform a final review for:

```text
Security
Authentication
Authorization
Tenant isolation
Database integrity
Financial calculations
Performance
Accessibility
Responsive UI
Error handling
Build
Testing
Environment configuration
Deployment
```

---

# 81. FINAL AUTONOMOUS WORKFLOW

Continue working through the phases without repeatedly asking the user to approve obvious implementation details.

For normal engineering decisions:

```text
Inspect
Plan
Implement
Test
Fix
Continue
```

Ask the user only when an external credential, secret, irreversible product decision, or genuinely ambiguous requirement is required.

Do not stop after creating a plan.

Do not stop after creating the UI.

Do not stop after creating database tables.

Continue until the Definition of Done is satisfied.

---

# 82. FINAL INSTRUCTION

The objective is NOT:

> "Create a nice OrbitOS demo."

The objective is:

> **Turn the existing `OrbitEast/OrbitOs` repository into a functioning, production-ready OrbitOS business operating system using the existing codebase, Supabase PostgreSQL/Storage, and an appropriate Firebase deployment architecture.**

Build the real system.

Use real persistence.

Use real authentication.

Use real authorization.

Use real business calculations.

Use real storage.

Use real reports.

Test the critical workflows.

Fix errors.

Keep the architecture maintainable.

Do not fake functionality.

Do not leave major TODOs disguised as completed features.

When the implementation is complete, provide a final report containing:

```text
1. What was implemented
2. Architecture
3. Database schema
4. Supabase configuration
5. Storage configuration
6. Authentication configuration
7. Firebase deployment configuration
8. Environment variables required
9. Tests performed
10. Build result
11. Known limitations
12. How to run locally
13. How to deploy
```

**OrbitOS should be treated as a real product, not a prototype.**

