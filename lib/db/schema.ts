import {
  boolean,
  date,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  gstin: text("gstin"),
  address: jsonb("address").notNull(),
  currency: text("currency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  legalName: text("legal_name"),
  pan: text("pan"),
  website: text("website"),
  financialYearStart: date("financial_year_start"),
  timezone: text("timezone").notNull(),
});

export const businessMembers = pgTable(
  "business_members",
  {
    businessId: uuid("business_id").notNull(),
    userId: uuid("user_id").notNull(),
    role: text("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.businessId, table.userId] })],
);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  name: text("name").notNull(),
  companyName: text("company_name"),
  email: text("email"),
  phone: text("phone"),
  gstin: text("gstin"),
  billingAddress: jsonb("billing_address").notNull(),
  openingBalance: numeric("opening_balance").notNull(),
  creditLimit: numeric("credit_limit"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  shippingAddress: jsonb("shipping_address"),
});

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  name: text("name").notNull(),
  companyName: text("company_name"),
  email: text("email"),
  phone: text("phone"),
  gstin: text("gstin"),
  openingBalance: numeric("opening_balance").notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const items = pgTable("items", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  sku: text("sku"),
  name: text("name").notNull(),
  itemType: text("item_type").notNull(),
  category: text("category"),
  unit: text("unit").notNull(),
  sellingPrice: numeric("selling_price").notNull(),
  purchasePrice: numeric("purchase_price").notNull(),
  taxRate: numeric("tax_rate").notNull(),
  openingStock: numeric("opening_stock").notNull(),
  reorderLevel: numeric("reorder_level"),
  isActive: boolean("is_active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  customerId: uuid("customer_id"),
  invoiceNumber: text("invoice_number").notNull(),
  status: text("status").notNull(),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date"),
  subtotal: numeric("subtotal").notNull(),
  discountTotal: numeric("discount_total").notNull(),
  taxTotal: numeric("tax_total").notNull(),
  total: numeric("total").notNull(),
  amountPaid: numeric("amount_paid").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey(),
  invoiceId: uuid("invoice_id").notNull(),
  itemId: uuid("item_id"),
  description: text("description").notNull(),
  quantity: numeric("quantity").notNull(),
  unitPrice: numeric("unit_price").notNull(),
  discount: numeric("discount").notNull(),
  taxRate: numeric("tax_rate").notNull(),
  lineTotal: numeric("line_total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  customerId: uuid("customer_id"),
  invoiceId: uuid("invoice_id"),
  paymentDate: date("payment_date").notNull(),
  amount: numeric("amount").notNull(),
  method: text("method").notNull(),
  reference: text("reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  vendorId: uuid("vendor_id"),
  expenseDate: date("expense_date").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull(),
  taxAmount: numeric("tax_amount").notNull(),
  paymentMethod: text("payment_method"),
  reference: text("reference"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey(),
  businessId: uuid("business_id").notNull(),
  itemId: uuid("item_id").notNull(),
  quantity: numeric("quantity").notNull(),
  movementType: text("movement_type").notNull(),
  referenceId: uuid("reference_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  referenceType: text("reference_type"),
});
