/**
 * In-memory sliding-window rate limiter.
 *
 * Suitable for a single-node deployment (Lightsail/EC2 with one pm2 process).
 * If we ever scale to multiple nodes, swap the internal Map for Redis.
 */

type Bucket = { hits: number[]; lockedUntil: number };

const store = new Map<string, Bucket>();

// Periodic cleanup of stale buckets
if (typeof globalThis !== "undefined" && !("__rateLimitCleanupTimer" in globalThis)) {
  (globalThis as Record<string, unknown>).__rateLimitCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.hits.length === 0 && bucket.lockedUntil < now) store.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

/**
 * Sliding-window rate limit.
 *
 * @param key       Identifier (IP, user id, etc.)
 * @param limit     Max requests within the window.
 * @param windowSec Window length in seconds.
 * @param lockSec   How long to lock the key after limit is hit (defaults to `windowSec`).
 */
export function rateLimit(
  key: string,
  limit: number,
  windowSec: number,
  lockSec: number = windowSec
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key) ?? { hits: [], lockedUntil: 0 };

  if (bucket.lockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.lockedUntil - now) / 1000) };
  }

  const windowMs = windowSec * 1000;
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    bucket.lockedUntil = now + lockSec * 1000;
    bucket.hits = [];
    store.set(key, bucket);
    return { ok: false, retryAfterSec: lockSec };
  }

  bucket.hits.push(now);
  store.set(key, bucket);
  return { ok: true, remaining: limit - bucket.hits.length };
}

/** Reset a key after a successful auth so a legit user isn't penalised for slow typing. */
export function rateLimitReset(key: string) {
  store.delete(key);
}
