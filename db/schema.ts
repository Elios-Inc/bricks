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
} from "drizzle-orm/pg-core";
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

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const trackedPeople = pgTable("tracked_people", {
  id,
  name: text("name").notNull(),
  type: trackedPersonTypeEnum("type").notNull(),
  email: text("email"),
  bricksStartDate: date("bricks_start_date"),
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
