import { getDb } from "@/lib/db";
import { businessMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function requireBusinessMembership(userId: string, businessId: string) {
  const membership = await getDb()
    .select({ role: businessMembers.role })
    .from(businessMembers)
    .where(
      and(
        eq(businessMembers.userId, userId),
        eq(businessMembers.businessId, businessId)
      )
    )
    .limit(1);

  if (!membership.length) {
    throw new Error("Unauthorized: No business membership");
  }

  return membership[0];
}

export async function requirePermission(
  userId: string,
  businessId: string,
  requiredPermission: string
) {
  const membership = await requireBusinessMembership(userId, businessId);
  // TODO: implement granular permission checking based on role
  // For now, all business members have full access
  return membership;
}
