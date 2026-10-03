import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function keyFor(action: string, identifier: string) {
  return `${action}:${identifier.toLowerCase().slice(0, 180)}`;
}

export async function consumeAuthRateLimit(action: string, identifier: string) {
  const key = keyFor(action, identifier);
  const db = getDb();
  const now = new Date();
  const cutoff = new Date(now.getTime() - WINDOW_MS);
  const result = await db.execute<{ allowed: boolean }>(sql`
    INSERT INTO auth_rate_limits (key, window_started_at, attempts)
    VALUES (${key}, ${now}, 1)
    ON CONFLICT (key) DO UPDATE
      SET attempts = CASE
        WHEN auth_rate_limits.window_started_at <= ${cutoff} THEN 1
        ELSE auth_rate_limits.attempts + 1
      END,
      window_started_at = CASE
        WHEN auth_rate_limits.window_started_at <= ${cutoff} THEN ${now}
        ELSE auth_rate_limits.window_started_at
      END
    RETURNING attempts <= ${MAX_ATTEMPTS} AS allowed
  `);
  return Boolean(result.rows[0]?.allowed);
}
