import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  passwordHash: text("password_hash"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

export const authenticators = pgTable("authenticators", {
  credentialId: text("credential_id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("provider_account_id").notNull(),
  credentialPublicKey: text("credential_public_key").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credential_device_type").notNull(),
  credentialBackedUp: boolean("credential_backed_up").notNull(),
  transports: text("transports"),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  email: text("email"),
  phone: text("phone"),
  gstin: text("gstin"),
  pan: text("pan"),
  website: text("website"),
  address: jsonb("address").notNull().default({}),
  currency: text("currency").notNull().default("INR"),
  timezone: text("timezone").notNull().default("Asia/Kolkata"),
  financialYearStart: date("financial_year_start"),
  ...timestamps,
});

export const businessMembers = pgTable(
  "business_members",
  {
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("owner"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.businessId, table.userId] }),
  ],
);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  companyName: text("company_name"),
  email: text("email"),
  phone: text("phone"),
  gstin: text("gstin"),
  billingAddress: jsonb("billing_address").notNull().default({}),
  shippingAddress: jsonb("shipping_address"),
  openingBalance: numeric("opening_balance", { precision: 18, scale: 2 }).notNull().default("0"),
  creditLimit: numeric("credit_limit", { precision: 18, scale: 2 }),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  companyName: text("company_name"),
  email: text("email"),
  phone: text("phone"),
  gstin: text("gstin"),
  openingBalance: numeric("opening_balance", { precision: 18, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const itemCategories = pgTable(
  "item_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => [unique().on(table.businessId, table.name)],
);

export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => itemCategories.id, { onDelete: "set null" }),
    sku: text("sku"),
    name: text("name").notNull(),
    itemType: text("item_type").notNull().default("product"),
    unit: text("unit").notNull().default("pcs"),
    sellingPrice: numeric("sale_price", { precision: 18, scale: 2 }).notNull().default("0"),
    purchasePrice: numeric("purchase_price", { precision: 18, scale: 2 }).notNull().default("0"),
    taxRate: numeric("tax_rate", { precision: 7, scale: 3 }).notNull().default("0"),
    openingStock: numeric("opening_stock", { precision: 18, scale: 3 }).notNull().default("0"),
    reorderLevel: numeric("reorder_level", { precision: 18, scale: 3 }),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [unique().on(table.businessId, table.sku)],
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    invoiceNumber: text("invoice_number").notNull(),
    status: text("status").notNull().default("draft"),
    issueDate: date("issue_date").notNull(),
    dueDate: date("due_date"),
    subtotal: numeric("subtotal", { precision: 18, scale: 2 }).notNull().default("0"),
    discountTotal: numeric("discount_total", { precision: 18, scale: 2 }).notNull().default("0"),
    taxTotal: numeric("tax_total", { precision: 18, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 18, scale: 2 }).notNull().default("0"),
    amountPaid: numeric("amount_paid", { precision: 18, scale: 2 }).notNull().default("0"),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [unique().on(table.businessId, table.invoiceNumber)],
);

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").references(() => items.id, { onDelete: "set null" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 18, scale: 2 }).notNull().default("0"),
  taxRate: numeric("tax_rate", { precision: 7, scale: 3 }).notNull().default("0"),
  lineTotal: numeric("line_total", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
  paymentDate: date("payment_date").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  method: text("method").notNull(),
  reference: text("reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
    purchaseNumber: text("purchase_number").notNull(),
    status: text("status").notNull().default("draft"),
    purchaseDate: date("purchase_date").notNull(),
    dueDate: date("due_date"),
    subtotal: numeric("subtotal", { precision: 18, scale: 2 }).notNull().default("0"),
    discountTotal: numeric("discount_total", { precision: 18, scale: 2 }).notNull().default("0"),
    taxTotal: numeric("tax_total", { precision: 18, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 18, scale: 2 }).notNull().default("0"),
    amountPaid: numeric("amount_paid", { precision: 18, scale: 2 }).notNull().default("0"),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [unique().on(table.businessId, table.purchaseNumber)],
);

export const purchaseItems = pgTable("purchase_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseId: uuid("purchase_id").notNull().references(() => purchases.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").references(() => items.id, { onDelete: "set null" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 18, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 18, scale: 2 }).notNull().default("0"),
  taxRate: numeric("tax_rate", { precision: 7, scale: 3 }).notNull().default("0"),
  lineTotal: numeric("line_total", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
  expenseDate: date("expense_date").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 18, scale: 2 }).notNull().default("0"),
  paymentMethod: text("payment_method"),
  reference: text("reference"),
  ...timestamps,
});

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "restrict" }),
  quantity: numeric("quantity", { precision: 18, scale: 3 }).notNull(),
  movementType: text("movement_type").notNull(),
  referenceId: uuid("reference_id"),
  referenceType: text("reference_type"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "set null" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  data: jsonb("data").notNull().default({}),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
