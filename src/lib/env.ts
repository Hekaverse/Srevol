import { z } from "zod";

/**
 * Centralized environment variable validation.
 * Fails fast at startup if required variables are missing or invalid.
 *
 * Phased additions:
 * - Phase 2 (current): Core auth + database + admin protection
 * - Phase 4: Upstash Redis (rate limiting)
 * - Phase 8: Resend (email)
 * - Phase 10: Stripe (payments)
 * - Phase 14: Sentry (monitoring)
 */
// Trim all string env vars to handle newline artifacts from CI/pipe input
const trimmedEnv = Object.fromEntries(
  Object.entries(process.env).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
);

export const env = z
  .object({
    // ============================================
    // Core — required for the app to function
    // ============================================
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    NEXTAUTH_SECRET: z
      .string()
      .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

    // ============================================
    // Admin protection — required
    // ============================================
    SEED_SECRET: z.string().min(1, "SEED_SECRET is required for admin routes"),
    CRON_SECRET: z.string().optional(),

    // ============================================
    // External APIs — optional (fallbacks exist)
    // ============================================
    SERPAPI_KEY: z.string().optional(),
    AMADEUS_CLIENT_ID: z.string().optional(),
    AMADEUS_CLIENT_SECRET: z.string().optional(),
    VIATOR_API_KEY: z.string().optional(),
    RAPIDAPI_KEY: z.string().optional(),
    RAPIDAPI_HOST: z.string().optional(),

    // ============================================
    // Phase 4: Rate limiting (Upstash Redis)
    // ============================================
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // ============================================
    // Phase 8: Email (Resend)
    // ============================================
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: z.string().email().optional(),

    // ============================================
    // Phase 10: Payments (Stripe)
    // ============================================
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // ============================================
    // Phase 14: Monitoring (Sentry)
    // ============================================
    SENTRY_DSN: z.string().url().optional(),
  })
  .parse(trimmedEnv);
