import { eq } from "drizzle-orm";

import { db } from "@/db";
import { integrationCredentials } from "@/db/schema";
import type {
  AccountsResponse,
  DurationAnalysisResponse,
  MetricsTimeSeriesResponse,
  MostViralVideosResponse,
  RevenueCombinedResponse,
  ShortimizeDailySnapshot,
  ViralityAnalysisResponse,
  VideoStatsResponse,
} from "./shortimize-types";

const SUPABASE_PROJECT_REF = "bctwkcnnyyiaemwmuauc";
const SUPABASE_ANON_KEY = "sb_publishable_5pa93NUlyYfRGCbzsfKc8A_619UIqf_";
const SUPABASE_AUTH_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/auth/v1`;
const COOKIE_NAME = `sb-${SUPABASE_PROJECT_REF}-auth-token`;
const SHORTIMIZE_API_BASE = "https://cliplabs.shortimize.com/api";
const ALL_PLATFORMS = ["tiktok", "instagram", "youtube", "facebook", "snapchat", "twitter"] as const;

type ShortimizeCredentials = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  cookieValue: string;
  organisationId: string;
};

// ---------------------------------------------------------------------------
// Cookie parsing / auth
// ---------------------------------------------------------------------------

export function parseShortimizeCookie(cookieValue: string): {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
} {
  const raw = cookieValue.startsWith("base64-")
    ? cookieValue.slice("base64-".length)
    : cookieValue;

  const json = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: new Date(json.expires_at * 1000),
  };
}

function buildCookieValue(session: {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: unknown;
}): string {
  return "base64-" + Buffer.from(JSON.stringify(session)).toString("base64");
}

// ---------------------------------------------------------------------------
// Credential management
// ---------------------------------------------------------------------------

export async function saveShortimizeCredentials(
  cookieValue: string,
  organisationId: string
): Promise<void> {
  const parsed = parseShortimizeCookie(cookieValue);

  const meta = JSON.stringify({
    cookieValue,
    organisationId,
    supabaseProjectRef: SUPABASE_PROJECT_REF,
  });

  const existing = await db
    .select({ id: integrationCredentials.id })
    .from(integrationCredentials)
    .where(eq(integrationCredentials.provider, "shortimize"))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(integrationCredentials)
      .set({
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        expiresAt: parsed.expiresAt,
        providerMeta: meta,
      })
      .where(eq(integrationCredentials.provider, "shortimize"));
  } else {
    await db.insert(integrationCredentials).values({
      provider: "shortimize",
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt,
      providerMeta: meta,
    });
  }
}

export async function getShortimizeCredentials(): Promise<ShortimizeCredentials | null> {
  const rows = await db
    .select()
    .from(integrationCredentials)
    .where(eq(integrationCredentials.provider, "shortimize"))
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  const meta = row.providerMeta ? JSON.parse(row.providerMeta) : {};

  return {
    accessToken: row.accessToken,
    refreshToken: row.refreshToken,
    expiresAt: row.expiresAt,
    cookieValue: meta.cookieValue ?? "",
    organisationId: meta.organisationId ?? "",
  };
}

export async function getShortimizeStatus(): Promise<{
  configured: boolean;
  tokenExpired: boolean;
  expiresAt: Date | null;
  organisationId: string | null;
  lastUpdated: Date | null;
}> {
  const rows = await db
    .select()
    .from(integrationCredentials)
    .where(eq(integrationCredentials.provider, "shortimize"))
    .limit(1);

  if (rows.length === 0) {
    return {
      configured: false,
      tokenExpired: false,
      expiresAt: null,
      organisationId: null,
      lastUpdated: null,
    };
  }

  const row = rows[0];
  const meta = row.providerMeta ? JSON.parse(row.providerMeta) : {};

  return {
    configured: true,
    tokenExpired: row.expiresAt < new Date(),
    expiresAt: row.expiresAt,
    organisationId: meta.organisationId ?? null,
    lastUpdated: row.updatedAt,
  };
}

export async function refreshShortimizeTokens(): Promise<ShortimizeCredentials> {
  const creds = await getShortimizeCredentials();
  if (!creds) {
    throw new Error("No Shortimize credentials stored. Add them in Settings.");
  }

  const res = await fetch(
    `${SUPABASE_AUTH_URL}/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ refresh_token: creds.refreshToken }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shortimize token refresh failed (${res.status}): ${body}`);
  }

  const session = await res.json();
  const newCookieValue = buildCookieValue(session);

  const meta = JSON.stringify({
    cookieValue: newCookieValue,
    organisationId: creds.organisationId,
    supabaseProjectRef: SUPABASE_PROJECT_REF,
  });

  await db
    .update(integrationCredentials)
    .set({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: new Date(session.expires_at * 1000),
      providerMeta: meta,
    })
    .where(eq(integrationCredentials.provider, "shortimize"));

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: new Date(session.expires_at * 1000),
    cookieValue: newCookieValue,
    organisationId: creds.organisationId,
  };
}

async function getValidCredentials(): Promise<ShortimizeCredentials> {
  const creds = await getShortimizeCredentials();
  if (!creds) {
    throw new Error("No Shortimize credentials stored. Add them in Settings.");
  }

  const bufferMs = 5 * 60 * 1000;
  if (creds.expiresAt.getTime() - Date.now() < bufferMs) {
    return refreshShortimizeTokens();
  }

  return creds;
}

// ---------------------------------------------------------------------------
// Generic fetch helper
// ---------------------------------------------------------------------------

async function shortimizePost<T>(path: string, body: unknown): Promise<T> {
  const creds = await getValidCredentials();

  const res = await fetch(`${SHORTIMIZE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${COOKIE_NAME}=${creds.cookieValue}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shortimize ${path} (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Individual API functions
// ---------------------------------------------------------------------------

export async function fetchAccounts(): Promise<AccountsResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<AccountsResponse>("/overview/accounts", {
    organisationId: creds.organisationId,
    platforms: [...ALL_PLATFORMS],
  });
}

export async function fetchViralityAnalysis(
  dateRange: { from: string; to: string }
): Promise<ViralityAnalysisResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<ViralityAnalysisResponse>("/overview/virality-analysis", {
    organisationId: creds.organisationId,
    matchAllCollections: false,
    platforms: [...ALL_PLATFORMS],
    dateRange,
    onlyInUploadRange: false,
  });
}

export async function fetchMetricsTimeSeries(
  dateRange: { from: string; to: string },
  accountTrackingTypes: Record<string, "all_videos">
): Promise<MetricsTimeSeriesResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<MetricsTimeSeriesResponse>("/overview/metrics/time-series", {
    organisationId: creds.organisationId,
    matchAllCollections: false,
    accountTrackingTypes,
    platforms: [...ALL_PLATFORMS],
    dateRange,
    onlyInUploadRange: false,
    useOrganisationLevel: true,
    skipFollowersFollowing: true,
    selectedRevenueSources: [{ type: "all", projectId: null }],
  });
}

export async function fetchRevenueCombined(
  dateRange: { from: string; to: string }
): Promise<RevenueCombinedResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<RevenueCombinedResponse>("/overview/revenue/combined", {
    organisationId: creds.organisationId,
    currentDateRange: dateRange,
    includeTimeSeries: true,
  });
}

export async function fetchMostViralVideos(
  dateRange: { from: string; to: string },
  count = 3
): Promise<MostViralVideosResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<MostViralVideosResponse>("/overview/most-viral-videos", {
    organisationId: creds.organisationId,
    count,
    matchAllCollections: false,
    platforms: [...ALL_PLATFORMS],
    dateRange,
    onlyInUploadRange: false,
    showGains: false,
  });
}

export async function fetchDurationAnalysis(
  dateRange: { from: string; to: string }
): Promise<DurationAnalysisResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<DurationAnalysisResponse>("/overview/duration-analysis", {
    organisationId: creds.organisationId,
    matchAllCollections: false,
    platforms: [...ALL_PLATFORMS],
    dateRange,
    onlyInUploadRange: false,
  });
}

export async function fetchVideoStats(
  dateRange: { from: string; to: string },
  options?: { limit?: number; offset?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
): Promise<VideoStatsResponse> {
  const creds = await getValidCredentials();
  return shortimizePost<VideoStatsResponse>("/overview/video-stats", {
    organisationId: creds.organisationId,
    matchAllCollections: false,
    totalAccountCount: 10,
    platforms: [...ALL_PLATFORMS],
    dateRange,
    onlyInUploadRange: false,
    showGains: false,
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
    sortBy: options?.sortBy ?? "views",
    sortOrder: options?.sortOrder ?? "desc",
  });
}

// ---------------------------------------------------------------------------
// Daily snapshot: calls all 6 endpoints for yesterday's data
// ---------------------------------------------------------------------------

function yesterdayRange(): { from: string; to: string; dateStr: string } {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  const dateStr = d.toISOString().slice(0, 10);
  return {
    from: `${dateStr}T00:00:00.000Z`,
    to: `${dateStr}T23:59:59.999Z`,
    dateStr,
  };
}

export async function fetchDailySnapshot(): Promise<ShortimizeDailySnapshot> {
  const { from, to, dateStr } = yesterdayRange();
  const dateRange = { from, to };

  const accounts = await fetchAccounts();
  const trackingTypes: Record<string, "all_videos"> = {};
  for (const acct of accounts.data) {
    trackingTypes[acct.account_id] = "all_videos";
  }

  const [virality, timeSeries, revenue, topVideos, duration, videoStats] =
    await Promise.all([
      fetchViralityAnalysis(dateRange),
      fetchMetricsTimeSeries(dateRange, trackingTypes),
      fetchRevenueCombined(dateRange),
      fetchMostViralVideos(dateRange, 3),
      fetchDurationAnalysis(dateRange),
      fetchVideoStats(dateRange, { limit: 100, sortBy: "views", sortOrder: "desc" }),
    ]);

  const dayMetrics = timeSeries.data.find((d) => d.date === dateStr) ?? {
    organisation_id: "",
    date: dateStr,
    total_views: 0,
    total_likes: 0,
    total_comments: 0,
    total_shares: 0,
    total_bookmarks: 0,
    total_engagements: 0,
    total_ads: 0,
    updated_at: new Date().toISOString(),
    ads_upload_count: 0,
    granularity: "daily" as const,
  };

  return {
    date: dateStr,
    metrics: dayMetrics,
    viralityBrackets: virality.data,
    durationAnalysis: duration.data,
    topVideos: topVideos.data,
    revenue: { total: revenue.current.total, currency: revenue.currency },
    videoCount: videoStats.data.length,
  };
}

// Re-export for backward compat
export { fetchAccounts as fetchShortimizeAccounts };
