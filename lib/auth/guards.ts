import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { businessMembers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireBusinessMember(businessId: string) {
  const user = await requireUser();
  const [membership] = await getDb()
    .select({ businessId: businessMembers.businessId, role: businessMembers.role })
    .from(businessMembers)
    .where(and(eq(businessMembers.businessId, businessId), eq(businessMembers.userId, user.id)))
    .limit(1);

  if (!membership) redirect("/app");
  return { user, membership };
}
