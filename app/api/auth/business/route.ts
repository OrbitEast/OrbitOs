import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { businessMembers, businesses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    const memberships = await db
      .select({
        businessId: businessMembers.businessId,
        role: businessMembers.role,
        businessName: businesses.name,
      })
      .from(businessMembers)
      .innerJoin(
        businesses,
        eq(businesses.id, businessMembers.businessId)
      )
      .where(eq(businessMembers.userId, session.user.id));

    return NextResponse.json(memberships);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
