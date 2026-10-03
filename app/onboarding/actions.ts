"use server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { businessMembers, businesses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "business";
}

export async function createBusiness(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) throw new Error("Business name is required.");

  const baseSlug = slugify(name);
  const db = getDb();

  const existing = await db.select({ id: businessMembers.businessId })
    .from(businessMembers)
    .where(eq(businessMembers.userId, session.user.id))
    .limit(1);

  if (existing.length) redirect("/app");

  let slug = baseSlug;
  for (let suffix = 2; suffix <= 20; suffix++) {
    const conflict = await db.select({ id: businesses.id }).from(businesses).where(eq(businesses.slug, slug)).limit(1);
    if (!conflict.length) break;
    slug = `${baseSlug}-${suffix}`;
  }

  const [business] = await db.transaction(async (tx) => {
    const [created] = await tx.insert(businesses).values({ name, slug }).returning();
    await tx.insert(businessMembers).values({ businessId: created.id, userId: session.user.id, role: "owner" });
    return [created];
  });

  redirect(`/app?business=${business.id}`);
}
