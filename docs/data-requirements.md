# BRICKS Dashboard — Data Requirements

Note for Matt on what data backs each dashboard section. Everything shown today is mock data in `lib/dashboard/data.ts`. This doc translates each UI surface into the upstream signals we need to collect, store, and refresh.

## Sources (what we actually pull)

All data can be sourced from **public platform pages** — no creator-dashboard access needed. One collector per platform, running on a schedule:

| Platform  | Public signal                                             | Notes                                             |
| --------- | --------------------------------------------------------- | ------------------------------------------------- |
| TikTok    | Profile page, video page                                  | Views + like/comment counts on each video         |
| YouTube   | oEmbed + channel page (or Data API v3 if we want a key)   | Subscriber counts, per-video views                |
| Instagram | Public profile, reel permalinks                           | Follower counts, reel play counts where public    |
| Facebook  | Public page, video permalinks                             | Page likes, video view counts                     |

Store one row per `(member_id, platform, snapshot_at)` for aggregate counters, and one row per `(post_id, snapshot_at)` for per-post counters. Snapshots daily at minimum; every 6h for Top Content.

## Core entities

```
members         id, full_name, tags[], onboarded_at
member_accounts id, member_id, platform, handle, url, external_id
posts           id, member_account_id, platform_post_id, url, thumbnail_url,
                caption, format (long|short|photo), published_at, is_collab,
                collab_partner_ids[]
post_snapshots  post_id, snapshot_at, views, likes, comments, shares
account_snapshots member_account_id, snapshot_at, followers, engagement_rate
```

That schema covers every section below.

## Section-by-section data map

### 01 — Overview scoreboard
Aggregates across all members, filtered by timeframe (7D/30D/90D/YTD/All).

- **Total Views** — `sum(post_snapshots.views)` for posts `published_at ∈ timeframe`
- **Avg Engagement** — weighted average of `account_snapshots.engagement_rate` across platforms
- **Active Members** — distinct `member_id` with ≥1 post in timeframe
- **Content Pieces** — count of `posts` in timeframe
- **Total Followers** — sum of latest `account_snapshots.followers` per account
- Delta fields compare to prior period of equal length

### 02 — Views Over Time
Daily stacked area with prior-period overlay and a 100M/mo pace line.

- One row per `(day, platform)`: `sum(views delta)` from `post_snapshots`
- Prior-period series: same shape, shifted back by the timeframe length
- Pace line: constant 3.33M/day (100M ÷ 30)

### 03 — Platform Breakdown
Four platform cards.

- **Views / Followers / Engagement** — aggregated from `account_snapshots` + `post_snapshots` per platform
- **CPM range** — static lookup by platform (market rate, not tracked per-post)
- **Top member** — member with highest `sum(views)` on that platform in timeframe
- **Sparkline** — last 12 points of daily platform-total views

### 04 — Content Types (Formats)
Long-form vs short-form vs photo allocation.

- Count + view share from `posts.format` grouped by type
- Avg engagement per format

### 05 — Top Content
6 hero posts with thumbnails and live URLs.

- Top 6 `posts` by `views` where `published_at ∈ timeframe`
- Needs `thumbnail_url`, `url`, `platform_post_id`, per-post velocity (views/hr since publish)
- Thumbnail scraping may hit CORS — plan to mirror to our own CDN (Vercel Blob)

### 06 — Members leaderboard
14 rows ranked by views or followers.

- Per-member rollup: `sum(views)`, `sum(followers)` across accounts, `max(topPostViews)`, `avg(engagement)`, `growth` = delta vs prior-period
- Tags come from `members.tags`

### 07 — Collaboration network
Force-directed graph with hub sizing.

- **Nodes** — members active in timeframe, size = `sum(views)` on collab posts
- **Edges** — `posts.is_collab = true AND collab_partner_ids contains other_member`
- **Solo vs Collab lift** — `avg(views where is_collab=false)` vs `avg(views where is_collab=true)`

Collab detection options:
1. @mention of another member's handle in caption (cheap, noisy)
2. Manual tagging when the post is ingested (clean, slower)
3. Co-starring / featured-in tags on YT & IG (platform-specific)

Start with #1 + manual override.

### 08 — Cross-posting matrix
Who reposted to whose accounts this week.

- For each `(from_member, to_member)`: count `posts` where `member_account.handle = to_member.handle` AND `caption` or `filename` or `video_hash` matches a post from `from_member`
- Simplest path: track `posts.original_post_id` when a repost is ingested, or match on exact video duration + publish delta < 7d

### 09 — Growth Trajectory
Monthly totals vs onboarding baseline, with forecast.

- One row per `(member_id, month)`: monthly `sum(views)` and ending `followers`
- Baseline = first month snapshot after `onboarded_at`
- Forecast: linear projection from last 6 months (UI already handles the dashed extension)
- Annotations (Tour launch, new members joined) — manual `events` table keyed by month

## Refresh cadence

| Data                  | Frequency       |
| --------------------- | --------------- |
| Account snapshots     | Every 6 hours   |
| Post snapshots (top)  | Every hour for Top Content, every 6h for the rest |
| New-post detection    | Every 15 min (low cost; just checks feed)         |
| Monthly rollups       | Nightly         |

## Open questions for Matt

1. Do we have scraper infrastructure already, or do we need to stand one up? If new, Playwright on Fluid Compute is the cheapest path.
2. Where do we store historical snapshots? Neon (already in the stack) works for all of this at our volume — estimate ~10MB/month/member.
3. Manual inputs (member tags, collab tagging, trajectory annotations, onboarded_at) — where do we edit these? Minimal admin UI or a Notion sync?
4. CPM ranges per platform — locked-in numbers or should we let Matt edit those in an admin page?
5. Thumbnail CDN — Vercel Blob (private) or mirror to public URLs?

## Build order suggestion

1. `members` + `member_accounts` schema + a minimal admin to seed handles
2. One collector (TikTok) writing `post_snapshots` + `account_snapshots`
3. Wire Overview scoreboard + Views Over Time to real data (kills most of the mock)
4. Add YouTube, then IG, then Facebook
5. Top Content (needs thumbnail pipeline)
6. Collab detection + Cross-posting (last; richest signal)
7. Trajectory is mostly a rollup query — cheap once snapshots exist

Everything above the "Build order" line is achievable with public data + one scraper stack. No creator-dashboard access required.
