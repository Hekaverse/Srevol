# Deploy SREVOL to srevol.com

This guide walks you through deploying the SREVOL platform to **srevol.com** using **Vercel + Neon PostgreSQL** — completely free.

---

## Prerequisites

- [ ] You own `srevol.com` and have access to its DNS settings
- [ ] GitHub account
- [ ] Vercel account (sign up with GitHub at https://vercel.com)

---

## Step 1: Push Code to GitHub

```bash
# Create a new private repo on GitHub, then:
git init
git add .
git commit -m "Ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/srevol.git
git push -u origin main
```

---

## Step 2: Create Neon PostgreSQL Database

1. Go to https://neon.tech and sign up with GitHub
2. Create a new project named `srevol`
3. In the Neon dashboard, copy the connection string:
   ```
   postgresql://user:password@host.neon.tech/srevol?sslmode=require
   ```
4. Save this — you'll need it in Step 4

---

## Step 3: Import Project into Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your `srevol` GitHub repo
4. Framework preset: **Next.js** (auto-detected)
5. Click **Deploy** (it will fail initially — that's expected, we need env vars)

---

## Step 4: Configure Environment Variables

In your Vercel project dashboard → **Settings** → **Environment Variables**, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://user:password@host.neon.tech/srevol?sslmode=require` | Production |
| `NEXTAUTH_SECRET` | *(generate below)* | Production |
| `NEXTAUTH_URL` | `https://srevol.com` | Production |
| `SERPAPI_KEY` | *(your existing key)* | Production |
| `SEED_SECRET` | *(generate below)* | Production |

**Generate secrets:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object { [byte]$_ }))
```

Generate two different secrets — one for `NEXTAUTH_SECRET`, one for `SEED_SECRET`.

Also add the same variables for **Preview** environment if you want preview deploys to work.

---

## Step 5: Run Database Migration

After the first deploy, run the migration on Neon:

```bash
# Install Vercel CLI if you haven't:
npm i -g vercel

# Link to your project:
cd srevol
vercel --prod

# Pull env vars locally:
vercel env pull .env.production.local

# Run migration:
npx prisma migrate deploy
```

Or use Neon's SQL Editor and paste the contents of `prisma/migrations/20260519_init/migration.sql`.

---

## Step 6: Seed Initial Data

```bash
# Run seed against your Neon database:
DATABASE_URL="your-neon-connection-string" npx tsx prisma/seed.ts
```

Or hit the seed endpoint once you're logged in as admin:
```bash
curl -X POST https://srevol.com/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-seed-secret"}'
```

---

## Step 7: Connect Custom Domain

1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Enter `srevol.com` and click **Add**
3. Vercel will show you DNS records to add

### If your DNS is at your domain registrar (e.g., Namecheap, GoDaddy):

Add these records:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### If your DNS is on Cloudflare:

1. Go to Cloudflare dashboard → DNS
2. Add an **A record**: `srevol.com` → `76.76.21.21` (DNS-only, grey cloud)
3. Add a **CNAME record**: `www` → `cname.vercel-dns.com` (DNS-only, grey cloud)
4. **Do NOT proxy through Cloudflare** (orange cloud off) — Vercel handles SSL

4. Back in Vercel, click **Refresh** — SSL certificate auto-provisions in ~1 minute

---

## Step 8: Verify Deployment

Check these URLs:

| URL | Expected Result |
|-----|----------------|
| `https://srevol.com` | Homepage loads |
| `https://srevol.com/api/health` | `{"status":"ok","checks":{"database":"ok"}}` |
| `https://srevol.com/register` | Registration page |
| `https://srevol.com/privacy` | Privacy policy |
| `https://srevol.com/terms` | Terms of service |

Register a test account, log in, and verify the dashboard loads with real data.

---

## Step 9: Create an Admin User (Optional)

To access `/admin`, you need a user with `role = "ADMIN"`. After registering:

```bash
# Connect to Neon DB and run:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Neon's SQL Editor in their dashboard.

---

## Troubleshooting

### "Database connection failed" on `/api/health`
- Check `DATABASE_URL` is correct in Vercel env vars
- Ensure the Neon project is active (not paused due to inactivity)
- Verify the connection string includes `?sslmode=require`

### Build fails with Prisma errors
- The `postinstall` script runs `prisma generate` automatically
- If it fails, add a Build Command in Vercel: `npx prisma generate && next build`

### "Unauthorized" on admin endpoints
- You haven't set any user's role to `ADMIN`
- Run the SQL in Step 9

### Domain shows "Invalid Configuration"
- DNS hasn't propagated yet — wait 5-15 minutes
- Verify A record points to `76.76.21.21`
- Ensure you're not proxying through Cloudflare (orange cloud off)

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Vercel Bandwidth | 100GB/month |
| Vercel Function Duration | 10 seconds |
| Vercel Build Time | 6,000 minutes/month |
| Neon Storage | 500MB |
| Neon Compute | 190 hours/month |

These limits are generous for a pre-launch / early-traffic app. You can upgrade later as you grow.

---

## Next Steps After Deploy

- [ ] Set up Sentry for error tracking (free tier)
- [ ] Configure Google Analytics / Plausible
- [ ] Set up a real email provider (Resend, SendGrid) for partner invites
- [ ] Add rate limiting with Upstash Redis (free tier)
- [ ] Set up uptime monitoring (UptimeRobot — free)
