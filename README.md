# Bricks

An admin-only social media dashboard for tracking members and internal Bricks/Brett accounts across Instagram, TikTok, YouTube, and Facebook Reels.

Bricks collects daily social media performance data, stores it historically, and surfaces growth over time through:

- daily view counts
- weekly and monthly average views per content item
- follower growth over time
- pre-Bricks vs post-Bricks comparisons

## Tech stack

- **Next.js 16** with the App Router (Node 22)
- **TypeScript**
- **Tailwind CSS** for styling
- **Clerk** for admin authentication
- **Neon Postgres** with **Drizzle ORM** for data storage
- **Vercel Cron + Vercel Workflow** for daily sync orchestration
- **Modash.io** for Instagram, TikTok, and YouTube data
- **Apify** for Facebook Reels data
- **Vercel** for hosting and deployment

## V1 scope

### Included

- Admin login only
- Admin ability to add and manage tracked people
- Admin ability to add and manage public social media accounts
- Daily sync of public profile and content metrics
- Daily historical storage in the database
- Weekly and monthly rollups
- Internal dashboard views for growth over time
- Tracking of both Bricks members and Brett / internal Bricks social accounts

### Not included

- Member login
- Social account linking / OAuth
- Cross-posting automation
- Agent-based automations
- Member-facing dashboards

## Quick start

### 1) Install dependencies

Requires **Node 22**.

```bash
npm install
```

### 2) Set up environment variables

Copy the example env file and fill in the values you need.

```bash
cp .env.example .env.local
```

You will need:
- Clerk keys for authentication
- Neon Postgres connection string
- Modash API credentials
- Apify API token

### 3) Run the app locally

```bash
npm run dev
```

### 4) Open the app

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev       # Run the development server
npm run build     # Build for production
npm run start     # Start the production build locally
npm run lint      # Run ESLint
```

## Core domain model

- **Tracked People** -- Bricks members, Brett / internal creators, or other tracked entities
- **Social Accounts** -- Instagram, TikTok, YouTube, or Facebook accounts linked to a tracked person
- **Content Items** -- Posts, reels, shorts, videos belonging to a social account
- **Daily Snapshots** -- Profile-level and content-level metrics stored each day
- **Rollups** -- Weekly and monthly averages computed from daily data

## Daily sync flow

1. Vercel Cron triggers once per day
2. Cron route starts a Vercel Workflow run
3. Workflow loads all active social accounts from Neon
4. Each account is processed by platform:
   - Instagram / TikTok / YouTube via Modash
   - Facebook Reels via Apify
5. Raw vendor data is normalized into the Bricks schema
6. Daily profile and content snapshots are written to Neon
7. Weekly and monthly rollups are updated
8. The admin dashboard reads from stored data and rollups

## Database

All data is stored in **Neon Postgres** using **Drizzle ORM**.

Schema and migrations live in the repo. Drizzle handles schema-as-code in TypeScript and SQL-friendly migrations.

Stored data includes:
- Tracked people (member records, Bricks start date, notes)
- Social accounts (platform, handle, URL, active status)
- Content items (platform content ID, type, URL, published date)
- Daily profile snapshots (followers, following, total content count, average views/likes/comments)
- Daily content snapshots (views, likes, comments, shares)
- Weekly and monthly rollups (average/median views, follower delta, growth trends)

## Authentication

Clerk handles admin-only authentication for V1. Only admins can log in and manage data.

## Deployment

This app is designed for **Vercel** deployment.

Key deployment concerns:
- Connect the GitHub repo to a Vercel project
- Add environment variables in Vercel for Clerk, Neon, Modash, and Apify
- Configure the Vercel Cron schedule for daily sync
- Vercel Workflow handles the sync orchestration

## Project structure

- `app/` -- Next.js App Router pages and API routes
- `db/` -- Drizzle schema and migrations
- `workflows/` -- Vercel Workflow definitions
- `jobs/` -- Cron job entry points
- `lib/vendors/` -- Modash and Apify adapter code
- `types/` -- Shared TypeScript types

## AI-assisted development

This repo includes local conventions and skills for Claude Code usage.

Important files:
- `CLAUDE.md`
- `docs/` for engineering guidance
- `.claude/skills/` for local skills
