# Bricks
## V1 Technical Stack + Tenant / Architecture Proposal

## Overview

Bricks V1 is an **admin-only social media dashboard** for tracking members and internal Bricks/Brett accounts across:

- Instagram
- TikTok
- YouTube / YouTube Shorts
- Facebook Reels

The purpose of V1 is to collect **daily social media performance data**, store it historically, and show growth over time through:

- daily view counts
- weekly average views per content item
- monthly average views per content item
- follower growth over time
- pre-Bricks vs post-Bricks comparisons

This is the first technical version of the Bricks analytics system. Some ideas from the broader Bricks vision may be added in later versions, but are **not part of V1**.

---

## V1 Scope

### Included in V1

- Admin login only
- Admin ability to add and manage tracked people
- Admin ability to add and manage public social media accounts
- Daily sync of public profile/content metrics
- Daily historical storage in the database
- Weekly and monthly rollups
- Internal dashboard views for growth over time
- Tracking of both:
  - Bricks members
  - Brett / internal Bricks social accounts

### Not included in V1

- Member login
- Social account linking / OAuth
- Cross-posting automation
- Agent-based automations
- Audience-overlap-triggered posting logic
- Member-facing dashboards
- Collaboration automation
- Scheduling / production workflow tools

---

## Recommended Technologies

### Frontend / App Layer
- Next.js
- TypeScript
- Vercel

### Authentication
- Clerk

### Database
- Neon Postgres
- Drizzle ORM

### Scheduled / Background Processing
- Vercel Cron
- Vercel Workflow

### Social Data Providers
- Modash.io for:
  - Instagram
  - TikTok
  - YouTube
- Apify Facebook Reels scraper for:
  - Facebook Reels / Facebook Page public monitoring

---

## Why We Chose These Technologies

### Next.js
We chose Next.js because it gives us a strong TypeScript full-stack framework for:

- admin UI
- server routes
- internal APIs
- deployment on Vercel
- a single codebase for frontend and backend concerns

This keeps V1 easy to maintain.

### Vercel
We chose Vercel because it is the most natural hosting layer for a Next.js app and gives us:

- simple deployment
- environment variable management
- cron scheduling
- workflow orchestration
- good support for internal admin apps

This keeps the operational surface area small.

### Clerk
We chose Clerk because V1 only needs **admin login**, and Clerk makes that easy with:

- email/password authentication
- fast setup
- admin-friendly auth flows
- room for future member login later

This lets us move quickly without building auth ourselves.

### Neon Postgres
We chose Neon because V1 needs a **relational database** that is:

- easy to maintain
- Postgres-based
- scalable over time
- cost-effective in early stages
- good for historical daily snapshots and rollups

The data model for Bricks is strongly relational:
- tracked people
- social accounts
- content items
- daily snapshots
- weekly/monthly rollups

### Drizzle ORM
We chose Drizzle because it is a strong TypeScript-first ORM for Postgres and fits this project well:

- schema in TypeScript
- migrations in-repo
- easy maintenance
- SQL-friendly
- clean fit with Neon + Next.js

### Vercel Cron + Vercel Workflow
We chose this combination because Bricks needs one daily sync process that is easy to understand and easy to maintain.

- Vercel Cron is used to schedule the daily run
- Vercel Workflow is used to do the actual background orchestration

This is better than a giant single cron route because it gives us a cleaner way to:
- trigger a daily sync
- fan out work by social account
- retry or isolate failures
- compute rollups after ingestion

We do **not** think we need Queues in V1.

### Modash.io
We chose Modash for Instagram, TikTok, and YouTube because it appears to support public-profile monitoring and gives access to the kinds of metrics Bricks needs for V1:

- profile-level metrics
- content-level metrics
- current views
- current follower counts
- daily polling inputs for our own historical storage

It also aligns with the no-social-linking requirement for V1.

### Apify
We chose Apify for Facebook Reels because Facebook is the platform least clearly covered by Modash for our exact use case, and Apify provides a practical path to:

- public Facebook Reels/Page scraping
- daily profile-level monitoring
- daily content-level metrics collection

This lets us fill the Facebook gap without overengineering.

---

## Tenant / Architecture Proposal for V1

This is an **admin-only internal app** in V1.

### Who can log in
- Admins only

### Who gets tracked
- Bricks members
- Brett / internal Bricks accounts
- Additional internal or external tracked people later if needed

### Core domain model

#### Admin Users
Authenticated internal users who can log into the app and manage data.

#### Tracked People
The main business object in V1.

A tracked person can be:
- a Bricks member
- Brett / an internal Bricks creator
- another tracked entity in the future

#### Social Accounts
Each tracked person can have one or more public social accounts, such as:
- Instagram
- TikTok
- YouTube
- Facebook

#### Content Items
Posts, reels, shorts, videos, etc. that belong to a social account.

#### Daily Snapshots
Stored every day for:
- profile-level metrics
- content-level metrics

#### Rollups
Computed from daily data for:
- weekly averages
- monthly averages
- trend reporting

---

## How Daily Sync Works

### Cadence
Each active tracked social account is synced **once per day**.

This is the V1 reporting cadence.

### Daily Sync Flow

1. Vercel Cron runs once per day.
2. The cron route triggers a Vercel Workflow run.
3. Workflow loads all active social accounts from Neon.
4. Workflow processes each social account.
5. Depending on platform:
   - Instagram / TikTok / YouTube use Modash
   - Facebook Reels uses Apify
6. Raw vendor data is normalized into Bricks’ internal schema.
7. Daily profile snapshots are written to Neon.
8. Daily content snapshots are written to Neon.
9. Weekly and monthly rollups are updated.
10. The admin dashboard reads from stored data and rollups.

### Why we need daily polling
Bricks wants to report:

- per-day views
- average views per week
- average views per month
- growth over time

To do that reliably, Bricks should store its **own daily historical snapshots** in the database. That becomes the source of truth for trend reporting.

---

## Where Daily Social Information Comes From

### Instagram / TikTok / YouTube
Source: Modash.io

Bricks will use Modash as the daily input for:
- profile metrics
- content metrics
- current public performance values

These are then normalized and stored in Bricks’ own database.

### Facebook Reels
Source: Apify Facebook Reels scraper

Bricks will use Apify as the daily input for:
- Facebook Page / profile reel data
- public Reels performance values

These are then normalized and stored in Bricks’ own database.

---

## Where Data Gets Stored

### Database
All normalized data is stored in **Neon Postgres**.

### Types of stored data

#### Tracked People
- member or internal tracked person record
- Bricks start date
- notes / status

#### Social Accounts
- platform
- handle
- public profile URL
- active / inactive status
- tracking enabled flag

#### Content Items
- platform content ID
- type of content
- content URL
- title / caption
- published date

#### Daily Profile Snapshots
Examples:
- followers
- following
- total content count
- average views
- average likes
- average comments
- snapshot date

#### Daily Content Snapshots
Examples:
- views
- likes
- comments
- shares where available
- snapshot date

#### Weekly / Monthly Rollups
Examples:
- average views per content item
- median views
- follower delta
- content count
- growth trends

---

## Proposed Repo Organization

Repository name: **bricks**

### Recommended structure

- single Next.js repository
- app code
- admin UI
- API routes
- workflow code
- drizzle schema
- drizzle migrations
- vendor adapters
- metrics and rollup logic

This keeps V1 simple and easy to maintain.

### High-level folders

- app
- db
- workflows
- jobs
- lib/vendors
- types
- drizzle config
- vercel config

---

## Cost Estimate (Early V1)

## Core App Infrastructure

### Vercel
Estimated base:
- Pro starts at $20/month
- plus $20 per developer
- likely about **$40/month** to start for a small setup
- usage may increase this somewhat

Important note:
- cron, workflow, function calls, and build/runtime usage are not all fully covered by the base plan
- actual monthly cost may vary depending on:
  - build minutes
  - function execution
  - workflow usage
  - bandwidth / runtime activity

### Neon
Expected early-stage posture:
- likely **Free tier at first**
- then likely around **$15/month typical spend** on Launch as usage grows
- scales upward over time if the product gets heavier usage

Neon pricing provided:

#### Free
- $0
- 100 projects
- 100 CU-hours monthly per project
- 0.5 GB storage per project
- sizes up to 2 CU
- suitable for learning / early building

#### Launch
- usage-based
- typical spend: **$15/month**
- $0.106 per CU-hour
- $0.35 per GB-month
- sizes up to 16 CU

#### Scale
- usage-based
- typical spend: **$701/month**
- for much higher load
- large scale / more advanced production setup

Planning assumption:
- V1 will likely be free or low-cost on Neon for a while
- Neon gives a good path to scale later without changing the stack

### Clerk
Expected early-stage posture:
- likely **Pro at $25/month**
- could possibly start on free if usage is tiny, but Pro is a better planning assumption for a real internal system

Clerk pricing provided:

#### Hobby
- Free
- up to 3 dashboard seats
- 50,000 MRU limit per app
- unlimited applications

#### Pro
- **$25/month**
- 50,000 MRU included per app
- removes branding
- adds more production-ready auth features

#### Business
- $300/month
- not necessary for V1

Planning assumption:
- use **Clerk Pro at $25/month**

---

## Social Data Vendor Cost Estimate

### Modash.io
Planning assumption:
- approximately **$10,000/year**
- requires a sales conversation to validate exact fit and pricing

Equivalent rough monthly planning number:
- about **$833/month**

This is the main paid data provider for:
- Instagram
- TikTok
- YouTube

### Apify
Planning assumption:
- approximately **$5 / 1,000 Facebook reel profile scrapes**

This is the Facebook public data component.

Actual monthly spend depends on:
- how many Facebook profiles are tracked
- how many results are pulled per day
- how much history is scraped

---

## Approximate Early Monthly Cost Estimate

### Estimated baseline monthly stack cost

- Vercel: about **$40/month** base, possibly somewhat higher with usage
- Clerk: about **$25/month**
- Neon: **$0 to $15/month** initially
- Modash: about **$833/month**
- Apify: variable, but likely relatively low at V1 scale

### Approximate early planning total
Rough expected monthly range:

- around **$900/month** on the low end
- possibly **$950+ / month** once Vercel and Apify usage are included
- could vary month to month depending on actual workflow/function/scrape usage

This means the major cost driver is clearly **Modash**, with the app infrastructure itself remaining relatively affordable.

---

## Final Recommendation

Proceed with the following V1 stack:

- Next.js
- TypeScript
- Vercel
- Vercel Cron
- Vercel Workflow
- Clerk
- Neon Postgres
- Drizzle ORM
- Modash.io for Instagram / TikTok / YouTube
- Apify for Facebook Reels

This stack is the strongest V1 choice because it is:

- easy to maintain
- TypeScript-native
- Vercel-friendly
- simple to operate
- built for daily historical tracking
- flexible enough to grow into future Bricks features

The key V1 principle is:

**Public social accounts in, daily snapshots stored, growth evidence out.**