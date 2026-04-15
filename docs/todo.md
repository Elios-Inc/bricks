# Bricks V1 Setup TODO

Tracking all infrastructure, accounts, and integration work needed to launch Bricks V1.

---

## Accounts & Billing

All accounts are initially set up under Elios. Eventually all accounts need to migrate to Bricks-owned accounts with Bricks billing. Coordinate with Megan (Brett's EA) on account setup where Brett/Bricks needs to own the billing.

### GitHub

- [ ] Create a Bricks-owned GitHub org (eventual home for this repo)
- [ ] Transfer repo ownership when ready

### Vercel

- [ ] Create Vercel project for `bricks`
- [ ] Connect to GitHub repo
- [ ] Configure environment variables
- [ ] Set up production + preview deployments
- [ ] Determine billing owner (Elios initially, Bricks eventually)

### Neon Postgres

- [ ] Create Neon account for Bricks
- [ ] Create a Neon project and database
- [ ] Store connection string in Vercel env vars (`DATABASE_URL`)
- [ ] Determine billing owner (free tier initially, Bricks-owned billing when scaling)

### Clerk

- [ ] Create Clerk account/application for Bricks
- [ ] Enable email + password sign-in
- [ ] Configure admin-only access (no public sign-up)
- [ ] Add Clerk env vars to Vercel (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- [ ] Determine billing tier (Pro at ~$25/mo is the planning assumption)
- [ ] Determine billing owner (Elios initially, Bricks eventually)

### Modash.io

- [ ] Brett/Bricks to set up Modash account with billing
- [ ] Coordinate with Megan on account setup and sales conversation
- [ ] Confirm API access covers Instagram, TikTok, YouTube public monitoring
- [ ] Confirm pricing (~$10,000/year planning assumption)
- [ ] Store API credentials in Vercel env vars

### Apify

- [ ] Brett/Bricks to set up Apify account with billing
- [ ] Coordinate with Megan on account setup
- [ ] Identify and configure Facebook Reels scraper actor
- [ ] Store API token in Vercel env vars

---

## Codebase Setup

### Drizzle ORM

- [ ] Install Drizzle ORM + drizzle-kit + pg driver (`drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`)
- [ ] Set up `drizzle.config.ts` at repo root
- [ ] Create `db/` directory with schema and client setup (reference Elios Insights repo for patterns)
- [ ] Define initial schema tables:
  - [ ] `tracked_people`
  - [ ] `social_accounts`
  - [ ] `content_items`
  - [ ] `daily_profile_snapshots`
  - [ ] `daily_content_snapshots`
  - [ ] `weekly_rollups`
  - [ ] `monthly_rollups`
- [ ] Generate and run initial migration
- [ ] Add migration scripts to `package.json` (`db:generate`, `db:migrate`, `db:push`, `db:studio`)

### Clerk Integration

- [ ] Install `@clerk/nextjs`
- [ ] Add `ClerkProvider` to root layout
- [ ] Add middleware for auth protection
- [ ] Build admin sign-in page
- [ ] Restrict access to admin users only

### Vercel Cron + Workflow

- [ ] Set up `vercel.json` with cron schedule (daily trigger)
- [ ] Create cron route (`app/api/cron/daily-sync/route.ts`)
- [ ] Install and configure Vercel Workflow SDK
- [ ] Build daily sync workflow:
  - [ ] Load active social accounts
  - [ ] Fan out by account/platform
  - [ ] Call Modash for Instagram/TikTok/YouTube
  - [ ] Call Apify for Facebook Reels
  - [ ] Normalize and store daily snapshots
  - [ ] Compute weekly/monthly rollups
- [ ] Add `CRON_SECRET` env var for cron route protection

### Vendor Adapters

- [ ] Build Modash adapter (`lib/vendors/modash.ts`)
- [ ] Build Apify adapter (`lib/vendors/apify.ts`)
- [ ] Normalize vendor responses into Bricks internal schema

---

## Coordination with Megan / Brett

Items where Megan (Brett's EA) can help with account setup:

- [ ] Modash account + billing setup (requires sales call)
- [ ] Apify account + billing setup
- [ ] Bricks GitHub org creation (when ready)
- [ ] Transfer Vercel project billing to Bricks (when ready)
- [ ] Transfer Neon billing to Bricks (when ready)
- [ ] Transfer Clerk billing to Bricks (when ready)

---

## Notes

- See `docs/TECHSTACK_V1.md` for full tech stack rationale and cost estimates
- Modash is the biggest cost driver (~$833/mo)
- App infrastructure runs ~$65-80/mo (Vercel + Clerk + Neon)
- Reference the Elios Insights repo for Drizzle ORM patterns and migration setup
