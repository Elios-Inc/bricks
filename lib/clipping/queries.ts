import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  shortimizeAccounts,
  shortimizeDailyMetrics,
  shortimizeVideoDailyStats,
  shortimizeVideos,
} from "@/db/schema";

export type ClippingKpis = {
  totalViews: number;
  totalEngagements: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalBookmarks: number;
  daysCount: number;
};

export type DailyMetric = {
  date: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalBookmarks: number;
  totalEngagements: number;
  adsUploadCount: number;
};

export type TopVideo = {
  videoId: string;
  title: string | null;
  adLink: string | null;
  platform: string;
  username: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  engagementRate: number | null;
  outlierMultiplier: number | null;
};

export type VideoStat = TopVideo & {
  uploadedAt: string | null;
  bookmarks: number | null;
};

export async function getClippingKpis(): Promise<ClippingKpis> {
  const [row] = await db
    .select({
      totalViews: sql<number>`coalesce(sum(${shortimizeDailyMetrics.totalViews}), 0)`.mapWith(Number),
      totalEngagements: sql<number>`coalesce(sum(${shortimizeDailyMetrics.totalEngagements}), 0)`.mapWith(Number),
      totalLikes: sql<number>`coalesce(sum(${shortimizeDailyMetrics.totalLikes}), 0)`.mapWith(Number),
      totalComments: sql<number>`coalesce(sum(${shortimizeDailyMetrics.totalComments}), 0)`.mapWith(Number),
      totalShares: sql<number>`coalesce(sum(${shortimizeDailyMetrics.totalShares}), 0)`.mapWith(Number),
      totalBookmarks: sql<number>`coalesce(sum(${shortimizeDailyMetrics.totalBookmarks}), 0)`.mapWith(Number),
      daysCount: sql<number>`count(*)`.mapWith(Number),
    })
    .from(shortimizeDailyMetrics);

  return row;
}

export async function getDailyMetrics(): Promise<DailyMetric[]> {
  return db
    .select({
      date: shortimizeDailyMetrics.snapshotDate,
      totalViews: shortimizeDailyMetrics.totalViews,
      totalLikes: shortimizeDailyMetrics.totalLikes,
      totalComments: shortimizeDailyMetrics.totalComments,
      totalShares: shortimizeDailyMetrics.totalShares,
      totalBookmarks: shortimizeDailyMetrics.totalBookmarks,
      totalEngagements: shortimizeDailyMetrics.totalEngagements,
      adsUploadCount: shortimizeDailyMetrics.adsUploadCount,
    })
    .from(shortimizeDailyMetrics)
    .orderBy(shortimizeDailyMetrics.snapshotDate);
}

export async function getTopVideos(limit = 3): Promise<TopVideo[]> {
  return db
    .select({
      videoId: shortimizeVideos.id,
      title: shortimizeVideos.title,
      adLink: shortimizeVideos.adLink,
      platform: shortimizeVideos.platform,
      username: shortimizeAccounts.username,
      views: shortimizeVideoDailyStats.views,
      likes: shortimizeVideoDailyStats.likes,
      comments: shortimizeVideoDailyStats.comments,
      shares: shortimizeVideoDailyStats.shares,
      engagementRate: shortimizeVideoDailyStats.engagementRate,
      outlierMultiplier: shortimizeVideoDailyStats.outlierMultiplier,
    })
    .from(shortimizeVideoDailyStats)
    .innerJoin(
      shortimizeVideos,
      eq(shortimizeVideoDailyStats.videoId, shortimizeVideos.id)
    )
    .innerJoin(
      shortimizeAccounts,
      eq(shortimizeVideos.accountId, shortimizeAccounts.id)
    )
    .where(
      eq(
        shortimizeVideoDailyStats.snapshotDate,
        sql`(SELECT MAX(snapshot_date) FROM shortimize_video_daily_stats)`
      )
    )
    .orderBy(desc(shortimizeVideoDailyStats.views))
    .limit(limit);
}

export async function getVideoStats(): Promise<VideoStat[]> {
  return db
    .select({
      videoId: shortimizeVideos.id,
      title: shortimizeVideos.title,
      adLink: shortimizeVideos.adLink,
      platform: shortimizeVideos.platform,
      username: shortimizeAccounts.username,
      uploadedAt: shortimizeVideos.uploadedAt,
      views: shortimizeVideoDailyStats.views,
      likes: shortimizeVideoDailyStats.likes,
      comments: shortimizeVideoDailyStats.comments,
      shares: shortimizeVideoDailyStats.shares,
      bookmarks: shortimizeVideoDailyStats.bookmarks,
      engagementRate: shortimizeVideoDailyStats.engagementRate,
      outlierMultiplier: shortimizeVideoDailyStats.outlierMultiplier,
    })
    .from(shortimizeVideoDailyStats)
    .innerJoin(
      shortimizeVideos,
      eq(shortimizeVideoDailyStats.videoId, shortimizeVideos.id)
    )
    .innerJoin(
      shortimizeAccounts,
      eq(shortimizeVideos.accountId, shortimizeAccounts.id)
    )
    .where(
      eq(
        shortimizeVideoDailyStats.snapshotDate,
        sql`(SELECT MAX(snapshot_date) FROM shortimize_video_daily_stats)`
      )
    )
    .orderBy(desc(shortimizeVideoDailyStats.views));
}
