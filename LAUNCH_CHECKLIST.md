# SREVOL Launch Checklist

## What Was Fixed in This Session

### CRITICAL
- **Webhook idempotency** — Fixed double-booking risk by checking `stripeCustomerId` instead of broken `packageId` comparison
- **Auto-billing** — Webhook now creates all `months` payment records (1 COMPLETED + N-1 PENDING)
- **Payment plan math** — `totalAmount` now equals actual collectible amount, not inflated protected amount
- **Store credit application** — Referral credits now auto-apply at checkout, reducing `booking.totalPrice`
- **Tier tracking** — Added `tierId` to `Booking` model; dashboard departure board shows correct tier per booking
- **Referral symmetry** — Both referrer AND new couple receive $50 credit

### HIGH
- **Public API rate limiting** — `/api/pass/[id]` and `/api/packages/detail` now rate-limited
- **OG meta tags** — Shareable pass page generates dynamic OpenGraph/Twitter cards
- **SEO** — `robots.txt` and `sitemap.xml` generated dynamically
- **Global error boundary** — Custom obsidian-themed error page with retry button
- **Accessibility** — ARIA labels on departure board, hotel gallery thumbnails, live regions

### MEDIUM
- **Flight assembler** — Gracefully handles missing flight inventory (returns null instead of crash)
- **Email integration** — Verified Resend integration with dev fallback

---

## What YOU Need To Do Before Launch

### 1. Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```env
# Database
DATABASE_URL="file:./dev.db"           # Dev: SQLite
# DATABASE_URL="postgresql://..."      # Prod: PostgreSQL

# Auth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Admin
SEED_SECRET="your-random-seed-secret"
CRON_SECRET="your-random-cron-secret"  # Optional: falls back to SEED_SECRET

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@srevol.com"

# Rate Limiting (Upstash Redis — REQUIRED for production)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Optional APIs
SERPAPI_KEY="..."                       # For price intelligence
AMADEUS_CLIENT_ID="..."                 # For flight data
AMADEUS_CLIENT_SECRET="..."
```

### 2. Stripe Configuration

1. **Create products/prices in Stripe Dashboard** (or the checkout session will auto-create them)
2. **Configure webhook endpoint:**
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.payment_failed`
   - Sign secret: copy to `STRIPE_WEBHOOK_SECRET`
3. **Enable saved payment methods** in Stripe settings (for off-session charging)

### 3. Database Migration (PostgreSQL)

If deploying to PostgreSQL:

```bash
npx prisma migrate deploy
```

For SQLite dev: already handled by `prisma db push`.

### 4. Cron Job for Auto-Billing

The `/api/payments/process-due` endpoint must be called periodically.

**Option A: Vercel Cron (recommended)**
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/payments/process-due",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Option B: External service (Cron-job.org, GitHub Actions)**
```bash
curl -X POST https://your-domain.com/api/payments/process-due \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 5. Resend Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (e.g., `srevol.com`)
3. Copy API key to `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` to a verified sender (e.g., `noreply@srevol.com`)
5. Test: send a password reset email

### 6. Seed Production Data

```bash
# Run once after deployment
curl -X POST https://your-domain.com/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SEED_SECRET"}'
```

This creates:
- 4 budget tiers (Horizon/Meridian/Celestial/Astral)
- 21 package templates
- 21 real hotels with amenities, ratings, romance scores
- 43 real experiences with pricing and categories
- 64 package components linking them all

### 7. Custom Domain & DNS

1. Point your domain to your hosting platform
2. Set `NEXTAUTH_URL` to the custom domain
3. Update Stripe webhook URL to custom domain
4. Verify SSL certificate is active

### 8. Post-Launch Monitoring

Watch these logs regularly:
```
[stripe/webhook]        — Booking creation success/failure
[payments/process-due]  — Auto-billing charged/failed/skipped counts
[email]                 — Email delivery success/failure
[rate-limit]            — Rate limit hits (indicates abuse)
```

---

## Architecture Quick Reference

| Flow | Entry Point | Key Files |
|---|---|---|
| **Browse routes** | `/packages` | `PackagesGrid.tsx` → `PackageDetailClient.tsx` |
| **Book route** | `/packages/[id]` | `PaymentPlanCalculator.tsx` → `/api/stripe/checkout-session` |
| **Stripe webhook** | POST `/api/stripe/webhook` | Creates booking, payment plan, payments, countdown, bucket |
| **Checkout success** | `/checkout/success` | `CheckoutSuccessContent.tsx` → polls `/api/me/bookings` |
| **Dashboard** | `/dashboard` | `DashboardView.tsx` → departure board, stats, referrals |
| **Trip detail** | `/trips/[id]` | `TripConcierge.tsx` + `PreDepartureChecklist.tsx` |
| **Share pass** | `/pass/[id]` | Public page, OG meta, QR code, download PNG |
| **Auto-billing** | Cron → `/api/payments/process-due` | Charges pending payments via saved Stripe method |
| **Referral** | `/?ref=SVXXXXX` | Stored in localStorage, applied at couple creation |

---

## Known Limitations (Not Blockers)

1. **Flight data** — No real flight API integration yet. Assembler searches for flights but none are seeded. Flights appear as "0" in price breakdown.
2. **Image optimization** — Hotel/experience images use Unsplash URLs. For production, consider uploading to Cloudinary or S3 with optimization.
3. **Error boundaries** — Global boundary exists but no per-route boundaries yet.
4. **Payment retries** — Failed auto-billing payments stay FAILED. No automatic retry logic yet.
5. **Currency** — All prices in USD. Multi-currency support not built.

---

## Next Evolution Ideas

1. **AI Concierge** — Integrate OpenAI/Claude for pre-departure Q&A
2. **Real-time price monitoring** — Cron job that checks hotel prices and alerts on savings
3. **Mobile app** — React Native or PWA for offline boarding passes
4. **Loyalty program** — SREVOL Elite status tiers with real benefits
5. **Partner network** — Travel insurance, visa services, luggage delivery APIs
