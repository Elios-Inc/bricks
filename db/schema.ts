import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  date,
  pgEnum,
  index,
  uniqueIndex,
  real,
  numeric,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const id = uuid("id").primaryKey().defaultRandom();

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const platformEnum = pgEnum("platform", [
  "instagram",
  "tiktok",
  "youtube",
  "facebook",
]);

export const trackedPersonTypeEnum = pgEnum("tracked_person_type", [
  "member",
  "internal",
]);

export const accountCategoryEnum = pgEnum("account_category", [
  "personal",
  "business",
]);

export const contentTypeEnum = pgEnum("content_type", [
  "post",
  "reel",
  "short",
  "video",
  "story",
]);

export const integrationProviderEnum = pgEnum("integration_provider", [
  "shortimize",
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const trackedPeople = pgTable("tracked_people", {
  id,
  name: text("name").notNull(),
  type: trackedPersonTypeEnum("type").notNull(),
  email: text("email"),
  bricksStartDate: date("bricks_start_date").notNull().default(sql`CURRENT_DATE`),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});

export const socialAccounts = pgTable(
  "social_accounts",
  {
    id,
    trackedPersonId: uuid("tracked_person_id")
      .notNull()
      .references(() => trackedPeople.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    accountCategory: accountCategoryEnum("account_category").notNull(),
    handle: text("handle").notNull(),
    profileUrl: text("profile_url"),
    active: boolean("active").notNull().default(true),
    trackingEnabled: boolean("tracking_enabled").notNull().default(true),
    ...timestamps,
  },
  (table) => [
    index("social_accounts_tracked_person_idx").on(table.trackedPersonId),
    index("social_accounts_platform_handle_idx").on(
      table.platform,
      table.handle
    ),
  ]
);

export const contentItems = pgTable(
  "content_items",
  {
    id,
    socialAccountId: uuid("social_account_id")
      .notNull()
      .references(() => socialAccounts.id, { onDelete: "cascade" }),
    platformContentId: text("platform_content_id").notNull(),
    type: contentTypeEnum("type"),
    contentUrl: text("content_url"),
    title: text("title"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("content_items_social_account_idx").on(table.socialAccountId),
    index("content_items_platform_content_idx").on(table.platformContentId),
  ]
);

export const dailyProfileSnapshots = pgTable(
  "daily_profile_snapshots",
  {
    id,
    socialAccountId: uuid("social_account_id")
      .notNull()
      .references(() => socialAccounts.id, { onDelete: "cascade" }),
    snapshotDate: date("snapshot_date").notNull(),
    followers: integer("followers"),
    following: integer("following"),
    totalContentCount: integer("total_content_count"),
    avgViews: integer("avg_views"),
    avgLikes: integer("avg_likes"),
    avgComments: integer("avg_comments"),
    ...timestamps,
  },
  (table) => [
    index("daily_profile_snap_account_date_idx").on(
      table.socialAccountId,
      table.snapshotDate
    ),
  ]
);

export const dailyContentSnapshots = pgTable(
  "daily_content_snapshots",
  {
    id,
    contentItemId: uuid("content_item_id")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    snapshotDate: date("snapshot_date").notNull(),
    views: bigint("views", { mode: "number" }),
    likes: integer("likes"),
    comments: integer("comments"),
    shares: integer("shares"),
    ...timestamps,
  },
  (table) => [
    index("daily_content_snap_item_date_idx").on(
      table.contentItemId,
      table.snapshotDate
    ),
  ]
);

export const weeklyRollups = pgTable(
  "weekly_rollups",
  {
    id,
    socialAccountId: uuid("social_account_id")
      .notNull()
      .references(() => socialAccounts.id, { onDelete: "cascade" }),
    weekStartDate: date("week_start_date").notNull(),
    avgViewsPerContent: integer("avg_views_per_content"),
    medianViews: integer("median_views"),
    followerDelta: integer("follower_delta"),
    contentCount: integer("content_count"),
    ...timestamps,
  },
  (table) => [
    index("weekly_rollup_account_week_idx").on(
      table.socialAccountId,
      table.weekStartDate
    ),
  ]
);

export const monthlyRollups = pgTable(
  "monthly_rollups",
  {
    id,
    socialAccountId: uuid("social_account_id")
      .notNull()
      .references(() => socialAccounts.id, { onDelete: "cascade" }),
    monthStartDate: date("month_start_date").notNull(),
    avgViewsPerContent: integer("avg_views_per_content"),
    medianViews: integer("median_views"),
    followerDelta: integer("follower_delta"),
    contentCount: integer("content_count"),
    ...timestamps,
  },
  (table) => [
    index("monthly_rollup_account_month_idx").on(
      table.socialAccountId,
      table.monthStartDate
    ),
  ]
);

export const integrationCredentials = pgTable("integration_credentials", {
  id,
  provider: integrationProviderEnum("provider").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  providerMeta: text("provider_meta"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Shortimize (ClipLabs) tables
// ---------------------------------------------------------------------------

export const shortimizeAccounts = pgTable("shortimize_accounts", {
  id,
  shortimizeAccountId: text("shortimize_account_id").notNull().unique(),
  username: text("username").notNull(),
  platform: text("platform").notNull(),
  disabled: boolean("disabled").notNull().default(false),
  ...timestamps,
});

export const shortimizeDailyMetrics = pgTable(
  "shortimize_daily_metrics",
  {
    id,
    snapshotDate: date("snapshot_date").notNull().unique(),

    // Core metrics (from metrics/time-series)
    totalViews: bigint("total_views", { mode: "number" }).notNull().default(0),
    totalLikes: integer("total_likes").notNull().default(0),
    totalComments: integer("total_comments").notNull().default(0),
    totalShares: integer("total_shares").notNull().default(0),
    totalBookmarks: integer("total_bookmarks").notNull().default(0),
    totalEngagements: integer("total_engagements").notNull().default(0),
    totalAds: integer("total_ads").notNull().default(0),
    adsUploadCount: integer("ads_upload_count").notNull().default(0),

    // Virality brackets (from virality-analysis)
    viralityBelow1x: integer("virality_below_1x").notNull().default(0),
    virality1x5x: integer("virality_1x_5x").notNull().default(0),
    virality5x10x: integer("virality_5x_10x").notNull().default(0),
    virality10x25x: integer("virality_10x_25x").notNull().default(0),
    virality25x50x: integer("virality_25x_50x").notNull().default(0),
    virality50x100x: integer("virality_50x_100x").notNull().default(0),
    virality100xPlus: integer("virality_100x_plus").notNull().default(0),
    viralityVideoCount: integer("virality_video_count").notNull().default(0),

    // Duration brackets (from duration-analysis) — count + avg views per bracket
    dur0_5Count: integer("dur_0_5_count").notNull().default(0),
    dur0_5Value: integer("dur_0_5_value").notNull().default(0),
    dur5_10Count: integer("dur_5_10_count").notNull().default(0),
    dur5_10Value: integer("dur_5_10_value").notNull().default(0),
    dur10_15Count: integer("dur_10_15_count").notNull().default(0),
    dur10_15Value: integer("dur_10_15_value").notNull().default(0),
    dur15_20Count: integer("dur_15_20_count").notNull().default(0),
    dur15_20Value: integer("dur_15_20_value").notNull().default(0),
    dur20_25Count: integer("dur_20_25_count").notNull().default(0),
    dur20_25Value: integer("dur_20_25_value").notNull().default(0),
    dur25_30Count: integer("dur_25_30_count").notNull().default(0),
    dur25_30Value: integer("dur_25_30_value").notNull().default(0),
    dur30_35Count: integer("dur_30_35_count").notNull().default(0),
    dur30_35Value: integer("dur_30_35_value").notNull().default(0),
    dur35_40Count: integer("dur_35_40_count").notNull().default(0),
    dur35_40Value: integer("dur_35_40_value").notNull().default(0),
    dur40_45Count: integer("dur_40_45_count").notNull().default(0),
    dur40_45Value: integer("dur_40_45_value").notNull().default(0),
    dur45_50Count: integer("dur_45_50_count").notNull().default(0),
    dur45_50Value: integer("dur_45_50_value").notNull().default(0),
    dur50_55Count: integer("dur_50_55_count").notNull().default(0),
    dur50_55Value: integer("dur_50_55_value").notNull().default(0),
    dur55_60Count: integer("dur_55_60_count").notNull().default(0),
    dur55_60Value: integer("dur_55_60_value").notNull().default(0),
    dur60PlusCount: integer("dur_60_plus_count").notNull().default(0),
    dur60PlusValue: integer("dur_60_plus_value").notNull().default(0),
    optimalDuration: real("optimal_duration"),

    // Revenue
    revenueTotal: numeric("revenue_total", { precision: 12, scale: 2 }).notNull().default("0"),
    revenueCurrency: text("revenue_currency").notNull().default("USD"),

    ...timestamps,
  },
  (table) => [
    index("shortimize_daily_metrics_date_idx").on(table.snapshotDate),
  ]
);

export const shortimizeVideos = pgTable(
  "shortimize_videos",
  {
    id,
    shortimizeVideoId: text("shortimize_video_id").notNull().unique(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => shortimizeAccounts.id, { onDelete: "cascade" }),
    platformContentId: text("platform_content_id"),
    platform: text("platform").notNull(),
    title: text("title"),
    adLink: text("ad_link"),
    videoLength: integer("video_length"),
    uploadedAt: date("uploaded_at"),
    ...timestamps,
  },
  (table) => [
    index("shortimize_videos_account_idx").on(table.accountId),
  ]
);

export const shortimizeVideoDailyStats = pgTable(
  "shortimize_video_daily_stats",
  {
    id,
    videoId: uuid("video_id")
      .notNull()
      .references(() => shortimizeVideos.id, { onDelete: "cascade" }),
    snapshotDate: date("snapshot_date").notNull(),
    views: bigint("views", { mode: "number" }),
    likes: integer("likes"),
    comments: integer("comments"),
    shares: integer("shares"),
    bookmarks: integer("bookmarks"),
    engagement: integer("engagement"),
    engagementRate: real("engagement_rate"),
    outlierMultiplier: real("outlier_multiplier"),
    views1dAgo: bigint("views_1d_ago", { mode: "number" }),
    views7dAgo: bigint("views_7d_ago", { mode: "number" }),
    increase1d: bigint("increase_1d", { mode: "number" }),
    increase7d: bigint("increase_7d", { mode: "number" }),
    hashtags: text("hashtags").array(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("shortimize_video_daily_stats_video_date_idx").on(
      table.videoId,
      table.snapshotDate
    ),
  ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const trackedPeopleRelations = relations(trackedPeople, ({ many }) => ({
  socialAccounts: many(socialAccounts),
}));

export const socialAccountsRelations = relations(
  socialAccounts,
  ({ one, many }) => ({
    trackedPerson: one(trackedPeople, {
      fields: [socialAccounts.trackedPersonId],
      references: [trackedPeople.id],
    }),
    contentItems: many(contentItems),
    dailyProfileSnapshots: many(dailyProfileSnapshots),
    weeklyRollups: many(weeklyRollups),
    monthlyRollups: many(monthlyRollups),
  })
);

export const contentItemsRelations = relations(
  contentItems,
  ({ one, many }) => ({
    socialAccount: one(socialAccounts, {
      fields: [contentItems.socialAccountId],
      references: [socialAccounts.id],
    }),
    dailyContentSnapshots: many(dailyContentSnapshots),
  })
);

export const dailyProfileSnapshotsRelations = relations(
  dailyProfileSnapshots,
  ({ one }) => ({
    socialAccount: one(socialAccounts, {
      fields: [dailyProfileSnapshots.socialAccountId],
      references: [socialAccounts.id],
    }),
  })
);

export const dailyContentSnapshotsRelations = relations(
  dailyContentSnapshots,
  ({ one }) => ({
    contentItem: one(contentItems, {
      fields: [dailyContentSnapshots.contentItemId],
      references: [contentItems.id],
    }),
  })
);

export const weeklyRollupsRelations = relations(weeklyRollups, ({ one }) => ({
  socialAccount: one(socialAccounts, {
    fields: [weeklyRollups.socialAccountId],
    references: [socialAccounts.id],
  }),
}));

export const monthlyRollupsRelations = relations(
  monthlyRollups,
  ({ one }) => ({
    socialAccount: one(socialAccounts, {
      fields: [monthlyRollups.socialAccountId],
      references: [socialAccounts.id],
    }),
  })
);

export const shortimizeAccountsRelations = relations(
  shortimizeAccounts,
  ({ many }) => ({
    videos: many(shortimizeVideos),
  })
);

export const shortimizeVideosRelations = relations(
  shortimizeVideos,
  ({ one, many }) => ({
    account: one(shortimizeAccounts, {
      fields: [shortimizeVideos.accountId],
      references: [shortimizeAccounts.id],
    }),
    dailyStats: many(shortimizeVideoDailyStats),
  })
);

export const shortimizeVideoDailyStatsRelations = relations(
  shortimizeVideoDailyStats,
  ({ one }) => ({
    video: one(shortimizeVideos, {
      fields: [shortimizeVideoDailyStats.videoId],
      references: [shortimizeVideos.id],
    }),
  })
);
