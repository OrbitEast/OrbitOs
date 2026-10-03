import { getDb } from "@/lib/db";
import { inventory, inventoryTransactions } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Decimal } from "decimal.js";

export type TransactionType = "opening" | "purchase" | "sale" | "return" | "adjustment" | "damage";

export async function recordInventoryTransaction(
  businessId: string,
  productId: string,
  type: TransactionType,
  quantity: number,
  reference: string,
  notes?: string
) {
  const db = getDb();

  // Get current inventory
  const current = await db
    .select()
    .from(inventory)
    .where(and(eq(inventory.businessId, businessId), eq(inventory.productId, productId)))
    .limit(1);

  let currentQty = 0;
  if (current.length > 0) {
    currentQty = current[0].quantity;
  }

  // Calculate new quantity
  const delta = type === "sale" || type === "damage" ? -quantity : quantity;
  const newQty = currentQty + delta;

  if (newQty < 0) {
    throw new Error("Insufficient inventory");
  }

  // Record transaction
  await db.insert(inventoryTransactions).values({
    id: crypto.randomUUID(),
    businessId,
    productId,
    type,
    quantity,
    previousQty: currentQty,
    newQty,
    reference,
    notes: notes || null,
    createdAt: new Date(),
  });

  // Update inventory
  if (current.length > 0) {
    await db
      .update(inventory)
      .set({ quantity: newQty, updatedAt: new Date() })
      .where(
        and(
          eq(inventory.businessId, businessId),
          eq(inventory.productId, productId)
        )
      );
  } else {
    await db.insert(inventory).values({
      id: crypto.randomUUID(),
      businessId,
      productId,
      quantity: newQty,
      reorderLevel: 50,
      createdAt: new Date(),
    });
  }

  return { success: true, newQty };
}

export async function getInventoryValue(
  businessId: string,
  productId: string
): Promise<string> {
  const db = getDb();
  const result = await db
    .select()
    .from(inventory)
    .where(
      and(
        eq(inventory.businessId, businessId),
        eq(inventory.productId, productId)
      )
    )
    .limit(1);

  if (!result.length) return "0";
  return result[0].value || "0";
}
