import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

/**
 * Rate limiting with Upstash Redis (production) or in-memory fallback (dev).
 *
 * In serverless environments, in-memory rate limiting is ineffective because
 * memory is not shared across function instances. Upstash Redis provides
 * distributed rate limiting that works correctly on Vercel.
 */

function getRedisClient(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set. " +
          "Falling back to in-memory rate limiting, which is NOT effective in serverless environments."
      );
    }
    return null;
  }
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const redis = getRedisClient();

/* ─── Upstash Redis limiters ─── */
const redisAuthLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "rl:auth",
    })
  : null;

const redisApiLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "rl:api",
    })
  : null;

const redisAdminLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "rl:admin",
    })
  : null;

/* ─── In-memory fallback ─── */
type MemoryEntry = { count: number; resetAt: number };
const memoryStore = new Map<string, MemoryEntry>();

function memoryLimit(
  key: string,
  max: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    const newEntry: MemoryEntry = { count: 1, resetAt: now + windowMs };
    memoryStore.set(key, newEntry);
    return { success: true, limit: max, remaining: max - 1, reset: newEntry.resetAt };
  }

  if (entry.count >= max) {
    return { success: false, limit: max, remaining: 0, reset: entry.resetAt };
  }

  entry.count++;
  return { success: true, limit: max, remaining: max - entry.count, reset: entry.resetAt };
}

function getIp(request: Request): string {
  const headers = new Headers(request.headers);
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/* ─── Public API ─── */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

async function checkRedis(
  limiter: Ratelimit,
  identifier: string
): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  return { success, limit, remaining, reset };
}

/** Auth endpoints: 5 requests per 15 minutes per IP */
export async function authRateLimit(request: Request): Promise<RateLimitResult> {
  const ip = getIp(request);
  if (redisAuthLimit) {
    return checkRedis(redisAuthLimit, ip);
  }
  return memoryLimit(`auth:${ip}`, 5, 15 * 60_000);
}

/** General API: 100 requests per 1 minute per IP */
export async function apiRateLimit(request: Request): Promise<RateLimitResult> {
  const ip = getIp(request);
  if (redisApiLimit) {
    return checkRedis(redisApiLimit, ip);
  }
  return memoryLimit(`api:${ip}`, 100, 60_000);
}

/** Admin operations: 30 requests per 1 minute per IP */
export async function adminRateLimit(request: Request): Promise<RateLimitResult> {
  const ip = getIp(request);
  if (redisAdminLimit) {
    return checkRedis(redisAdminLimit, ip);
  }
  return memoryLimit(`admin:${ip}`, 30, 60_000);
}
