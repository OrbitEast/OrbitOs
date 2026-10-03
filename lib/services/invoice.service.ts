import { getDb } from "@/lib/db";
import { invoices, invoiceItems, customers, businesses, businessMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Decimal } from "decimal.js";

export async function createInvoice(
  userId: string,
  businessId: string,
  data: {
    customerId: string;
    invoiceDate: string;
    dueDate: string;
    items: Array<{ description: string; qty: number; unitPrice: number }>,
    taxRate: number;
    discount: number;
  }
) {
  const db = getDb();

  // Verify business membership
  const membership = await db
    .select()
    .from(businessMembers)
    .where(and(eq(businessMembers.userId, userId), eq(businessMembers.businessId, businessId)))
    .limit(1);

  if (!membership.length) {
    throw new Error("Unauthorized: No business membership");
  }

  // Calculate totals with decimal precision
  let subtotal = new Decimal(0);
  data.items.forEach(item => {
    subtotal = subtotal.plus(new Decimal(item.qty).times(new Decimal(item.unitPrice)));
  });

  const tax = subtotal.times(new Decimal(data.taxRate).dividedBy(100));
  const discountAmount = new Decimal(data.discount);
  const total = subtotal.plus(tax).minus(discountAmount);

  // Create invoice in transaction
  const invoiceId = crypto.randomUUID();
  const invoiceNumber = `INV-${Date.now()}`;

  try {
    // Insert invoice
    await db.insert(invoices).values({
      id: invoiceId,
      businessId,
      customerId,
      invoiceNumber,
      invoiceDate: new Date(data.invoiceDate),
      dueDate: new Date(data.dueDate),
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      discount: discountAmount.toString(),
      total: total.toString(),
      status: "draft",
    });

    // Insert invoice items
    for (const item of data.items) {
      const itemTotal = new Decimal(item.qty).times(new Decimal(item.unitPrice));
      await db.insert(invoiceItems).values({
        id: crypto.randomUUID(),
        invoiceId,
        description: item.description,
        quantity: item.qty,
        unitPrice: new Decimal(item.unitPrice).toString(),
        amount: itemTotal.toString(),
      });
    }

    return { success: true, invoiceId, invoiceNumber, total: total.toString() };
  } catch (error) {
    console.error("Invoice creation failed:", error);
    throw error;
  }
}

export async function recordPayment(
  userId: string,
  businessId: string,
  invoiceId: string,
  amount: number
) {
  const db = getDb();

  // Verify business membership
  const membership = await db
    .select()
    .from(businessMembers)
    .where(and(eq(businessMembers.userId, userId), eq(businessMembers.businessId, businessId)))
    .limit(1);

  if (!membership.length) {
    throw new Error("Unauthorized");
  }

  // Get invoice
  const invoice = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, invoiceId), eq(invoices.businessId, businessId)))
    .limit(1);

  if (!invoice.length) {
    throw new Error("Invoice not found");
  }

  const inv = invoice[0];
  const paidAmount = new Decimal(inv.paidAmount || 0).plus(new Decimal(amount));
  const totalAmount = new Decimal(inv.total);
  const newStatus = paidAmount.greaterThanOrEqualTo(totalAmount) ? "paid" : "partial";

  // Update invoice
  await db
    .update(invoices)
    .set({ paidAmount: paidAmount.toString(), status: newStatus })
    .where(eq(invoices.id, invoiceId));

  return { success: true, status: newStatus, paidAmount: paidAmount.toString() };
}
