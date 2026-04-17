export type PlatformKey = "youtube" | "tiktok" | "instagram" | "facebook";

export const platformMeta: Record<
  PlatformKey,
  { label: string; color: string; accent: string }
> = {
  youtube: { label: "YouTube", color: "#FF0000", accent: "#FF0000" },
  tiktok: { label: "TikTok", color: "#00F2EA", accent: "#00F2EA" },
  instagram: { label: "Instagram", color: "#DD2A7B", accent: "#DD2A7B" },
  facebook: { label: "Facebook", color: "#1877F2", accent: "#1877F2" },
};

export type Scorecard = {
  label: string;
  value: string;
  subtext: string;
  delta?: { value: string; direction: "up" | "down" };
  highlight?: boolean;
};

export const scorecards: Scorecard[] = [
  {
    label: "Total Views (30D)",
    value: "31.2M",
    subtext: "vs prior 30D",
    delta: { value: "+18%", direction: "up" },
  },
  {
    label: "Est. Unique Reach",
    value: "~1.6M",
    subtext: "Deduplicated audience estimate",
  },
  {
    label: "Avg Engagement",
    value: "4.7%",
    subtext: "Weighted across all platforms",
  },
  {
    label: "Active Members",
    value: "14",
    subtext: "Contributing this month",
  },
  {
    label: "Est. Campaign Value",
    value: "$465K–$930K",
    subtext: "Based on blended CPM rates",
    highlight: true,
  },
  {
    label: "Content Pieces (30D)",
    value: "847",
    subtext: "Originals + clips",
  },
];

export const ageDistribution = [
  { label: "13–17", value: 4 },
  { label: "18–24", value: 31 },
  { label: "25–34", value: 38 },
  { label: "35–44", value: 18 },
  { label: "45–54", value: 6 },
  { label: "55+", value: 3 },
];

export const genderSplit = [
  { label: "Male", value: 68, color: "#00C853" },
  { label: "Female", value: 29, color: "#DD2A7B" },
  { label: "Other", value: 3, color: "#8134AF" },
];

export const topGeographies = [
  { label: "Salt Lake City, UT", value: 14 },
  { label: "Denver, CO", value: 8 },
  { label: "Phoenix, AZ", value: 6 },
  { label: "Los Angeles, CA", value: 5 },
  { label: "Las Vegas, NV", value: 4 },
];

export const audienceInterests = [
  "Entrepreneurship",
  "Automotive",
  "Lifestyle",
  "Fitness",
  "Content Creation",
];

export type DailyViews = {
  date: string;
  label: string;
  youtube: number;
  tiktok: number;
  instagram: number;
  facebook: number;
};

function generateDaily(): DailyViews[] {
  const days: DailyViews[] = [];
  const start = new Date(2026, 2, 16);
  for (let i = 0; i < 31; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const base = 800000 + i * 10000;
    const spike = i >= 20 && i <= 22 ? 350000 : 0;
    const weekend = isWeekend ? -90000 : 0;
    const noise = Math.round(Math.sin(i * 1.3) * 40000);
    const total = base + spike + weekend + noise;
    days.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      tiktok: Math.round(total * 0.4),
      youtube: Math.round(total * 0.3),
      instagram: Math.round(total * 0.2),
      facebook: Math.round(total * 0.1),
    });
  }
  return days;
}

export const dailyViews = generateDaily();

export type Member = {
  rank: number;
  id: string;
  name: string;
  tags: string[];
  totalViews: number;
  youtube: number;
  tiktok: number;
  instagram: number;
  engagement: number;
  growth: number;
  topPost: number;
};

export const members: Member[] = [
  {
    rank: 1,
    id: "mchenry",
    name: "Michael McHenry",
    tags: ["fitness", "lifestyle"],
    totalViews: 4_800_000,
    youtube: 1_900_000,
    tiktok: 1_600_000,
    instagram: 980_000,
    engagement: 2.6,
    growth: 12_400,
    topPost: 892_000,
  },
  {
    rank: 2,
    id: "howland",
    name: "Nicholas Howland",
    tags: ["entrepreneurship"],
    totalViews: 4_200_000,
    youtube: 2_100_000,
    tiktok: 1_100_000,
    instagram: 710_000,
    engagement: 4.8,
    growth: 8_200,
    topPost: 614_000,
  },
  {
    rank: 3,
    id: "woltoff",
    name: "Derek Woltoff",
    tags: ["automotive", "lifestyle"],
    totalViews: 3_600_000,
    youtube: 890_000,
    tiktok: 1_800_000,
    instagram: 640_000,
    engagement: 3.3,
    growth: 6_800,
    topPost: 523_000,
  },
  {
    rank: 4,
    id: "nilsen",
    name: "William Nilsen",
    tags: ["entrepreneurship", "tech"],
    totalViews: 3_100_000,
    youtube: 1_200_000,
    tiktok: 1_000_000,
    instagram: 620_000,
    engagement: 5.6,
    growth: 9_100,
    topPost: 468_000,
  },
  {
    rank: 5,
    id: "chell",
    name: "Brett Chell",
    tags: ["entrepreneurship", "automotive"],
    totalViews: 2_800_000,
    youtube: 680_000,
    tiktok: 1_400_000,
    instagram: 510_000,
    engagement: 6.8,
    growth: 11_300,
    topPost: 445_000,
  },
  {
    rank: 6,
    id: "panos",
    name: "Nick Panos",
    tags: ["fitness", "lifestyle"],
    totalViews: 2_500_000,
    youtube: 720_000,
    tiktok: 1_100_000,
    instagram: 480_000,
    engagement: 5.1,
    growth: 7_600,
    topPost: 387_000,
  },
  {
    rank: 7,
    id: "burnette",
    name: "Tanner Burnette",
    tags: ["entrepreneurship"],
    totalViews: 2_200_000,
    youtube: 540_000,
    tiktok: 980_000,
    instagram: 460_000,
    engagement: 4.1,
    growth: 5_400,
    topPost: 341_000,
  },
  {
    rank: 8,
    id: "nevarez",
    name: "Fernando Nevarez",
    tags: ["lifestyle", "content"],
    totalViews: 1_900_000,
    youtube: 480_000,
    tiktok: 820_000,
    instagram: 410_000,
    engagement: 4.4,
    growth: 4_200,
    topPost: 298_000,
  },
  {
    rank: 9,
    id: "daghlian",
    name: "Alec Daghlian",
    tags: ["lifestyle"],
    totalViews: 1_600_000,
    youtube: 390_000,
    tiktok: 710_000,
    instagram: 340_000,
    engagement: 3.7,
    growth: 3_800,
    topPost: 256_000,
  },
  {
    rank: 10,
    id: "mccormack",
    name: "Mark McCormack",
    tags: ["fitness"],
    totalViews: 1_400_000,
    youtube: 360_000,
    tiktok: 580_000,
    instagram: 310_000,
    engagement: 6.0,
    growth: 4_600,
    topPost: 224_000,
  },
  {
    rank: 11,
    id: "offill",
    name: "Dallas Offill",
    tags: ["lifestyle"],
    totalViews: 1_200_000,
    youtube: 310_000,
    tiktok: 490_000,
    instagram: 280_000,
    engagement: 3.0,
    growth: 2_900,
    topPost: 198_000,
  },
  {
    rank: 12,
    id: "droubay",
    name: "Megan Droubay",
    tags: ["lifestyle", "wellness"],
    totalViews: 980_000,
    youtube: 240_000,
    tiktok: 420_000,
    instagram: 230_000,
    engagement: 5.2,
    growth: 3_100,
    topPost: 167_000,
  },
  {
    rank: 13,
    id: "seui",
    name: "Dev Seui",
    tags: ["tech", "entrepreneurship"],
    totalViews: 520_000,
    youtube: 130_000,
    tiktok: 210_000,
    instagram: 120_000,
    engagement: 3.6,
    growth: 1_800,
    topPost: 89_000,
  },
  {
    rank: 14,
    id: "mages",
    name: "Joshua Mages",
    tags: ["lifestyle"],
    totalViews: 380_000,
    youtube: 95_000,
    tiktok: 160_000,
    instagram: 85_000,
    engagement: 4.3,
    growth: 1_200,
    topPost: 72_000,
  },
];

export type AccountRow = {
  platform: PlatformKey;
  handle: string;
  views: string;
  engagement: string;
  followers: string;
  growth: string;
};

export const brettDetail: {
  personal: AccountRow[];
  bricks: AccountRow[];
} = {
  personal: [
    {
      platform: "youtube",
      handle: "@brettchell",
      views: "480K",
      engagement: "7.1%",
      followers: "142K",
      growth: "+3,200",
    },
    {
      platform: "tiktok",
      handle: "@brettchell",
      views: "1.1M",
      engagement: "6.4%",
      followers: "286K",
      growth: "+5,800",
    },
    {
      platform: "instagram",
      handle: "@brett.chell",
      views: "380K",
      engagement: "7.8%",
      followers: "98K",
      growth: "+1,600",
    },
    {
      platform: "facebook",
      handle: "@BrettChellOfficial",
      views: "160K",
      engagement: "5.2%",
      followers: "44K",
      growth: "+400",
    },
  ],
  bricks: [
    {
      platform: "youtube",
      handle: "@bricks_slc",
      views: "200K",
      engagement: "5.8%",
      followers: "12.4K",
      growth: "+300",
    },
    {
      platform: "tiktok",
      handle: "@bricks_slc",
      views: "300K",
      engagement: "4.1%",
      followers: "18K",
      growth: "+200",
    },
    {
      platform: "instagram",
      handle: "@bricks_corner",
      views: "130K",
      engagement: "4.6%",
      followers: "8.2K",
      growth: "+100",
    },
    {
      platform: "facebook",
      handle: "@bricksslc",
      views: "50K",
      engagement: "3.8%",
      followers: "3.1K",
      growth: "+50",
    },
  ],
};

export type PlatformCard = {
  key: PlatformKey;
  views: string;
  followers: string;
  qualityLabel: string;
  qualityValue: string;
  cpmRange: string;
  estValue: string;
  topMember: string;
  spark: number[];
};

export const platformCards: PlatformCard[] = [
  {
    key: "youtube",
    views: "9.3M",
    followers: "480K",
    qualityLabel: "Avg Watch Time",
    qualityValue: "4m 22s",
    cpmRange: "$20–$30",
    estValue: "$186K–$279K",
    topMember: "Nicholas Howland (2.1M)",
    spark: [30, 34, 31, 38, 42, 44, 46, 48, 52, 55, 58, 62],
  },
  {
    key: "tiktok",
    views: "12.4M",
    followers: "860K",
    qualityLabel: "Avg Completion",
    qualityValue: "67%",
    cpmRange: "$15–$25",
    estValue: "$186K–$310K",
    topMember: "Derek Woltoff (1.8M)",
    spark: [25, 28, 30, 34, 40, 46, 54, 60, 68, 76, 84, 92],
  },
  {
    key: "instagram",
    views: "7.2M",
    followers: "620K",
    qualityLabel: "Avg Saves / Post",
    qualityValue: "847",
    cpmRange: "$12–$20",
    estValue: "$86K–$144K",
    topMember: "Michael McHenry (980K)",
    spark: [42, 44, 43, 45, 46, 44, 47, 48, 46, 48, 49, 50],
  },
  {
    key: "facebook",
    views: "2.3M",
    followers: "440K",
    qualityLabel: "Avg Share Rate",
    qualityValue: "2.1%",
    cpmRange: "$8–$12",
    estValue: "$18K–$28K",
    topMember: "Michael McHenry (320K)",
    spark: [30, 32, 31, 30, 33, 32, 31, 32, 33, 32, 31, 33],
  },
];

export type TopContent = {
  rank: number;
  title: string;
  member: string;
  platform: PlatformKey;
  platformLabel: string;
  views: string;
  engagement: string;
  date: string;
};

export const topContent: TopContent[] = [
  {
    rank: 1,
    title: "SLC Warehouse Tour",
    member: "Michael McHenry",
    platform: "tiktok",
    platformLabel: "TikTok",
    views: "892K",
    engagement: "7.2%",
    date: "Apr 6",
  },
  {
    rank: 2,
    title: "Why I Left Corporate",
    member: "Nicholas Howland",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "614K",
    engagement: "5.1%",
    date: "Apr 2",
  },
  {
    rank: 3,
    title: "Morning Routine at BRICKS",
    member: "Derek Woltoff",
    platform: "instagram",
    platformLabel: "IG Reels",
    views: "523K",
    engagement: "4.6%",
    date: "Mar 29",
  },
  {
    rank: 4,
    title: "Building a Brand in Utah",
    member: "William Nilsen",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "468K",
    engagement: "6.2%",
    date: "Apr 4",
  },
  {
    rank: 5,
    title: "Cars & Coffee Recap",
    member: "Brett Chell",
    platform: "tiktok",
    platformLabel: "TikTok",
    views: "445K",
    engagement: "8.4%",
    date: "Apr 7",
  },
  {
    rank: 6,
    title: "Founder Q&A Live",
    member: "Brett Chell",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "398K",
    engagement: "9.1%",
    date: "Mar 24",
  },
  {
    rank: 7,
    title: "Day in the Life: Creator",
    member: "Nick Panos",
    platform: "tiktok",
    platformLabel: "TikTok",
    views: "387K",
    engagement: "5.8%",
    date: "Apr 1",
  },
  {
    rank: 8,
    title: "Grand Opening Teaser",
    member: "BRICKS SLC",
    platform: "instagram",
    platformLabel: "Instagram",
    views: "341K",
    engagement: "7.9%",
    date: "Mar 21",
  },
  {
    rank: 9,
    title: "Entrepreneurship Myths",
    member: "Tanner Burnette",
    platform: "tiktok",
    platformLabel: "TikTok",
    views: "298K",
    engagement: "4.3%",
    date: "Apr 5",
  },
  {
    rank: 10,
    title: "BTS: Podcast Setup",
    member: "Fernando Nevarez",
    platform: "youtube",
    platformLabel: "YouTube",
    views: "256K",
    engagement: "3.9%",
    date: "Mar 26",
  },
];

export type TrajectoryPoint = {
  month: string;
  views: number;
  projected: boolean;
  annotation?: string;
};

export const trajectory: TrajectoryPoint[] = [
  { month: "Nov '25", views: 18 },
  { month: "Dec '25", views: 21 },
  { month: "Jan '26", views: 24 },
  { month: "Feb '26", views: 27 },
  { month: "Mar '26", views: 29 },
  { month: "Apr '26", views: 31, annotation: "14 members" },
  { month: "May '26", views: 42, projected: true },
  { month: "Jun '26", views: 65, projected: true },
  { month: "Jul '26", views: 85, projected: true },
  {
    month: "Aug '26",
    views: 100,
    projected: true,
    annotation: "50+ members",
  },
].map((p) => ({ ...p, projected: Boolean(p.projected) }));

export const collabStats = [
  { label: "Total Collabs This Month", value: "34" },
  { label: "Avg Views on Collab Content", value: "132K" },
  { label: "Avg Views on Solo Content", value: "78K" },
  { label: "Collaboration Lift", value: "+69%", highlight: true },
];

export type CollabNode = {
  id: string;
  name: string;
  initials: string;
  views: number;
  x: number;
  y: number;
};

export type CollabEdge = {
  from: string;
  to: string;
  weight: number;
};

export const collabNodes: CollabNode[] = [
  { id: "mchenry", name: "Michael McHenry", initials: "MM", views: 4.8, x: 0.28, y: 0.4 },
  { id: "howland", name: "Nicholas Howland", initials: "NH", views: 4.2, x: 0.72, y: 0.3 },
  { id: "woltoff", name: "Derek Woltoff", initials: "DW", views: 3.6, x: 0.5, y: 0.62 },
  { id: "nilsen", name: "William Nilsen", initials: "WN", views: 3.1, x: 0.82, y: 0.58 },
  { id: "chell", name: "Brett Chell", initials: "BC", views: 2.8, x: 0.5, y: 0.3 },
  { id: "panos", name: "Nick Panos", initials: "NP", views: 2.5, x: 0.16, y: 0.62 },
  { id: "burnette", name: "Tanner Burnette", initials: "TB", views: 2.2, x: 0.64, y: 0.78 },
  { id: "nevarez", name: "Fernando Nevarez", initials: "FN", views: 1.9, x: 0.36, y: 0.78 },
  { id: "daghlian", name: "Alec Daghlian", initials: "AD", views: 1.6, x: 0.12, y: 0.3 },
  { id: "mccormack", name: "Mark McCormack", initials: "MC", views: 1.4, x: 0.88, y: 0.78 },
  { id: "offill", name: "Dallas Offill", initials: "DO", views: 1.2, x: 0.24, y: 0.15 },
  { id: "droubay", name: "Megan Droubay", initials: "MD", views: 0.98, x: 0.76, y: 0.82 },
  { id: "seui", name: "Dev Seui", initials: "DS", views: 0.52, x: 0.92, y: 0.18 },
  { id: "mages", name: "Joshua Mages", initials: "JM", views: 0.38, x: 0.08, y: 0.82 },
];

export const collabEdges: CollabEdge[] = [
  { from: "chell", to: "mchenry", weight: 4 },
  { from: "chell", to: "howland", weight: 5 },
  { from: "chell", to: "woltoff", weight: 3 },
  { from: "chell", to: "nilsen", weight: 3 },
  { from: "chell", to: "burnette", weight: 2 },
  { from: "mchenry", to: "panos", weight: 4 },
  { from: "mchenry", to: "woltoff", weight: 2 },
  { from: "mchenry", to: "mccormack", weight: 3 },
  { from: "howland", to: "nilsen", weight: 4 },
  { from: "howland", to: "burnette", weight: 2 },
  { from: "howland", to: "seui", weight: 2 },
  { from: "woltoff", to: "nevarez", weight: 2 },
  { from: "woltoff", to: "burnette", weight: 2 },
  { from: "nilsen", to: "seui", weight: 3 },
  { from: "panos", to: "mccormack", weight: 3 },
  { from: "panos", to: "daghlian", weight: 2 },
  { from: "nevarez", to: "daghlian", weight: 2 },
  { from: "nevarez", to: "offill", weight: 1 },
  { from: "droubay", to: "mccormack", weight: 1 },
  { from: "mages", to: "panos", weight: 1 },
  { from: "offill", to: "daghlian", weight: 1 },
  { from: "burnette", to: "droubay", weight: 1 },
];
