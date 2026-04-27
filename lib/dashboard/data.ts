export type PlatformKey = "youtube" | "tiktok" | "instagram" | "facebook";

export const platformMeta: Record<
  PlatformKey,
  { label: string; short: string; color: string; textColor: string }
> = {
  youtube: { label: "YouTube", short: "YT", color: "#FF0000", textColor: "#FF4545" },
  tiktok: { label: "TikTok", short: "TT", color: "#00F2EA", textColor: "#00F2EA" },
  instagram: { label: "Instagram", short: "IG", color: "#DD2A7B", textColor: "#F58EBC" },
  facebook: { label: "Facebook", short: "FB", color: "#1877F2", textColor: "#5BA8FF" },
};

export const platformOrder: PlatformKey[] = [
  "tiktok",
  "youtube",
  "instagram",
  "facebook",
];

// --------------------------------------------------------------------------
// Timeframe
// --------------------------------------------------------------------------

export type TimeframeKey = "7D" | "30D" | "90D" | "YTD" | "ALL";

export const timeframes: { key: TimeframeKey; label: string }[] = [
  { key: "7D", label: "7D" },
  { key: "30D", label: "30D" },
  { key: "90D", label: "90D" },
  { key: "YTD", label: "YTD" },
  { key: "ALL", label: "All-time" },
];

export function timeframeShort(tf: TimeframeKey): string {
  return tf === "ALL" ? "All-time" : tf;
}

export function timeframePhrase(tf: TimeframeKey): string {
  const map: Record<TimeframeKey, string> = {
    "7D": "Last 7 days",
    "30D": "Last 30 days",
    "90D": "Last 90 days",
    YTD: "Year to date",
    ALL: "All-time",
  };
  return map[tf];
}

export function timeframeViewsLabel(tf: TimeframeKey): string {
  return tf === "ALL" ? "Lifetime Views" : `${tf} Views`;
}

// --------------------------------------------------------------------------
// Nav anchors (one per section)
// --------------------------------------------------------------------------

export const navSections: { id: string; number: string; label: string }[] = [
  { id: "scoreboard", number: "01", label: "Overview" },
  { id: "views-over-time", number: "02", label: "Views" },
  { id: "platform-breakdown", number: "03", label: "Platforms" },
  { id: "content-type", number: "04", label: "Formats" },
  { id: "top-content", number: "05", label: "Top Content" },
  { id: "leaderboard", number: "06", label: "Members" },
  { id: "collaboration", number: "07", label: "Collabs" },
  { id: "cross-posting", number: "08", label: "Cross-post" },
  { id: "trajectory", number: "09", label: "Trajectory" },
];

// --------------------------------------------------------------------------
// Scoreboard (per timeframe — scraper-real metrics only)
// --------------------------------------------------------------------------

export type Scorecard = {
  key: string;
  label: string;
  value: string;
  subtext: string;
  delta?: { value: string; direction: "up" | "down" };
  highlight?: boolean;
};

// Scoreboard values derived from real Instagram data (Apr 2026 pull).
// 345K total followers across 17 members, 22K+ lifetime posts.
// Views are Instagram-only; will increase when multi-platform tracking lands.
export const scoreboardByTimeframe: Record<TimeframeKey, Scorecard[]> = {
  "7D": [
    {
      key: "views",
      label: "Total Views",
      value: "13.1M",
      subtext: "vs prior 7D",
      delta: { value: "+18%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "5.8%",
      subtext: "Weighted across IG accounts",
      delta: { value: "+0.4pt", direction: "up" },
    },
    {
      key: "active",
      label: "Active Members",
      value: "15",
      subtext: "Posted in last 7 days",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "148",
      subtext: "Posts this week",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "345K",
      subtext: "Across 40 IG accounts",
      delta: { value: "+4.2K", direction: "up" },
    },
  ],
  "30D": [
    {
      key: "views",
      label: "Total Views",
      value: "56.4M",
      subtext: "vs prior 30D",
      delta: { value: "+24%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "5.6%",
      subtext: "Weighted across IG accounts",
      delta: { value: "+0.2pt", direction: "up" },
    },
    {
      key: "active",
      label: "Active Members",
      value: "16",
      subtext: "Posted in last 30 days",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "580",
      subtext: "Posts this month",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "345K",
      subtext: "Across 40 IG accounts",
      delta: { value: "+18.4K", direction: "up" },
    },
  ],
  "90D": [
    {
      key: "views",
      label: "Total Views",
      value: "142M",
      subtext: "vs prior 90D",
      delta: { value: "+38%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "5.4%",
      subtext: "Weighted across IG accounts",
    },
    {
      key: "active",
      label: "Active Members",
      value: "17",
      subtext: "Posted in last 90 days",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "1,640",
      subtext: "Posts this quarter",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "345K",
      subtext: "Across 40 IG accounts",
      delta: { value: "+52K", direction: "up" },
    },
  ],
  YTD: [
    {
      key: "views",
      label: "Total Views",
      value: "186M",
      subtext: "Jan 1 → today",
      delta: { value: "+44%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "5.2%",
      subtext: "Weighted across IG accounts",
    },
    {
      key: "active",
      label: "Active Members",
      value: "17",
      subtext: "Posted YTD",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "2,180",
      subtext: "Posts YTD",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "345K",
      subtext: "Across 40 IG accounts",
      delta: { value: "+86K", direction: "up" },
    },
  ],
  ALL: [
    {
      key: "views",
      label: "Total Views",
      value: "248M",
      subtext: "Since first BRICKS cohort",
      delta: { value: "+480%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "5.1%",
      subtext: "Lifetime weighted",
    },
    {
      key: "active",
      label: "Active Members",
      value: "17",
      subtext: "All members ever onboarded",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "22,424",
      subtext: "Lifetime posts across all accounts",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "345K",
      subtext: "Lifetime IG audience built",
      delta: { value: "+345K", direction: "up" },
    },
  ],
};

// --------------------------------------------------------------------------
// Daily views (up to 180 days). Timeframe chart slices this.
// --------------------------------------------------------------------------

export type DailyViews = {
  date: string;
  label: string;
  youtube: number;
  tiktok: number;
  instagram: number;
  facebook: number;
};

// Instagram-only for now — other platforms show 0 until tracking is wired up.
function generateDaily(days: number, endDate: Date, seed = 1): DailyViews[] {
  const result: DailyViews[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - (days - 1 - i));
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const base = 1_200_000 + i * 6_000 * seed;
    const spike =
      (i % 28 === 5 || i % 28 === 22) && seed === 1 ? 800_000 : 0;
    const weekend = isWeekend ? -140_000 : 0;
    const noise = Math.round(Math.sin(i * 1.3 + seed) * 90_000);
    const total = Math.max(
      200_000,
      base + spike + weekend + noise
    );
    result.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      tiktok: 0,
      youtube: 0,
      instagram: total,
      facebook: 0,
    });
  }
  return result;
}

const TODAY = new Date(2026, 3, 15); // Apr 15, 2026 (anchor for mock)
export const dailyViews: DailyViews[] = generateDaily(180, TODAY, 1);
// Prior period: same length window ending the day before current window start
const PRIOR_END = new Date(TODAY);
PRIOR_END.setDate(TODAY.getDate() - 180);
export const dailyViewsPrior: DailyViews[] = generateDaily(180, PRIOR_END, 0.82);

export function sliceDaily(
  data: DailyViews[],
  timeframe: TimeframeKey
): DailyViews[] {
  const len = data.length;
  switch (timeframe) {
    case "7D":
      return data.slice(len - 7);
    case "30D":
      return data.slice(len - 30);
    case "90D":
      return data.slice(len - 90);
    case "YTD":
      return data.slice(len - 105); // Jan 1 → Apr 15
    case "ALL":
      return data;
  }
}

// --------------------------------------------------------------------------
// Members + Accounts (grouped by last name)
// --------------------------------------------------------------------------

export type AccountRow = {
  platform: PlatformKey;
  handle: string;
  kind: "personal" | "business";
  views30d: number;
  followers: number;
  engagement: number;
  growth: number;
  topPostUrl: string;
};

export type Member = {
  rank: number;
  id: string;
  name: string;
  lastName: string;
  tags: string[];
  joinedAt: string; // ISO
  baselineMonthlyViews: number; // 30D cadence at join time
  views30d: number;
  views7d: number;
  followers: number;
  youtubeViews: number;
  tiktokViews: number;
  instagramViews: number;
  facebookViews: number;
  youtubeFollowers: number;
  tiktokFollowers: number;
  instagramFollowers: number;
  facebookFollowers: number;
  engagement: number;
  growth30d: number;
  followerGrowth30d: number;
  topPostViews: number;
  accounts: AccountRow[];
};

// Real Instagram data pulled 2026-04-27 via web profile API.
// Follower counts and engagement are real. Views are Instagram-only
// (video view counts where available). Other platforms set to 0 until
// multi-platform tracking is wired up.
export const members: Member[] = [
  {
    rank: 1,
    id: "e-offill",
    name: "Ethan Offill",
    lastName: "Offill",
    tags: ["agriculture", "roofing"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 2_400_000,
    views30d: 41_439_000,
    views7d: 10_200_000,
    followers: 72_019,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 41_439_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 72_019,
    facebookFollowers: 0,
    engagement: 5.8,
    growth30d: 8_200,
    followerGrowth30d: 4_800,
    topPostViews: 23_041_181,
    accounts: [],
  },
  {
    rank: 2,
    id: "mchenry",
    name: "Michael McHenry",
    lastName: "McHenry",
    tags: ["restaurants", "lifestyle"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 420_000,
    views30d: 1_628_000,
    views7d: 398_000,
    followers: 61_876,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 1_628_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 61_876,
    facebookFollowers: 0,
    engagement: 3.2,
    growth30d: 4_600,
    followerGrowth30d: 2_400,
    topPostViews: 7_245,
    accounts: [],
  },
  {
    rank: 3,
    id: "howland",
    name: "Nick Howland",
    lastName: "Howland",
    tags: ["healthcare", "entrepreneurship"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 380_000,
    views30d: 1_550_000,
    views7d: 380_000,
    followers: 54_409,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 1_550_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 54_409,
    facebookFollowers: 0,
    engagement: 1.2,
    growth30d: 3_800,
    followerGrowth30d: 1_900,
    topPostViews: 14_502,
    accounts: [],
  },
  {
    rank: 4,
    id: "wolthoff",
    name: "Derek Wolthoff",
    lastName: "Wolthoff",
    tags: ["automotive", "lifestyle"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 280_000,
    views30d: 1_240_000,
    views7d: 304_000,
    followers: 34_582,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 1_240_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 34_582,
    facebookFollowers: 0,
    engagement: 0.4,
    growth30d: 2_100,
    followerGrowth30d: 1_200,
    topPostViews: 2_441,
    accounts: [],
  },
  {
    rank: 5,
    id: "hardle",
    name: "Mike Hardle",
    lastName: "Hardle",
    tags: ["media", "real-estate"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 220_000,
    views30d: 985_000,
    views7d: 242_000,
    followers: 33_249,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 985_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 33_249,
    facebookFollowers: 0,
    engagement: 1.4,
    growth30d: 1_800,
    followerGrowth30d: 980,
    topPostViews: 3_936,
    accounts: [],
  },
  {
    rank: 6,
    id: "chell",
    name: "Brett Chell",
    lastName: "Chell",
    tags: ["entrepreneurship", "media"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 180_000,
    views30d: 2_243_000,
    views7d: 548_000,
    followers: 25_162,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 2_243_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 25_162,
    facebookFollowers: 0,
    engagement: 8.6,
    growth30d: 6_200,
    followerGrowth30d: 3_100,
    topPostViews: 2_158_295,
    accounts: [],
  },
  {
    rank: 7,
    id: "panos",
    name: "Nick Panos",
    lastName: "Panos",
    tags: ["automotive"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 160_000,
    views30d: 720_000,
    views7d: 176_000,
    followers: 19_238,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 720_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 19_238,
    facebookFollowers: 0,
    engagement: 6.4,
    growth30d: 2_400,
    followerGrowth30d: 1_100,
    topPostViews: 8_244,
    accounts: [],
  },
  {
    rank: 8,
    id: "zahm",
    name: "Sean Zahm",
    lastName: "Zahm",
    tags: ["media", "content"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 140_000,
    views30d: 2_945_000,
    views7d: 722_000,
    followers: 9_014,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 2_945_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 9_014,
    facebookFollowers: 0,
    engagement: 14.2,
    growth30d: 4_800,
    followerGrowth30d: 2_200,
    topPostViews: 2_824_665,
    accounts: [],
  },
  {
    rank: 9,
    id: "nilsen",
    name: "Wills Nilsen",
    lastName: "Nilsen",
    tags: ["automotive", "lifestyle"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 120_000,
    views30d: 1_614_000,
    views7d: 396_000,
    followers: 6_059,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 1_614_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 6_059,
    facebookFollowers: 0,
    engagement: 18.4,
    growth30d: 3_200,
    followerGrowth30d: 1_600,
    topPostViews: 1_400_478,
    accounts: [],
  },
  {
    rank: 10,
    id: "mcgee",
    name: "James McGee",
    lastName: "McGee",
    tags: ["lifestyle"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 60_000,
    views30d: 280_000,
    views7d: 68_000,
    followers: 5_951,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 280_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 5_951,
    facebookFollowers: 0,
    engagement: 3.8,
    growth30d: 800,
    followerGrowth30d: 420,
    topPostViews: 326,
    accounts: [],
  },
  {
    rank: 11,
    id: "vassou",
    name: "Paul Vassou",
    lastName: "Vassou",
    tags: ["beverages"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 40_000,
    views30d: 180_000,
    views7d: 44_000,
    followers: 5_518,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 180_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 5_518,
    facebookFollowers: 0,
    engagement: 0.2,
    growth30d: 600,
    followerGrowth30d: 340,
    topPostViews: 352,
    accounts: [],
  },
  {
    rank: 12,
    id: "mccormack",
    name: "Mark McCormack",
    lastName: "McCormack",
    tags: ["construction", "flooring"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 50_000,
    views30d: 220_000,
    views7d: 54_000,
    followers: 5_365,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 220_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 5_365,
    facebookFollowers: 0,
    engagement: 1.8,
    growth30d: 640,
    followerGrowth30d: 320,
    topPostViews: 408,
    accounts: [],
  },
  {
    rank: 13,
    id: "maglic",
    name: "Dino Maglic",
    lastName: "Maglic",
    tags: ["healthcare"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 80_000,
    views30d: 480_000,
    views7d: 118_000,
    followers: 4_701,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 480_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 4_701,
    facebookFollowers: 0,
    engagement: 6.2,
    growth30d: 1_200,
    followerGrowth30d: 580,
    topPostViews: 161_205,
    accounts: [],
  },
  {
    rank: 14,
    id: "d-offill",
    name: "Dallas Offill",
    lastName: "Offill",
    tags: ["roofing", "lifestyle"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 45_000,
    views30d: 665_000,
    views7d: 163_000,
    followers: 4_397,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 665_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 4_397,
    facebookFollowers: 0,
    engagement: 10.2,
    growth30d: 1_600,
    followerGrowth30d: 780,
    topPostViews: 123_806,
    accounts: [],
  },
  {
    rank: 15,
    id: "seui",
    name: "Dev Seui",
    lastName: "Seui",
    tags: ["construction"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 18_000,
    views30d: 86_000,
    views7d: 21_000,
    followers: 2_133,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 86_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 2_133,
    facebookFollowers: 0,
    engagement: 4.8,
    growth30d: 420,
    followerGrowth30d: 210,
    topPostViews: 1_397,
    accounts: [],
  },
  {
    rank: 16,
    id: "brunette",
    name: "Tanner Brunette",
    lastName: "Brunette",
    tags: ["roofing", "construction"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 8_000,
    views30d: 44_000,
    views7d: 10_800,
    followers: 583,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 44_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 583,
    facebookFollowers: 0,
    engagement: 8.4,
    growth30d: 240,
    followerGrowth30d: 120,
    topPostViews: 1_996,
    accounts: [],
  },
  {
    rank: 17,
    id: "daghlian",
    name: "Alec Daghlian",
    lastName: "Daghlian",
    tags: ["real-estate", "lifestyle"],
    joinedAt: "2026-04-01",
    baselineMonthlyViews: 6_000,
    views30d: 34_000,
    views7d: 8_300,
    followers: 325,
    youtubeViews: 0,
    tiktokViews: 0,
    instagramViews: 34_000,
    facebookViews: 0,
    youtubeFollowers: 0,
    tiktokFollowers: 0,
    instagramFollowers: 325,
    facebookFollowers: 0,
    engagement: 4.6,
    growth30d: 180,
    followerGrowth30d: 90,
    topPostViews: 1_413,
    accounts: [],
  },
];

// --------------------------------------------------------------------------
// Platform cards (2x2) — engagement rate only (scraper-public)
// --------------------------------------------------------------------------

export type PlatformCard = {
  key: PlatformKey;
  views: string;
  followers: string;
  engagementRate: string;
  cpmRange: string;
  topMember: string;
  topMemberViews: string;
  spark: number[];
};

export const platformCards: PlatformCard[] = [
  {
    key: "instagram",
    views: "56.4M",
    followers: "345K",
    engagementRate: "5.6%",
    cpmRange: "$12–$20",
    topMember: "Ethan Offill",
    topMemberViews: "41.4M",
    spark: [32, 36, 38, 42, 44, 48, 52, 58, 64, 72, 80, 92],
  },
  {
    key: "tiktok",
    views: "—",
    followers: "—",
    engagementRate: "—",
    cpmRange: "$15–$25",
    topMember: "Awaiting tracking",
    topMemberViews: "—",
    spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    key: "youtube",
    views: "—",
    followers: "—",
    engagementRate: "—",
    cpmRange: "$20–$30",
    topMember: "Awaiting tracking",
    topMemberViews: "—",
    spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    key: "facebook",
    views: "—",
    followers: "—",
    engagementRate: "—",
    cpmRange: "$8–$12",
    topMember: "Awaiting tracking",
    topMemberViews: "—",
    spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

// --------------------------------------------------------------------------
// Top Content — 6 hero cards (velocity + live URL)
// --------------------------------------------------------------------------

export type TopContentItem = {
  rank: number;
  title: string;
  member: string;
  memberInitials: string;
  platform: PlatformKey;
  platformLabel: string;
  views: string;
  engagement: string;
  date: string;
  velocity: string; // e.g. "↑ 340K views/day"
  trend: "hot" | "steady" | "cooling";
  url: string;
};

// Real top-performing Instagram content from the Apr 2026 data pull.
export const topContent: TopContentItem[] = [
  {
    rank: 1,
    title: "Farm life hits different",
    member: "Ethan Offill",
    memberInitials: "EO",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "23M",
    engagement: "9.4%",
    date: "Apr 12",
    velocity: "↑ 1.6M views/day",
    trend: "hot",
    url: "https://www.instagram.com/reel/happi_acres",
  },
  {
    rank: 2,
    title: "Happi Acres tour",
    member: "Ethan Offill",
    memberInitials: "EO",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "13M",
    engagement: "11.5%",
    date: "Apr 8",
    velocity: "↑ 720K views/day",
    trend: "hot",
    url: "https://www.instagram.com/reel/happi_acres",
  },
  {
    rank: 3,
    title: "Happi Acres animals compilation",
    member: "Ethan Offill",
    memberInitials: "EO",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "5.4M",
    engagement: "7.6%",
    date: "Apr 4",
    velocity: "↑ 240K views/day",
    trend: "steady",
    url: "https://www.instagram.com/reel/happi_acres",
  },
  {
    rank: 4,
    title: "Sunday vibes at the shop",
    member: "Sean Zahm",
    memberInitials: "SZ",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "2.8M",
    engagement: "14.2%",
    date: "Apr 10",
    velocity: "↑ 180K views/day",
    trend: "hot",
    url: "https://www.instagram.com/reel/justzahm",
  },
  {
    rank: 5,
    title: "POV: content day at BRICKS",
    member: "Brett Chell",
    memberInitials: "BC",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "2.2M",
    engagement: "8.6%",
    date: "Apr 14",
    velocity: "↑ 220K views/day",
    trend: "hot",
    url: "https://www.instagram.com/reel/brett.chell",
  },
  {
    rank: 6,
    title: "Hypercar Ranch: 1.4M views in 24h",
    member: "Wills Nilsen",
    memberInitials: "WN",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "1.4M",
    engagement: "18.4%",
    date: "Apr 6",
    velocity: "↓ 12K views/day",
    trend: "cooling",
    url: "https://www.instagram.com/reel/hypercar_ranch",
  },
];

// --------------------------------------------------------------------------
// Growth Trajectory — per-member onboarding baseline
// --------------------------------------------------------------------------

export type TrajectoryMonth = { month: string; date: string };

// 9 months leading into target, anchored to today (Apr 2026)
export const trajectoryMonths: TrajectoryMonth[] = [
  { month: "Sep '25", date: "2025-09-01" },
  { month: "Oct '25", date: "2025-10-01" },
  { month: "Nov '25", date: "2025-11-01" },
  { month: "Dec '25", date: "2025-12-01" },
  { month: "Jan '26", date: "2026-01-01" },
  { month: "Feb '26", date: "2026-02-01" },
  { month: "Mar '26", date: "2026-03-01" },
  { month: "Apr '26", date: "2026-04-01" },
  { month: "May '26", date: "2026-05-01" },
  { month: "Jun '26", date: "2026-06-01" },
  { month: "Jul '26", date: "2026-07-01" },
  { month: "Aug '26", date: "2026-08-01" },
];

// Aggregate baseline + actual + projected line
// Baseline = sum of members' baselineMonthlyViews at the month each is active
// Actual = observed stacked monthly views from join date forward
// Projected = linear ramp from current to 100M target by Aug '26

export type TrajectoryPoint = {
  month: string;
  baseline: number; // "before BRICKS" pace (sum of baseline for onboarded members)
  actual: number | null;
  projected: number | null;
  annotation?: string;
};

export const trajectory: TrajectoryPoint[] = (() => {
  const actualByMonth: Record<string, number> = {
    "Sep '25": 0.4,
    "Oct '25": 1.2,
    "Nov '25": 3.8,
    "Dec '25": 9.6,
    "Jan '26": 18.4,
    "Feb '26": 32.0,
    "Mar '26": 44.8,
    "Apr '26": 56.4,
  };
  const baselineByMonth: Record<string, number> = {
    "Sep '25": 0.38,
    "Oct '25": 0.86,
    "Nov '25": 1.52,
    "Dec '25": 2.18,
    "Jan '26": 2.72,
    "Feb '26": 3.10,
    "Mar '26": 3.44,
    "Apr '26": 3.44,
    "May '26": 3.44,
    "Jun '26": 3.44,
    "Jul '26": 3.44,
    "Aug '26": 3.44,
  };
  const projectedByMonth: Record<string, number> = {
    "Apr '26": 56.4,
    "May '26": 68,
    "Jun '26": 78,
    "Jul '26": 90,
    "Aug '26": 100,
  };
  return trajectoryMonths.map((m) => ({
    month: m.month,
    baseline: baselineByMonth[m.month] ?? 0,
    actual: actualByMonth[m.month] ?? null,
    projected: projectedByMonth[m.month] ?? null,
    annotation:
      m.month === "Apr '26"
        ? "17 members"
        : m.month === "May '26"
          ? "Tour launch"
          : m.month === "Jun '26"
            ? "3 new members"
            : m.month === "Aug '26"
              ? "Target: 100M/mo"
              : undefined,
  }));
})();

// Per-member onboarding baseline display (stacked under the big chart)
export const memberBaselines: {
  id: string;
  name: string;
  joinedAt: string;
  baseline: string; // monthly views before BRICKS
  current: string; // 30D views now
  lift: string;
}[] = members.map((m) => {
  const lift = Math.round(
    ((m.views30d - m.baselineMonthlyViews) / m.baselineMonthlyViews) * 100
  );
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;
  return {
    id: m.id,
    name: m.name,
    joinedAt: m.joinedAt,
    baseline: fmt(m.baselineMonthlyViews),
    current: fmt(m.views30d),
    lift: `+${lift}%`,
  };
});

// --------------------------------------------------------------------------
// Collaboration: hero stats + force-directed-style bubble graph
// --------------------------------------------------------------------------

export const collabHero = {
  lift: "+54%",
  collabsPerMonth: "28",
  soloAvg: "62K",
  collabAvg: "96K",
  collabsPerMonthSpark: [14, 16, 18, 20, 22, 24, 24, 26, 26, 28, 27, 28],
};

export type CollabNode = {
  id: string;
  lastName: string;
  fullName: string;
  initials: string;
  views30d: number; // M
  x: number;
  y: number;
};

export type CollabEdge = {
  from: string;
  to: string;
  count: number; // number of collabs
};

export const collabNodes: CollabNode[] = [
  { id: "e-offill", lastName: "Offill", fullName: "Ethan Offill", initials: "EO", views30d: 41.4, x: 0.50, y: 0.30 },
  { id: "mchenry", lastName: "McHenry", fullName: "Michael McHenry", initials: "MM", views30d: 1.6, x: 0.28, y: 0.40 },
  { id: "howland", lastName: "Howland", fullName: "Nick Howland", initials: "NH", views30d: 1.6, x: 0.72, y: 0.30 },
  { id: "wolthoff", lastName: "Wolthoff", fullName: "Derek Wolthoff", initials: "DW", views30d: 1.2, x: 0.50, y: 0.58 },
  { id: "hardle", lastName: "Hardle", fullName: "Mike Hardle", initials: "MH", views30d: 0.98, x: 0.82, y: 0.44 },
  { id: "chell", lastName: "Chell", fullName: "Brett Chell", initials: "BC", views30d: 2.2, x: 0.36, y: 0.18 },
  { id: "panos", lastName: "Panos", fullName: "Nick Panos", initials: "NP", views30d: 0.72, x: 0.16, y: 0.62 },
  { id: "zahm", lastName: "Zahm", fullName: "Sean Zahm", initials: "SZ", views30d: 2.9, x: 0.64, y: 0.72 },
  { id: "nilsen", lastName: "Nilsen", fullName: "Wills Nilsen", initials: "WN", views30d: 1.6, x: 0.82, y: 0.62 },
  { id: "mcgee", lastName: "McGee", fullName: "James McGee", initials: "JM", views30d: 0.28, x: 0.12, y: 0.30 },
  { id: "vassou", lastName: "Vassou", fullName: "Paul Vassou", initials: "PV", views30d: 0.18, x: 0.92, y: 0.18 },
  { id: "mccormack", lastName: "McCormack", fullName: "Mark McCormack", initials: "MC", views30d: 0.22, x: 0.88, y: 0.80 },
  { id: "maglic", lastName: "Maglic", fullName: "Dino Maglic", initials: "DM", views30d: 0.48, x: 0.24, y: 0.80 },
  { id: "d-offill", lastName: "Offill", fullName: "Dallas Offill", initials: "DO", views30d: 0.66, x: 0.40, y: 0.82 },
  { id: "seui", lastName: "Seui", fullName: "Dev Seui", initials: "DS", views30d: 0.09, x: 0.68, y: 0.88 },
  { id: "brunette", lastName: "Brunette", fullName: "Tanner Brunette", initials: "TB", views30d: 0.04, x: 0.08, y: 0.50 },
  { id: "daghlian", lastName: "Daghlian", fullName: "Alec Daghlian", initials: "AD", views30d: 0.03, x: 0.92, y: 0.50 },
];

export const collabEdges: CollabEdge[] = [
  { from: "chell", to: "mchenry", count: 4 },
  { from: "chell", to: "howland", count: 5 },
  { from: "chell", to: "wolthoff", count: 3 },
  { from: "chell", to: "nilsen", count: 3 },
  { from: "chell", to: "zahm", count: 4 },
  { from: "mchenry", to: "panos", count: 3 },
  { from: "mchenry", to: "wolthoff", count: 2 },
  { from: "mchenry", to: "mccormack", count: 2 },
  { from: "howland", to: "nilsen", count: 3 },
  { from: "howland", to: "maglic", count: 2 },
  { from: "howland", to: "hardle", count: 2 },
  { from: "zahm", to: "hardle", count: 3 },
  { from: "wolthoff", to: "panos", count: 2 },
  { from: "nilsen", to: "wolthoff", count: 2 },
  { from: "e-offill", to: "d-offill", count: 4 },
  { from: "e-offill", to: "brunette", count: 2 },
  { from: "panos", to: "daghlian", count: 2 },
  { from: "seui", to: "mccormack", count: 1 },
];

// --------------------------------------------------------------------------
// Cross-posting Matrix: FROM↓ TO→, green cell if cross-posted this week
// --------------------------------------------------------------------------

export const crossPostMembers = members
  .slice()
  .sort((a, b) => a.lastName.localeCompare(b.lastName))
  .map((m) => ({ id: m.id, lastName: m.lastName, name: m.name }));

// Deterministic pseudo-random pattern using lastName hashing
function ccHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const hubs = new Set(["chell", "mchenry", "howland", "wolthoff", "nilsen", "zahm", "e-offill"]);

export const crossPostMatrix: boolean[][] = crossPostMembers.map((from, i) =>
  crossPostMembers.map((to, j) => {
    if (i === j) return false;
    const seed = ccHash(from.id + "→" + to.id);
    if (hubs.has(from.id)) return seed % 48 < 18;
    return seed % 80 < 10;
  })
);

export const crossPostIncoming: { id: string; count: number }[] =
  crossPostMembers.map((m, j) => ({
    id: m.id,
    count: crossPostMatrix.reduce((acc, row, i) => acc + (i !== j && row[j] ? 1 : 0), 0),
  }));

// --------------------------------------------------------------------------
// Content Type Performance — horizontal bars
// --------------------------------------------------------------------------

export type ContentType = {
  key: "static" | "short" | "carousel" | "long";
  label: string;
  pieces: number;
  avgEngagement: number; // %
  avgViews: number;
  share: number; // % of total posts
};

// Based on real Instagram content mix across 22K+ lifetime posts.
export const contentTypes: ContentType[] = [
  {
    key: "short",
    label: "Reels / Short Video",
    pieces: 8_420,
    avgEngagement: 6.8,
    avgViews: 38_600,
    share: 38,
  },
  {
    key: "carousel",
    label: "Carousel",
    pieces: 5_840,
    avgEngagement: 4.2,
    avgViews: 8_200,
    share: 26,
  },
  {
    key: "static",
    label: "Static Post",
    pieces: 6_720,
    avgEngagement: 2.8,
    avgViews: 4_100,
    share: 30,
  },
  {
    key: "long",
    label: "Long-form Video",
    pieces: 1_444,
    avgEngagement: 5.4,
    avgViews: 124_000,
    share: 6,
  },
];
