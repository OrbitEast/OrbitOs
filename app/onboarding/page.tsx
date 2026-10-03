import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createBusiness } from "./actions";
import { getDb } from "@/lib/db";
import { businessMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await getDb().select({ businessId: businessMembers.businessId })
    .from(businessMembers)
    .where(eq(businessMembers.userId, session.user.id))
    .limit(1);

  if (membership.length) redirect("/app");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm text-zinc-500">OrbitOS setup</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your business</h1>
        <p className="mt-3 text-zinc-600">This creates your private workspace. You can configure tax, people, products and other settings afterward.</p>
        <form action={createBusiness} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">Business name</label>
          <input name="name" required minLength={2} placeholder="e.g. Acme Retail" className="w-full rounded-xl border px-4 py-3" />
          <button className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white">Continue</button>
        </form>
      </div>
    </main>
  );
}
