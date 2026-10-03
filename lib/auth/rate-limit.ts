import { getDb } from "@/lib/db";
import { authRateLimits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function consumeAuthRateLimit(action: string, identifier: string): Promise<boolean> {
  const db = getDb();
  const key = `${action}:${identifier}`;
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW);

  const existing = await db
    .select()
    .from(authRateLimits)
    .where(eq(authRateLimits.key, key))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(authRateLimits).values({
      key,
      attempts: 1,
      windowStartedAt: now,
    });
    return true;
  }

  const record = existing[0];
  if (record.windowStartedAt < windowStart) {
    await db
      .update(authRateLimits)
      .set({ attempts: 1, windowStartedAt: now })
      .where(eq(authRateLimits.key, key));
    return true;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  await db
    .update(authRateLimits)
    .set({ attempts: record.attempts + 1 })
    .where(eq(authRateLimits.key, key));

  return true;
}
