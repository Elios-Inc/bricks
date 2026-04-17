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

export const scoreboardByTimeframe: Record<TimeframeKey, Scorecard[]> = {
  "7D": [
    {
      key: "views",
      label: "Total Views",
      value: "7.4M",
      subtext: "vs prior 7D",
      delta: { value: "+22%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "4.9%",
      subtext: "Weighted across all accounts",
      delta: { value: "+0.3pt", direction: "up" },
    },
    {
      key: "active",
      label: "Active Members",
      value: "12",
      subtext: "Posted in last 7 days",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "204",
      subtext: "Posts this week",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "2.4M",
      subtext: "Across all accounts",
      delta: { value: "+42K", direction: "up" },
    },
  ],
  "30D": [
    {
      key: "views",
      label: "Total Views",
      value: "31.2M",
      subtext: "vs prior 30D",
      delta: { value: "+18%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "4.7%",
      subtext: "Weighted across all accounts",
      delta: { value: "+0.2pt", direction: "up" },
    },
    {
      key: "active",
      label: "Active Members",
      value: "13",
      subtext: "Posted in last 30 days",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "762",
      subtext: "Posts this month",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "2.36M",
      subtext: "Across all accounts",
      delta: { value: "+184K", direction: "up" },
    },
  ],
  "90D": [
    {
      key: "views",
      label: "Total Views",
      value: "84.6M",
      subtext: "vs prior 90D",
      delta: { value: "+34%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "4.5%",
      subtext: "Weighted across all accounts",
    },
    {
      key: "active",
      label: "Active Members",
      value: "14",
      subtext: "Posted in last 90 days",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "2,108",
      subtext: "Posts this quarter",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "2.18M",
      subtext: "Across all accounts",
      delta: { value: "+512K", direction: "up" },
    },
  ],
  YTD: [
    {
      key: "views",
      label: "Total Views",
      value: "108.4M",
      subtext: "Jan 1 → today",
      delta: { value: "+41%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "4.4%",
      subtext: "Weighted across all accounts",
    },
    {
      key: "active",
      label: "Active Members",
      value: "14",
      subtext: "Posted YTD",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "2,684",
      subtext: "Posts YTD",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "1.72M",
      subtext: "Across all accounts",
      delta: { value: "+684K", direction: "up" },
    },
  ],
  ALL: [
    {
      key: "views",
      label: "Total Views",
      value: "186.2M",
      subtext: "Since first BRICKS cohort",
      delta: { value: "+612%", direction: "up" },
    },
    {
      key: "engagement",
      label: "Avg Engagement",
      value: "4.3%",
      subtext: "Lifetime weighted",
    },
    {
      key: "active",
      label: "Active Members",
      value: "14",
      subtext: "All members ever onboarded",
    },
    {
      key: "pieces",
      label: "Content Pieces",
      value: "6,204",
      subtext: "Lifetime posts",
    },
    {
      key: "followers",
      label: "Total Followers",
      value: "2.4M",
      subtext: "Lifetime audience built",
      delta: { value: "+2.4M", direction: "up" },
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

function generateDaily(days: number, endDate: Date, seed = 1): DailyViews[] {
  const result: DailyViews[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - (days - 1 - i));
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    // Compounding growth across the window
    const base = 600_000 + i * 4_500 * seed;
    const spike =
      (i % 28 === 5 || i % 28 === 22) && seed === 1 ? 380_000 : 0;
    const weekend = isWeekend ? -80_000 : 0;
    const noise = Math.round(Math.sin(i * 1.3 + seed) * 52_000);
    const total = Math.max(
      120_000,
      base + spike + weekend + noise
    );
    result.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      tiktok: Math.round(total * 0.4),
      youtube: Math.round(total * 0.3),
      instagram: Math.round(total * 0.2),
      facebook: Math.round(total * 0.1),
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

export const members: Member[] = [
  {
    rank: 1,
    id: "mchenry",
    name: "Michael McHenry",
    lastName: "McHenry",
    tags: ["fitness", "lifestyle"],
    joinedAt: "2025-10-12",
    baselineMonthlyViews: 1_200_000,
    views30d: 4_800_000,
    views7d: 1_180_000,
    followers: 412_000,
    youtubeViews: 1_900_000,
    tiktokViews: 1_600_000,
    instagramViews: 980_000,
    facebookViews: 320_000,
    youtubeFollowers: 142_000,
    tiktokFollowers: 186_000,
    instagramFollowers: 58_000,
    facebookFollowers: 26_000,
    engagement: 4.6,
    growth30d: 12_400,
    followerGrowth30d: 38_400,
    topPostViews: 892_000,
    accounts: [],
  },
  {
    rank: 2,
    id: "howland",
    name: "Nicholas Howland",
    lastName: "Howland",
    tags: ["entrepreneurship"],
    joinedAt: "2025-11-02",
    baselineMonthlyViews: 680_000,
    views30d: 4_200_000,
    views7d: 1_020_000,
    followers: 338_000,
    youtubeViews: 2_100_000,
    tiktokViews: 1_100_000,
    instagramViews: 710_000,
    facebookViews: 290_000,
    youtubeFollowers: 168_000,
    tiktokFollowers: 102_000,
    instagramFollowers: 48_000,
    facebookFollowers: 20_000,
    engagement: 4.8,
    growth30d: 8_200,
    followerGrowth30d: 24_100,
    topPostViews: 614_000,
    accounts: [],
  },
  {
    rank: 3,
    id: "woltoff",
    name: "Derek Woltoff",
    lastName: "Woltoff",
    tags: ["automotive", "lifestyle"],
    joinedAt: "2025-11-20",
    baselineMonthlyViews: 520_000,
    views30d: 3_600_000,
    views7d: 880_000,
    followers: 268_000,
    youtubeViews: 890_000,
    tiktokViews: 1_800_000,
    instagramViews: 640_000,
    facebookViews: 270_000,
    youtubeFollowers: 62_000,
    tiktokFollowers: 138_000,
    instagramFollowers: 44_000,
    facebookFollowers: 24_000,
    engagement: 3.3,
    growth30d: 6_800,
    followerGrowth30d: 18_600,
    topPostViews: 523_000,
    accounts: [],
  },
  {
    rank: 4,
    id: "nilsen",
    name: "William Nilsen",
    lastName: "Nilsen",
    tags: ["entrepreneurship", "tech"],
    joinedAt: "2025-12-05",
    baselineMonthlyViews: 340_000,
    views30d: 3_100_000,
    views7d: 760_000,
    followers: 224_000,
    youtubeViews: 1_200_000,
    tiktokViews: 1_000_000,
    instagramViews: 620_000,
    facebookViews: 280_000,
    youtubeFollowers: 96_000,
    tiktokFollowers: 78_000,
    instagramFollowers: 34_000,
    facebookFollowers: 16_000,
    engagement: 5.6,
    growth30d: 9_100,
    followerGrowth30d: 22_800,
    topPostViews: 468_000,
    accounts: [],
  },
  {
    rank: 5,
    id: "chell",
    name: "Brett Chell",
    lastName: "Chell",
    tags: ["entrepreneurship", "automotive"],
    joinedAt: "2025-09-18",
    baselineMonthlyViews: 480_000,
    views30d: 2_800_000,
    views7d: 680_000,
    followers: 512_000,
    youtubeViews: 680_000,
    tiktokViews: 1_400_000,
    instagramViews: 510_000,
    facebookViews: 210_000,
    youtubeFollowers: 154_400,
    tiktokFollowers: 304_000,
    instagramFollowers: 106_200,
    facebookFollowers: 47_400,
    engagement: 6.8,
    growth30d: 11_300,
    followerGrowth30d: 32_600,
    topPostViews: 445_000,
    accounts: [
      {
        platform: "youtube",
        handle: "@brettchell",
        kind: "personal",
        views30d: 480_000,
        followers: 142_000,
        engagement: 7.1,
        growth: 3_200,
        topPostUrl: "https://youtube.com/@brettchell",
      },
      {
        platform: "tiktok",
        handle: "@brettchell",
        kind: "personal",
        views30d: 1_100_000,
        followers: 286_000,
        engagement: 6.4,
        growth: 5_800,
        topPostUrl: "https://tiktok.com/@brettchell",
      },
      {
        platform: "instagram",
        handle: "@brett.chell",
        kind: "personal",
        views30d: 380_000,
        followers: 98_000,
        engagement: 7.8,
        growth: 1_600,
        topPostUrl: "https://instagram.com/brett.chell",
      },
      {
        platform: "facebook",
        handle: "@BrettChellOfficial",
        kind: "personal",
        views30d: 160_000,
        followers: 44_000,
        engagement: 5.2,
        growth: 400,
        topPostUrl: "https://facebook.com/BrettChellOfficial",
      },
      {
        platform: "youtube",
        handle: "@bricks_slc",
        kind: "business",
        views30d: 200_000,
        followers: 12_400,
        engagement: 5.8,
        growth: 300,
        topPostUrl: "https://youtube.com/@bricks_slc",
      },
      {
        platform: "tiktok",
        handle: "@bricks_slc",
        kind: "business",
        views30d: 300_000,
        followers: 18_000,
        engagement: 4.1,
        growth: 200,
        topPostUrl: "https://tiktok.com/@bricks_slc",
      },
      {
        platform: "instagram",
        handle: "@bricks_corner",
        kind: "business",
        views30d: 130_000,
        followers: 8_200,
        engagement: 4.6,
        growth: 100,
        topPostUrl: "https://instagram.com/bricks_corner",
      },
      {
        platform: "facebook",
        handle: "@bricksslc",
        kind: "business",
        views30d: 50_000,
        followers: 3_400,
        engagement: 3.8,
        growth: 50,
        topPostUrl: "https://facebook.com/bricksslc",
      },
    ],
  },
  {
    rank: 6,
    id: "panos",
    name: "Nick Panos",
    lastName: "Panos",
    tags: ["fitness", "lifestyle"],
    joinedAt: "2025-12-18",
    baselineMonthlyViews: 290_000,
    views30d: 2_500_000,
    views7d: 610_000,
    followers: 196_000,
    youtubeViews: 720_000,
    tiktokViews: 1_100_000,
    instagramViews: 480_000,
    facebookViews: 200_000,
    youtubeFollowers: 52_000,
    tiktokFollowers: 88_000,
    instagramFollowers: 38_000,
    facebookFollowers: 18_000,
    engagement: 5.1,
    growth30d: 7_600,
    followerGrowth30d: 14_900,
    topPostViews: 387_000,
    accounts: [],
  },
  {
    rank: 7,
    id: "burnette",
    name: "Tanner Burnette",
    lastName: "Burnette",
    tags: ["entrepreneurship"],
    joinedAt: "2026-01-08",
    baselineMonthlyViews: 180_000,
    views30d: 2_200_000,
    views7d: 540_000,
    followers: 168_000,
    youtubeViews: 540_000,
    tiktokViews: 980_000,
    instagramViews: 460_000,
    facebookViews: 220_000,
    youtubeFollowers: 42_000,
    tiktokFollowers: 78_000,
    instagramFollowers: 32_000,
    facebookFollowers: 16_000,
    engagement: 4.1,
    growth30d: 5_400,
    followerGrowth30d: 12_600,
    topPostViews: 341_000,
    accounts: [],
  },
  {
    rank: 8,
    id: "nevarez",
    name: "Fernando Nevarez",
    lastName: "Nevarez",
    tags: ["lifestyle", "content"],
    joinedAt: "2026-01-22",
    baselineMonthlyViews: 120_000,
    views30d: 1_900_000,
    views7d: 460_000,
    followers: 142_000,
    youtubeViews: 480_000,
    tiktokViews: 820_000,
    instagramViews: 410_000,
    facebookViews: 190_000,
    youtubeFollowers: 36_000,
    tiktokFollowers: 66_000,
    instagramFollowers: 28_000,
    facebookFollowers: 12_000,
    engagement: 4.4,
    growth30d: 4_200,
    followerGrowth30d: 10_800,
    topPostViews: 298_000,
    accounts: [],
  },
  {
    rank: 9,
    id: "daghlian",
    name: "Alec Daghlian",
    lastName: "Daghlian",
    tags: ["lifestyle"],
    joinedAt: "2026-02-04",
    baselineMonthlyViews: 90_000,
    views30d: 1_600_000,
    views7d: 390_000,
    followers: 118_000,
    youtubeViews: 390_000,
    tiktokViews: 710_000,
    instagramViews: 340_000,
    facebookViews: 160_000,
    youtubeFollowers: 28_000,
    tiktokFollowers: 56_000,
    instagramFollowers: 24_000,
    facebookFollowers: 10_000,
    engagement: 3.7,
    growth30d: 3_800,
    followerGrowth30d: 8_900,
    topPostViews: 256_000,
    accounts: [],
  },
  {
    rank: 10,
    id: "mccormack",
    name: "Mark McCormack",
    lastName: "McCormack",
    tags: ["fitness"],
    joinedAt: "2026-01-28",
    baselineMonthlyViews: 210_000,
    views30d: 1_400_000,
    views7d: 340_000,
    followers: 102_000,
    youtubeViews: 360_000,
    tiktokViews: 580_000,
    instagramViews: 310_000,
    facebookViews: 150_000,
    youtubeFollowers: 24_000,
    tiktokFollowers: 48_000,
    instagramFollowers: 20_000,
    facebookFollowers: 10_000,
    engagement: 6.0,
    growth30d: 4_600,
    followerGrowth30d: 9_400,
    topPostViews: 224_000,
    accounts: [],
  },
  {
    rank: 11,
    id: "offill",
    name: "Dallas Offill",
    lastName: "Offill",
    tags: ["lifestyle"],
    joinedAt: "2026-02-14",
    baselineMonthlyViews: 85_000,
    views30d: 1_200_000,
    views7d: 290_000,
    followers: 84_000,
    youtubeViews: 310_000,
    tiktokViews: 490_000,
    instagramViews: 280_000,
    facebookViews: 120_000,
    youtubeFollowers: 20_000,
    tiktokFollowers: 38_000,
    instagramFollowers: 18_000,
    facebookFollowers: 8_000,
    engagement: 3.0,
    growth30d: 2_900,
    followerGrowth30d: 6_800,
    topPostViews: 198_000,
    accounts: [],
  },
  {
    rank: 12,
    id: "droubay",
    name: "Megan Droubay",
    lastName: "Droubay",
    tags: ["lifestyle", "wellness"],
    joinedAt: "2026-02-26",
    baselineMonthlyViews: 62_000,
    views30d: 980_000,
    views7d: 240_000,
    followers: 72_000,
    youtubeViews: 240_000,
    tiktokViews: 420_000,
    instagramViews: 230_000,
    facebookViews: 90_000,
    youtubeFollowers: 16_000,
    tiktokFollowers: 34_000,
    instagramFollowers: 16_000,
    facebookFollowers: 6_000,
    engagement: 5.2,
    growth30d: 3_100,
    followerGrowth30d: 5_900,
    topPostViews: 167_000,
    accounts: [],
  },
  {
    rank: 13,
    id: "seui",
    name: "Dev Seui",
    lastName: "Seui",
    tags: ["tech", "entrepreneurship"],
    joinedAt: "2026-03-12",
    baselineMonthlyViews: 40_000,
    views30d: 520_000,
    views7d: 130_000,
    followers: 42_000,
    youtubeViews: 130_000,
    tiktokViews: 210_000,
    instagramViews: 120_000,
    facebookViews: 60_000,
    youtubeFollowers: 10_000,
    tiktokFollowers: 20_000,
    instagramFollowers: 8_000,
    facebookFollowers: 4_000,
    engagement: 3.6,
    growth30d: 1_800,
    followerGrowth30d: 3_400,
    topPostViews: 89_000,
    accounts: [],
  },
  {
    rank: 14,
    id: "mages",
    name: "Joshua Mages",
    lastName: "Mages",
    tags: ["lifestyle"],
    joinedAt: "2026-03-22",
    baselineMonthlyViews: 28_000,
    views30d: 380_000,
    views7d: 96_000,
    followers: 30_000,
    youtubeViews: 95_000,
    tiktokViews: 160_000,
    instagramViews: 85_000,
    facebookViews: 40_000,
    youtubeFollowers: 7_000,
    tiktokFollowers: 14_000,
    instagramFollowers: 6_000,
    facebookFollowers: 3_000,
    engagement: 4.3,
    growth30d: 1_200,
    followerGrowth30d: 2_100,
    topPostViews: 72_000,
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
    key: "tiktok",
    views: "12.4M",
    followers: "862K",
    engagementRate: "5.4%",
    cpmRange: "$15–$25",
    topMember: "Derek Woltoff",
    topMemberViews: "1.8M",
    spark: [25, 28, 30, 34, 40, 46, 54, 60, 68, 76, 84, 92],
  },
  {
    key: "youtube",
    views: "9.3M",
    followers: "482K",
    engagementRate: "4.9%",
    cpmRange: "$20–$30",
    topMember: "Nicholas Howland",
    topMemberViews: "2.1M",
    spark: [30, 34, 31, 38, 42, 44, 46, 48, 52, 55, 58, 62],
  },
  {
    key: "instagram",
    views: "7.2M",
    followers: "620K",
    engagementRate: "4.1%",
    cpmRange: "$12–$20",
    topMember: "Michael McHenry",
    topMemberViews: "980K",
    spark: [42, 44, 43, 45, 46, 44, 47, 48, 46, 48, 49, 50],
  },
  {
    key: "facebook",
    views: "2.3M",
    followers: "440K",
    engagementRate: "1.2%",
    cpmRange: "$8–$12",
    topMember: "Michael McHenry",
    topMemberViews: "320K",
    spark: [30, 32, 31, 30, 33, 32, 31, 32, 33, 32, 31, 33],
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

export const topContent: TopContentItem[] = [
  {
    rank: 1,
    title: "SLC Warehouse Tour: the BRICKS origin story",
    member: "Michael McHenry",
    memberInitials: "MM",
    platform: "tiktok",
    platformLabel: "TikTok",
    views: "892K",
    engagement: "7.2%",
    date: "Apr 6",
    velocity: "↑ 62K views/day",
    trend: "hot",
    url: "https://www.tiktok.com/@mchenrymike",
  },
  {
    rank: 2,
    title: "Why I left corporate to build in Utah",
    member: "Nicholas Howland",
    memberInitials: "NH",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "614K",
    engagement: "5.1%",
    date: "Apr 2",
    velocity: "↑ 18K views/day",
    trend: "steady",
    url: "https://www.youtube.com/@howlandmedia",
  },
  {
    rank: 3,
    title: "Morning routine at the BRICKS corner",
    member: "Derek Woltoff",
    memberInitials: "DW",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "523K",
    engagement: "4.6%",
    date: "Mar 29",
    velocity: "↓ 4K views/day",
    trend: "cooling",
    url: "https://www.instagram.com/derekwoltoff",
  },
  {
    rank: 4,
    title: "Building a brand in Utah: one year in",
    member: "William Nilsen",
    memberInitials: "WN",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "468K",
    engagement: "6.2%",
    date: "Apr 4",
    velocity: "↑ 11K views/day",
    trend: "steady",
    url: "https://www.youtube.com/@williamnilsen",
  },
  {
    rank: 5,
    title: "Cars & Coffee recap (9 min)",
    member: "Brett Chell",
    memberInitials: "BC",
    platform: "tiktok",
    platformLabel: "TikTok",
    views: "445K",
    engagement: "8.4%",
    date: "Apr 7",
    velocity: "↑ 48K views/day",
    trend: "hot",
    url: "https://www.tiktok.com/@brettchell",
  },
  {
    rank: 6,
    title: "Founder Q&A: the honest answer on funding",
    member: "Brett Chell",
    memberInitials: "BC",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "398K",
    engagement: "9.1%",
    date: "Mar 24",
    velocity: "↓ 2K views/day",
    trend: "cooling",
    url: "https://www.youtube.com/@brettchell",
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
  // Hand-tuned actuals so the story reads cleanly
  const actualByMonth: Record<string, number> = {
    "Sep '25": 0.5, // M
    "Oct '25": 1.4,
    "Nov '25": 3.6,
    "Dec '25": 8.2,
    "Jan '26": 14.8,
    "Feb '26": 21.6,
    "Mar '26": 27.4,
    "Apr '26": 31.2,
  };
  const baselineByMonth: Record<string, number> = {
    "Sep '25": 0.48,
    "Oct '25": 1.68,
    "Nov '25": 2.2,
    "Dec '25": 3.06,
    "Jan '26": 3.43,
    "Feb '26": 3.74,
    "Mar '26": 4.2,
    "Apr '26": 4.2,
    "May '26": 4.2,
    "Jun '26": 4.2,
    "Jul '26": 4.2,
    "Aug '26": 4.2,
  };
  const projectedByMonth: Record<string, number> = {
    "Apr '26": 31.2,
    "May '26": 44,
    "Jun '26": 62,
    "Jul '26": 82,
    "Aug '26": 100,
  };
  return trajectoryMonths.map((m) => ({
    month: m.month,
    baseline: baselineByMonth[m.month] ?? 0,
    actual: actualByMonth[m.month] ?? null,
    projected: projectedByMonth[m.month] ?? null,
    annotation:
      m.month === "Apr '26"
        ? "14 members"
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
  lift: "+69%",
  collabsPerMonth: "34",
  soloAvg: "78K",
  collabAvg: "132K",
  collabsPerMonthSpark: [18, 22, 24, 27, 26, 28, 30, 31, 33, 32, 34, 34],
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
  { id: "mchenry", lastName: "McHenry", fullName: "Michael McHenry", initials: "MM", views30d: 4.8, x: 0.28, y: 0.4 },
  { id: "howland", lastName: "Howland", fullName: "Nicholas Howland", initials: "NH", views30d: 4.2, x: 0.72, y: 0.3 },
  { id: "woltoff", lastName: "Woltoff", fullName: "Derek Woltoff", initials: "DW", views30d: 3.6, x: 0.5, y: 0.62 },
  { id: "nilsen", lastName: "Nilsen", fullName: "William Nilsen", initials: "WN", views30d: 3.1, x: 0.82, y: 0.58 },
  { id: "chell", lastName: "Chell", fullName: "Brett Chell", initials: "BC", views30d: 2.8, x: 0.5, y: 0.3 },
  { id: "panos", lastName: "Panos", fullName: "Nick Panos", initials: "NP", views30d: 2.5, x: 0.16, y: 0.62 },
  { id: "burnette", lastName: "Burnette", fullName: "Tanner Burnette", initials: "TB", views30d: 2.2, x: 0.64, y: 0.78 },
  { id: "nevarez", lastName: "Nevarez", fullName: "Fernando Nevarez", initials: "FN", views30d: 1.9, x: 0.36, y: 0.78 },
  { id: "daghlian", lastName: "Daghlian", fullName: "Alec Daghlian", initials: "AD", views30d: 1.6, x: 0.12, y: 0.3 },
  { id: "mccormack", lastName: "McCormack", fullName: "Mark McCormack", initials: "MC", views30d: 1.4, x: 0.88, y: 0.78 },
  { id: "offill", lastName: "Offill", fullName: "Dallas Offill", initials: "DO", views30d: 1.2, x: 0.24, y: 0.15 },
  { id: "droubay", lastName: "Droubay", fullName: "Megan Droubay", initials: "MD", views30d: 0.98, x: 0.76, y: 0.82 },
  { id: "seui", lastName: "Seui", fullName: "Dev Seui", initials: "DS", views30d: 0.52, x: 0.92, y: 0.18 },
  { id: "mages", lastName: "Mages", fullName: "Joshua Mages", initials: "JM", views30d: 0.38, x: 0.08, y: 0.82 },
];

export const collabEdges: CollabEdge[] = [
  { from: "chell", to: "mchenry", count: 4 },
  { from: "chell", to: "howland", count: 5 },
  { from: "chell", to: "woltoff", count: 3 },
  { from: "chell", to: "nilsen", count: 3 },
  { from: "chell", to: "burnette", count: 2 },
  { from: "mchenry", to: "panos", count: 4 },
  { from: "mchenry", to: "woltoff", count: 2 },
  { from: "mchenry", to: "mccormack", count: 3 },
  { from: "howland", to: "nilsen", count: 4 },
  { from: "howland", to: "burnette", count: 2 },
  { from: "howland", to: "seui", count: 2 },
  { from: "woltoff", to: "nevarez", count: 2 },
  { from: "woltoff", to: "burnette", count: 2 },
  { from: "nilsen", to: "seui", count: 3 },
  { from: "panos", to: "mccormack", count: 3 },
  { from: "panos", to: "daghlian", count: 2 },
  { from: "nevarez", to: "daghlian", count: 2 },
  { from: "droubay", to: "mccormack", count: 1 },
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

const hubs = new Set(["chell", "mchenry", "howland", "woltoff", "nilsen"]);

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

export const contentTypes: ContentType[] = [
  {
    key: "short",
    label: "Short-form Video",
    pieces: 512,
    avgEngagement: 5.6,
    avgViews: 42_800,
    share: 60,
  },
  {
    key: "carousel",
    label: "Carousel",
    pieces: 162,
    avgEngagement: 6.2,
    avgViews: 28_400,
    share: 19,
  },
  {
    key: "static",
    label: "Static Post",
    pieces: 118,
    avgEngagement: 3.1,
    avgViews: 12_600,
    share: 14,
  },
  {
    key: "long",
    label: "Long-form Video",
    pieces: 55,
    avgEngagement: 7.4,
    avgViews: 186_000,
    share: 7,
  },
];
