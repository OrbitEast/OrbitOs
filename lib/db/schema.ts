import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, numeric, timestamp, uuid, varchar, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner", "admin", "staff"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "active", "partial", "paid", "cancelled"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "bank_transfer", "cheque", "upi", "credit_card"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  gstin: varchar("gstin", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessMembers = pgTable("business_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: roleEnum("role").default("staff"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  gstin: varchar("gstin", { length: 15 }),
  openingBalance: numeric("opening_balance", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
  invoiceDate: timestamp("invoice_date").notNull(),
  dueDate: timestamp("due_date"),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 15, scale: 2 }).default("0"),
  discount: numeric("discount", { precision: 15, scale: 2 }).default("0"),
  total: numeric("total", { precision: 15, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 15, scale: 2 }).default("0"),
  status: invoiceStatusEnum("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  customerId: uuid("customer_id"),
  invoiceId: uuid("invoice_id"),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  method: paymentMethodEnum("method"),
  reference: varchar("reference", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  sku: varchar("sku", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  unit: varchar("unit", { length: 50 }).default("piece"),
  sellingPrice: numeric("selling_price", { precision: 15, scale: 2 }).notNull(),
  purchasePrice: numeric("purchase_price", { precision: 15, scale: 2 }),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("18"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").default(0),
  reorderLevel: integer("reorder_level").default(0),
  value: numeric("value", { precision: 15, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  productId: uuid("product_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
  previousQty: integer("previous_qty"),
  newQty: integer("new_qty"),
  reference: varchar("reference", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  vendor: varchar("vendor", { length: 255 }),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const authRateLimits = pgTable("auth_rate_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 255 }).unique(),
  attempts: integer("attempts").default(0),
  windowStartedAt: timestamp("window_started_at"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  userId: uuid("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: uuid("entity_id"),
  previousState: text("previous_state"),
  nextState: text("next_state"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});
