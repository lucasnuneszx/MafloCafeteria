import "server-only";
import { and, gte, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { rateLimitEvents } from "@/lib/db/schema";

/**
 * Lightweight Postgres-backed rate limiter — no Redis dependency needed at
 * this traffic level. Records an attempt under `key` and returns whether it
 * is still within `limit` attempts in the trailing `windowMinutes`.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMinutes: number
): Promise<boolean> {
  const db = getDb();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(rateLimitEvents)
    .where(and(eq(rateLimitEvents.key, key), gte(rateLimitEvents.createdAt, windowStart)));

  if (count >= limit) {
    return false;
  }

  await db.insert(rateLimitEvents).values({ key });
  return true;
}
