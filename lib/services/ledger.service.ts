import { getDb } from "@/lib/db";
import { customers, invoices, payments } from "@/lib/db/schema";
import { and, eq, sum } from "drizzle-orm";
import { Decimal } from "decimal.js";

export async function getCustomerOutstanding(
  businessId: string,
  customerId: string
): Promise<string> {
  const db = getDb();

  const invoiceTotal = await db
    .select({ total: sum(invoices.total) })
    .from(invoices)
    .where(
      and(
        eq(invoices.businessId, businessId),
        eq(invoices.customerId, customerId),
        eq(invoices.status, "active")
      )
    );

  const paymentTotal = await db
    .select({ total: sum(payments.amount) })
    .from(payments)
    .where(
      and(
        eq(payments.businessId, businessId),
        eq(payments.customerId, customerId)
      )
    );

  const inv = new Decimal(invoiceTotal[0]?.total || 0);
  const paid = new Decimal(paymentTotal[0]?.total || 0);
  const outstanding = inv.minus(paid);

  return outstanding.toString();
}

export async function getSupplierOutstanding(
  businessId: string,
  supplierId: string
): Promise<string> {
  // Similar logic for supplier balances
  const db = getDb();
  return "0"; // TODO: implement when purchase schema is complete
}
