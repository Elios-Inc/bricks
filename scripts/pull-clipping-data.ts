import { config } from "dotenv";
config({ path: ".env", override: true });

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  shortimizeAccounts,
  shortimizeDailyMetrics,
  shortimizeVideoDailyStats,
  shortimizeVideos,
} from "../db/schema";
import {
  fetchAccounts,
  fetchDailySnapshot,
  fetchVideoStats,
} from "../lib/vendors/shortimize";

function yesterdayDateStr(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function upsertAccounts() {
  console.log("Fetching accounts...");
  const res = await fetchAccounts();
  console.log(`  ${res.data.length} accounts from API`);

  for (const acct of res.data) {
    const existing = await db
      .select({ id: shortimizeAccounts.id })
      .from(shortimizeAccounts)
      .where(eq(shortimizeAccounts.shortimizeAccountId, acct.id))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(shortimizeAccounts)
        .set({
          username: acct.username,
          platform: acct.platform,
          disabled: acct.disabled,
        })
        .where(eq(shortimizeAccounts.shortimizeAccountId, acct.id));
    } else {
      await db.insert(shortimizeAccounts).values({
        shortimizeAccountId: acct.id,
        username: acct.username,
        platform: acct.platform,
        disabled: acct.disabled,
      });
    }
  }

  console.log("  Accounts synced.");
  return res.data;
}

async function upsertDailyMetrics(snapshot: Awaited<ReturnType<typeof fetchDailySnapshot>>) {
  const dateStr = snapshot.date;
  console.log(`Upserting daily metrics for ${dateStr}...`);

  const m = snapshot.metrics;
  const v = snapshot.viralityBrackets;
  const dur = snapshot.durationAnalysis;

  const row = {
    snapshotDate: dateStr,
    totalViews: m.total_views,
    totalLikes: m.total_likes,
    totalComments: m.total_comments,
    totalShares: m.total_shares,
    totalBookmarks: m.total_bookmarks,
    totalEngagements: m.total_engagements,
    totalAds: m.total_ads,
    adsUploadCount: m.ads_upload_count,
    viralityBelow1x: v["Below 1x"] ?? 0,
    virality1x5x: v["1x-5x"] ?? 0,
    virality5x10x: v["5x-10x"] ?? 0,
    virality10x25x: v["10x-25x"] ?? 0,
    virality25x50x: v["25x-50x"] ?? 0,
    virality50x100x: v["50x-100x"] ?? 0,
    virality100xPlus: v["100x+"] ?? 0,
    viralityVideoCount: snapshot.videoCount,
    dur0_5Count: dur.lengthBrackets["0-5"]?.count ?? 0,
    dur0_5Value: dur.lengthBrackets["0-5"]?.value ?? 0,
    dur5_10Count: dur.lengthBrackets["5-10"]?.count ?? 0,
    dur5_10Value: dur.lengthBrackets["5-10"]?.value ?? 0,
    dur10_15Count: dur.lengthBrackets["10-15"]?.count ?? 0,
    dur10_15Value: dur.lengthBrackets["10-15"]?.value ?? 0,
    dur15_20Count: dur.lengthBrackets["15-20"]?.count ?? 0,
    dur15_20Value: dur.lengthBrackets["15-20"]?.value ?? 0,
    dur20_25Count: dur.lengthBrackets["20-25"]?.count ?? 0,
    dur20_25Value: dur.lengthBrackets["20-25"]?.value ?? 0,
    dur25_30Count: dur.lengthBrackets["25-30"]?.count ?? 0,
    dur25_30Value: dur.lengthBrackets["25-30"]?.value ?? 0,
    dur30_35Count: dur.lengthBrackets["30-35"]?.count ?? 0,
    dur30_35Value: dur.lengthBrackets["30-35"]?.value ?? 0,
    dur35_40Count: dur.lengthBrackets["35-40"]?.count ?? 0,
    dur35_40Value: dur.lengthBrackets["35-40"]?.value ?? 0,
    dur40_45Count: dur.lengthBrackets["40-45"]?.count ?? 0,
    dur40_45Value: dur.lengthBrackets["40-45"]?.value ?? 0,
    dur45_50Count: dur.lengthBrackets["45-50"]?.count ?? 0,
    dur45_50Value: dur.lengthBrackets["45-50"]?.value ?? 0,
    dur50_55Count: dur.lengthBrackets["50-55"]?.count ?? 0,
    dur50_55Value: dur.lengthBrackets["50-55"]?.value ?? 0,
    dur55_60Count: dur.lengthBrackets["55-60"]?.count ?? 0,
    dur55_60Value: dur.lengthBrackets["55-60"]?.value ?? 0,
    dur60PlusCount: dur.lengthBrackets["60+"]?.count ?? 0,
    dur60PlusValue: dur.lengthBrackets["60+"]?.value ?? 0,
    optimalDuration: dur.optimalLength,
    revenueTotal: snapshot.revenue.total.toFixed(2),
    revenueCurrency: snapshot.revenue.currency,
  };

  const existing = await db
    .select({ id: shortimizeDailyMetrics.id })
    .from(shortimizeDailyMetrics)
    .where(eq(shortimizeDailyMetrics.snapshotDate, dateStr))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(shortimizeDailyMetrics)
      .set(row)
      .where(eq(shortimizeDailyMetrics.snapshotDate, dateStr));
    console.log("  Updated existing row.");
  } else {
    await db.insert(shortimizeDailyMetrics).values(row);
    console.log("  Inserted new row.");
  }
}

async function upsertVideoStats(dateStr: string) {
  console.log(`Fetching video stats for ${dateStr}...`);
  const dateRange = {
    from: `${dateStr}T00:00:00.000Z`,
    to: `${dateStr}T23:59:59.999Z`,
  };

  const allVideos = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetchVideoStats(dateRange, { limit, offset, sortBy: "views", sortOrder: "desc" });
    allVideos.push(...res.data);
    console.log(`  Fetched ${res.data.length} videos (offset ${offset}, total so far: ${allVideos.length})`);
    if (res.data.length < limit) break;
    offset += limit;
  }

  console.log(`  ${allVideos.length} total videos. Upserting...`);

  const accountRows = await db.select().from(shortimizeAccounts);
  const accountMap = new Map(accountRows.map((a) => [a.shortimizeAccountId, a.id]));

  let upserted = 0;
  for (const video of allVideos) {
    const accountDbId = accountMap.get(video.account_id);
    if (!accountDbId) {
      console.log(`  Skipping video ${video.id} — unknown account ${video.account_id} (${video.username})`);
      continue;
    }

    const existingVideo = await db
      .select({ id: shortimizeVideos.id })
      .from(shortimizeVideos)
      .where(eq(shortimizeVideos.shortimizeVideoId, video.id))
      .limit(1);

    let videoDbId: string;
    if (existingVideo.length > 0) {
      videoDbId = existingVideo[0].id;
      await db
        .update(shortimizeVideos)
        .set({
          title: video.title,
          adLink: video.ad_link,
          platform: video.platform,
          videoLength: video.video_length,
          uploadedAt: video.uploaded_at?.slice(0, 10) ?? null,
        })
        .where(eq(shortimizeVideos.shortimizeVideoId, video.id));
    } else {
      const [inserted] = await db
        .insert(shortimizeVideos)
        .values({
          shortimizeVideoId: video.id,
          accountId: accountDbId,
          platformContentId: video.ad_platform_id,
          platform: video.platform,
          title: video.title,
          adLink: video.ad_link,
          videoLength: video.video_length,
          uploadedAt: video.uploaded_at?.slice(0, 10) ?? null,
        })
        .returning({ id: shortimizeVideos.id });
      videoDbId = inserted.id;
    }

    const statHasDate = await db
      .select({ id: shortimizeVideoDailyStats.id })
      .from(shortimizeVideoDailyStats)
      .where(
        and(
          eq(shortimizeVideoDailyStats.videoId, videoDbId),
          eq(shortimizeVideoDailyStats.snapshotDate, dateStr)
        )
      )
      .limit(1);

    const statRow = {
      videoId: videoDbId,
      snapshotDate: dateStr,
      views: video.latest_views,
      likes: video.latest_likes,
      comments: video.latest_comments,
      shares: video.latest_shares,
      bookmarks: video.latest_bookmarks,
      engagement: video.latest_engagement,
      engagementRate: video.latest_engagement_rate,
      outlierMultiplier: video.outlier_multiplier,
      views1dAgo: video.views_1d_ago,
      views7dAgo: video.views_7d_ago,
      increase1d: video.increase_1d,
      increase7d: video.increase_7d,
      hashtags: video.hashtags,
    };

    if (statHasDate.length > 0) {
      await db
        .update(shortimizeVideoDailyStats)
        .set(statRow)
        .where(eq(shortimizeVideoDailyStats.id, statHasDate[0].id));
    } else {
      await db.insert(shortimizeVideoDailyStats).values(statRow);
    }

    upserted++;
  }

  console.log(`  ${upserted} video stats upserted.`);
}

async function main() {
  const dateStr = yesterdayDateStr();
  console.log(`\nPulling clipping data for ${dateStr} (yesterday)...\n`);

  await upsertAccounts();

  console.log("\nFetching daily snapshot...");
  const snapshot = await fetchDailySnapshot();
  await upsertDailyMetrics(snapshot);

  await upsertVideoStats(dateStr);

  console.log("\nDone!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Pull failed:", err);
  process.exit(1);
});
