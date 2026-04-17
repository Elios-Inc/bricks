# BRICKS SLC Analytics Dashboard — Design Spec

**Date:** 2026-04-16
**Status:** Approved (pending final user review)
**Owner:** Brett Chell (founder) + BRICKS engineering
**Context:** Pivot from spec-driven mockup to scraper-powered investor pitch tool.

---

## 1. Purpose

The BRICKS SLC Analytics Dashboard is a **real-time investor pitch deck**, not an internal ops tool. Every element must answer: *"Why should a brand or investor bet on BRICKS?"*

- **Primary user:** Brett (founder), pitching brand sponsors and recruiting new members.
- **Secondary user:** Members, seeing their rank within the collective.
- **Not a user:** BRICKS analysts doing deep ops work. That's a future product.

## 2. Data Reality Constraint (Load-Bearing)

**All numbers on this dashboard must come from public scraping.** No CRM data, no creator-dashboard access, no platform partner APIs.

**What we can get:**
- Follower count per account
- Post-level views, likes, comments, shares (where public)
- Post type (image / carousel / short video / long video)
- Thumbnail + post URL
- Caption text (for @mentions → collab detection)
- Post timestamp (for cross-posting detection)

**What we cannot get (and must not invent):**
- Demographics (age, gender, geo) — creator-dashboard only
- Watch time / completion rate — creator-dashboard only
- Saves — mostly creator-dashboard only
- Revenue, leads, clicks, conversions — require CRM + UTMs
- Unique reach — requires dedup across platforms, impossible from public data

**Why this matters:** A sharp investor will ask "how do you know?" Every metric needs a defensible source. Inventing data to fill a dashboard destroys credibility faster than a smaller dashboard.

**How to apply:** When adding any new metric, first write one sentence describing how a scraper produces it. If you can't, cut it or label it explicitly as an estimate with its formula visible.

## 3. Data Model

**Member** (grouped by last name, one profile per person)
- `id`, `name`, `tags[]`, `joinedAt`
- Has many **Accounts**

**Account**
- `platform` (youtube | tiktok | instagram | facebook)
- `handle`
- `type` — personal or business (deferred; not yet surfaced in UI)
- Rollups: `followers`, `views30d`, `engagementRate`, `topPostUrl`

**Aggregation rule:** All leaderboard, scoreboard, and growth totals roll up at the **Member** level. A member with a personal + business TikTok contributes both to their Member total. The personal/business split is captured in data but shown only in the expanded member detail (future work).

**Rationale:** User explicitly said "if they have a personal handle or a business handle we'll cross that bridge later." One profile per last name now; split UI later.

## 4. Layout & Navigation

- **Viewport:** Desktop-first at 1440px. Cards and charts should remain readable down to 1280px.
- **Shell:** Sticky top bar with logo · nav · timeframe selector · "Powered by Elios" badge.
- **Nav (new):** Anchor links to each section. Previously a single long scroll; navigation added because the dashboard now has 9 distinct sections.
- **Timeframe selector:** 7D / 30D / 90D / YTD / All-time. Always-on prior-period overlay in comparison charts.

**Rationale:** User asked for navigation ("this is only a long single page") and timeframe filters (originally only on one section, now global).

## 5. Sections

### Section 01 — Collective Scoreboard
Six stat cards in a row. Hero card: **Est. Brand Value** (renamed from "Campaign Value") with green glow border and "PITCH" badge inline with the label.

| Card | Value | Notes |
|---|---|---|
| Total Views (30D) | 31.2M | Scraper-real. Prior-period delta. |
| Est. Unique Reach | **CUT** | Not derivable from public data. |
| Avg Engagement | 4.7% | Weighted across all accounts. Scraper-real. |
| Active Members | 14 | Count of members who posted this period. |
| **Est. Brand Value** | **$465K–$930K/mo** | Formula shown on hover: `views × blended CPM`. Range reflects CPM uncertainty. |
| Content Pieces (30D) | 847 | Post count across all member accounts. |

**Rationale for rename:** "Campaign Value" implied we're running campaigns. "Brand Value" is honest — it's what a brand could expect to pay for this much attention at market-rate CPMs. Formula must be visible to survive investor scrutiny.

### ~~(former Section 02) — Audience Profile~~ — CUT
**Rationale:** Demographics, geography, and interests are creator-dashboard-only. We cannot scrape them. Showing invented data on an investor dashboard is unacceptable. Sections below are renumbered accordingly.

### Section 02 — Views Over Time
Stacked area chart (TikTok, YouTube, Instagram, Facebook), daily granularity within selected timeframe, white dashed total overlay, horizontal dashed target line at the "100M/mo pace" threshold.

- **Timeframe selector:** 7D / 30D / 90D / YTD / All-time (same as global).
- **Prior-period overlay:** Always on — faint ghost line showing the previous equivalent period.

**Rationale:** User picked always-on overlay so the growth story is visible without clicking. 7D to All-time covers both "momentum right now" and "we've been cooking for a year."

### Section 03 — Member Leaderboard
Expandable table, one row per Member (aggregated across all their accounts).

**Columns:** Rank · Avatar+Name+Tags · **Toggle: [Views | Followers]** · YouTube · TikTok · Instagram · Facebook · Engagement Rate · Growth · Top Post · Expand.

**Views/Followers toggle rationale:** User asked whether views and followers are equally important. Answer: no. Views = right-now attention. Followers = compounding asset. Both matter for different pitches. A toggle lets the same table answer both questions without duplicating UI.

**Engagement Rate rationale:** User picked this over alternatives because it's the one metric every platform exposes publicly and every investor understands. Green >4%, amber 2–4%, red <2%.

**Expanded row:** Shows the member's accounts broken down by handle (currently showing Brett's personal vs BRICKS split; will generalize to all members). "View Full Profile →" links to future member detail page.

### Section 04 — Platform Breakdown
2×2 grid of platform cards. Each card: top border in platform color, rows showing Total Views, Total Followers, **scraper-real quality metric** (engagement rate — NOT watch time, NOT completion %, NOT saves), CPM range, Est. Value, Top Member, sparkline.

**Rationale:** Original spec had creator-dashboard-only metrics (avg watch time, completion rate, saves/post). Replaced all with engagement rate — the one quality signal that's public on every platform. Consistency across cards is more valuable than fake-precision platform-specific metrics.

### Section 05 — Top Content (30D)
**6 hero cards** (not 10) showcasing top-performing posts with:
- 16:9 thumbnail, platform icon badge, play overlay
- Title, member, tag
- Stats row: views · engagement rate · date
- **Velocity indicator:** "↑ 340K views/day" — shows if content is still climbing
- **Live link:** "View on TikTok →" opens the actual post

**Rationale:** User picked option C (fewer, bigger, with velocity + live links) over option A (safer 10-card grid). Pitch logic: 6 standout posts with working links lets the investor click through and verify — six clicks of proof beats ten thumbnails of "trust me." Velocity captures which content is currently breaking out, which is more compelling than historical totals.

### Section 06 — Growth Trajectory
Line chart. X-axis: months. Y-axis: monthly views.

**Not** a fabricated history going back to Nov 2025. Instead:
- **Baseline marker** at the month each member joined BRICKS
- Actuals from member join date forward
- Projected line from today to the 100M/mo target
- Per-member onboarding baseline captured at join (mandatory)

**Rationale:** User explicitly said: "we dont need historical actuals we just need to start from a baseline, when did they start with us and how we grew them." This is the single most important narrative beat — "this is what they were doing before BRICKS, this is what they're doing now." Requires mandatory onboarding baseline capture for every new member.

### Section 07 — Collaboration
Hero-first layout, graph supporting.

**Hero row:**
- **+69% Lift** (giant number) — collab content vs solo content
- 3 supporting stats: Collabs/mo (34), Solo avg (78K), Collab avg (132K)
- Collabs-per-month sparkline

**Network graph below:**
- Bubbles = members. **Bubble size = 30D views.**
- Edges = collabs. **Edge thickness = # of collabs between that pair.**
- Every bubble labeled with member last name
- Legend in corner: "○ size = 30D views · ━ thickness = collabs"
- Hover tooltip shows exact numbers

**Rationale:** Original graph had two variables competing for attention and no labels — looked cool, said nothing. User wanted to keep the visual ("it's a cool visual come on lets make it work"), so we fix legibility (labels, legend, hover) rather than kill it. Hero stat leads so the number lands before the graph decorates.

**Data source:** Collab detection = @mentions and tags in captions (reliable) + same video on 2+ accounts within a week (reliable). Face detection in thumbnails is out of scope for v1.

### Section 08 — Cross-posting Matrix (new)
Grid: rows = members (FROM), columns = members (TO). Green cell if member A's content was cross-posted to member B's account this week. Target annotation: "✓ = cross-posted this week · Target: 2+ incoming per member."

**Rationale:** Borrowed from a friend's dashboard. Makes "network effect" operational and measurable in a way the force-directed graph can't — you see instantly whether the collective is actually operating as a collective. Scraper-derivable from post URLs + timestamps. Complements the graph (graph = emotion, matrix = ops proof).

### Section 09 — Content Type Performance (new)
Horizontal bars comparing content types: Static Post, Short-form Video, Carousel, Long-form Video. Each bar shows piece count, avg engagement rate, avg views.

**Rationale:** Post type is scrapable. This section proves to investors that BRICKS optimizes production by format — "we know short-form carries reach, long-form carries depth, and we allocate accordingly." Cheap data, high sophistication signal.

## 6. Visual System

Unchanged from v1 mockup:
- Dark mode: `#0D0D0D` bg, `#1A1A1A` cards, `#2A2A2A` borders (soft white/5 variants used in current implementation)
- Platform colors: YT `#FF0000`, TT `#00F2EA`, IG gradient `#F58529 → #DD2A7B → #8134AF`, FB `#1877F2`
- Typography: Inter / DM Sans. White primary, `#888888` secondary
- Positive `#00C853`, caution `#FFA000`, negative `#FF1744`
- 8px rounded corners, subtle elevation
- **Aesthetic target:** Bloomberg terminal meets modern media company dashboard

## 7. What's Out of Scope for v1

- Member detail page (linked from leaderboard expand, not built)
- Per-member personal/business account split UI (data model supports it; UI deferred)
- Real scraper integration (dashboard runs on mock data; scraper is separate project)
- Demographics, watch time, saves, revenue, leads — never in scope (not scrapable)
- Authentication / multi-tenant (single-pitch tool for now)

## 8. Key Design Decisions — Rationale Index

| Decision | Why |
|---|---|
| Cut Audience Profile entirely | Demographics are not scrapable. Fake data on pitch dashboard = instant credibility loss. |
| Rename "Campaign Value" → "Est. Brand Value" with visible formula | Honesty > aspiration. Formula makes the number defensible. |
| Add timeframe selector + prior-period overlay | User asked. Lets same dashboard answer "right now" and "over time" without re-navigation. |
| Toggle Views ↔ Followers in leaderboard | Both matter for different investor questions; toggle avoids table duplication. |
| Engagement Rate as cross-platform quality metric | Only quality signal public on every platform. Consistency > per-platform fake precision. |
| 6 hero Top Content cards + live links + velocity | Clickable proof > volume. Velocity shows what's breaking out now. |
| Growth Trajectory = per-member baseline, not fabricated history | "Before BRICKS vs after BRICKS" is the strongest pitch narrative. |
| Keep collab network graph + add hero stat above it | Hero carries the message, graph carries the vibe. Don't pick one. |
| Add Cross-posting Matrix as separate section | Makes network effect operational and legible. Graph can't do that. |
| Add Content Type Performance | Cheap scraper data, high sophistication signal. |
| Group accounts by Member (last name) | User decision. Personal/business split deferred until real data forces it. |

## 9. Open Questions Deferred

- Exact CPM ranges per platform (needs brand sales input)
- Collab detection edge cases (tagged but not in-video)
- What happens when the matrix gets to 100 members (may need pagination/heat scaling)
- Member detail page design (future spec)
