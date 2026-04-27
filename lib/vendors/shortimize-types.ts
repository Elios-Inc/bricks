// ---------------------------------------------------------------------------
// Shared request types
// ---------------------------------------------------------------------------

type Platform = "tiktok" | "instagram" | "youtube" | "facebook" | "snapchat" | "twitter";

type DateRange = {
  from: string;
  to: string;
};

type BaseRequest = {
  organisationId: string;
  platforms: Platform[];
  dateRange: DateRange;
  matchAllCollections: boolean;
  onlyInUploadRange: boolean;
};

// ---------------------------------------------------------------------------
// 1. Accounts
// ---------------------------------------------------------------------------

export type AccountsRequest = {
  organisationId: string;
  platforms: Platform[];
};

export type ShortimizeAccount = {
  id: string;
  username: string;
  platform: Platform;
  disabled: boolean;
  labels: string[];
  kind: string;
  account_id: string;
  filterIdentifier: string;
};

export type AccountsResponse = {
  data: ShortimizeAccount[];
  meta: { count: number; requestId: string };
};

// ---------------------------------------------------------------------------
// 2. Virality Analysis
// ---------------------------------------------------------------------------

export type ViralityAnalysisRequest = BaseRequest;

export type ViralityBrackets = {
  "Below 1x": number;
  "1x-5x": number;
  "5x-10x": number;
  "10x-25x": number;
  "25x-50x": number;
  "50x-100x": number;
  "100x+": number;
};

export type ViralityAnalysisResponse = {
  data: ViralityBrackets;
  meta: { videosCount: number; requestId: string; cached: boolean; duration: number };
};

// ---------------------------------------------------------------------------
// 3. Metrics Time Series
// ---------------------------------------------------------------------------

export type MetricsTimeSeriesRequest = BaseRequest & {
  accountTrackingTypes: Record<string, "all_videos">;
  useOrganisationLevel: boolean;
  skipFollowersFollowing: boolean;
  selectedRevenueSources: { type: string; projectId: string | null }[];
};

export type DailyMetrics = {
  organisation_id: string;
  date: string;
  total_views: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_bookmarks: number;
  total_engagements: number;
  total_ads: number;
  updated_at: string;
  ads_upload_count: number;
  granularity: "daily";
};

export type MetricsTimeSeriesResponse = {
  data: DailyMetrics[];
  meta: {
    count: number;
    requestId: string;
    queryStrategy: string;
    queryExplanation: string;
    uploadCountsByDate: Record<string, number>;
  };
};

// ---------------------------------------------------------------------------
// 4. Revenue Combined
// ---------------------------------------------------------------------------

export type RevenueCombinedRequest = {
  organisationId: string;
  currentDateRange: DateRange;
  includeTimeSeries: boolean;
};

export type RevenueCombinedResponse = {
  current: {
    total: number;
    timeSeries: { date: string; amount: number }[];
    currency: string;
  };
  previous: { total: number };
  currency: string;
  hadCurrencyConversion: boolean;
};

// ---------------------------------------------------------------------------
// 5. Most Viral Videos
// ---------------------------------------------------------------------------

export type MostViralVideosRequest = BaseRequest & {
  count: number;
  showGains: boolean;
};

export type ViralVideo = {
  id: string;
  ad_link: string;
  title: string;
  platform: Platform;
  uploaded_at: string;
  ad_platform_id: string;
  private: boolean;
  removed: boolean;
  account_id: string;
  video_length: number;
  username: string;
  views_gain: number;
  likes_gain: number;
  comments_gain: number;
  shares_gain: number;
  bookmarks_gain: number;
  engagement_gain: number;
  engagement_rate_gain: number;
  views_cumulative: number;
  likes_cumulative: number;
  comments_cumulative: number;
  shares_cumulative: number;
  bookmarks_cumulative: number;
  engagement_cumulative: number;
  engagement_rate_cumulative: number;
  latest_views: number;
  latest_likes: number;
  latest_comments: number;
  latest_shares: number;
  latest_bookmarks: number;
  latest_engagement: number;
  latest_engagement_rate: number;
  ads_tracked_username_id: string;
  created_at: string;
};

export type MostViralVideosResponse = {
  data: ViralVideo[];
  meta: { count: number; requestId: string; cached: boolean; duration: number };
};

// ---------------------------------------------------------------------------
// 6. Duration Analysis
// ---------------------------------------------------------------------------

export type DurationAnalysisRequest = BaseRequest;

export type DurationBracket = {
  value: number;
  count: number;
};

export type DurationAnalysisResponse = {
  data: {
    lengthBrackets: Record<string, DurationBracket>;
    optimalLength: number;
  };
  meta: { videosCount: number; requestId: string; cached: boolean; duration: number };
};

// ---------------------------------------------------------------------------
// 7. Video Stats (paginated)
// ---------------------------------------------------------------------------

export type VideoStatsRequest = BaseRequest & {
  totalAccountCount: number;
  showGains: boolean;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export type VideoStat = {
  id: string;
  ad_link: string;
  title: string;
  platform: Platform;
  uploaded_at: string;
  ad_platform_id: string;
  private: boolean;
  removed: boolean;
  account_id: string;
  video_length: number;
  username: string;
  latest_updated_at: string;
  latest_views: number;
  latest_likes: number;
  latest_comments: number;
  latest_shares: number;
  latest_bookmarks: number;
  latest_engagement: number;
  latest_engagement_rate: number;
  outlier_multiplier: number;
  ads_tracked_username_id: string;
  created_at: string;
  ads_tracked_organisation_created_at: string;
  retry_count: number;
  issue_count: number;
  increase_1d: number;
  increase_7d: number;
  views_1d_ago: number;
  likes_1d_ago: number;
  comments_1d_ago: number;
  bookmarks_1d_ago: number;
  shares_1d_ago: number;
  views_7d_ago: number;
  likes_7d_ago: number;
  comments_7d_ago: number;
  bookmarks_7d_ago: number;
  shares_7d_ago: number;
  median_views: number;
  total: number;
  history_array: unknown[];
  hashtags: string[];
  label_ids: string[];
  labels: unknown;
  accounts_tracked: unknown;
  created_by: string;
};

export type VideoStatsResponse = {
  data: VideoStat[];
  meta: { count: number; requestId: string };
};

// ---------------------------------------------------------------------------
// Daily snapshot aggregate (what we store per day)
// ---------------------------------------------------------------------------

export type ShortimizeDailySnapshot = {
  date: string;
  metrics: DailyMetrics;
  viralityBrackets: ViralityBrackets;
  durationAnalysis: { lengthBrackets: Record<string, DurationBracket>; optimalLength: number };
  topVideos: ViralVideo[];
  revenue: { total: number; currency: string };
  videoCount: number;
};
