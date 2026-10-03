import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { businessMembers, businesses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AppHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [membership] = await getDb().select({
    businessId: businessMembers.businessId,
    role: businessMembers.role,
    businessName: businesses.name,
  }).from(businessMembers)
    .innerJoin(businesses, eq(businesses.id, businessMembers.businessId))
    .where(eq(businessMembers.userId, session.user.id))
    .limit(1);

  if (!membership) redirect("/onboarding");

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-zinc-500">OrbitOS</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{membership.businessName}</h1>
        <p className="mt-3 text-zinc-600">Workspace foundation is active. Role: {membership.role}</p>
      </div>
    </main>
  );
}
