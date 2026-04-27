CREATE TABLE "shortimize_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shortimize_account_id" text NOT NULL,
	"username" text NOT NULL,
	"platform" text NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shortimize_accounts_shortimize_account_id_unique" UNIQUE("shortimize_account_id")
);
--> statement-breakpoint
CREATE TABLE "shortimize_daily_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_date" date NOT NULL,
	"total_views" bigint DEFAULT 0 NOT NULL,
	"total_likes" integer DEFAULT 0 NOT NULL,
	"total_comments" integer DEFAULT 0 NOT NULL,
	"total_shares" integer DEFAULT 0 NOT NULL,
	"total_bookmarks" integer DEFAULT 0 NOT NULL,
	"total_engagements" integer DEFAULT 0 NOT NULL,
	"total_ads" integer DEFAULT 0 NOT NULL,
	"ads_upload_count" integer DEFAULT 0 NOT NULL,
	"virality_below_1x" integer DEFAULT 0 NOT NULL,
	"virality_1x_5x" integer DEFAULT 0 NOT NULL,
	"virality_5x_10x" integer DEFAULT 0 NOT NULL,
	"virality_10x_25x" integer DEFAULT 0 NOT NULL,
	"virality_25x_50x" integer DEFAULT 0 NOT NULL,
	"virality_50x_100x" integer DEFAULT 0 NOT NULL,
	"virality_100x_plus" integer DEFAULT 0 NOT NULL,
	"virality_video_count" integer DEFAULT 0 NOT NULL,
	"dur_0_5_count" integer DEFAULT 0 NOT NULL,
	"dur_0_5_value" integer DEFAULT 0 NOT NULL,
	"dur_5_10_count" integer DEFAULT 0 NOT NULL,
	"dur_5_10_value" integer DEFAULT 0 NOT NULL,
	"dur_10_15_count" integer DEFAULT 0 NOT NULL,
	"dur_10_15_value" integer DEFAULT 0 NOT NULL,
	"dur_15_20_count" integer DEFAULT 0 NOT NULL,
	"dur_15_20_value" integer DEFAULT 0 NOT NULL,
	"dur_20_25_count" integer DEFAULT 0 NOT NULL,
	"dur_20_25_value" integer DEFAULT 0 NOT NULL,
	"dur_25_30_count" integer DEFAULT 0 NOT NULL,
	"dur_25_30_value" integer DEFAULT 0 NOT NULL,
	"dur_30_35_count" integer DEFAULT 0 NOT NULL,
	"dur_30_35_value" integer DEFAULT 0 NOT NULL,
	"dur_35_40_count" integer DEFAULT 0 NOT NULL,
	"dur_35_40_value" integer DEFAULT 0 NOT NULL,
	"dur_40_45_count" integer DEFAULT 0 NOT NULL,
	"dur_40_45_value" integer DEFAULT 0 NOT NULL,
	"dur_45_50_count" integer DEFAULT 0 NOT NULL,
	"dur_45_50_value" integer DEFAULT 0 NOT NULL,
	"dur_50_55_count" integer DEFAULT 0 NOT NULL,
	"dur_50_55_value" integer DEFAULT 0 NOT NULL,
	"dur_55_60_count" integer DEFAULT 0 NOT NULL,
	"dur_55_60_value" integer DEFAULT 0 NOT NULL,
	"dur_60_plus_count" integer DEFAULT 0 NOT NULL,
	"dur_60_plus_value" integer DEFAULT 0 NOT NULL,
	"optimal_duration" real,
	"revenue_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"revenue_currency" text DEFAULT 'USD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shortimize_daily_metrics_snapshot_date_unique" UNIQUE("snapshot_date")
);
--> statement-breakpoint
CREATE TABLE "shortimize_video_daily_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid NOT NULL,
	"snapshot_date" date NOT NULL,
	"views" bigint,
	"likes" integer,
	"comments" integer,
	"shares" integer,
	"bookmarks" integer,
	"engagement" integer,
	"engagement_rate" real,
	"outlier_multiplier" real,
	"views_1d_ago" bigint,
	"views_7d_ago" bigint,
	"increase_1d" bigint,
	"increase_7d" bigint,
	"hashtags" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortimize_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shortimize_video_id" text NOT NULL,
	"account_id" uuid NOT NULL,
	"platform_content_id" text,
	"platform" text NOT NULL,
	"title" text,
	"ad_link" text,
	"video_length" integer,
	"uploaded_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shortimize_videos_shortimize_video_id_unique" UNIQUE("shortimize_video_id")
);
--> statement-breakpoint
ALTER TABLE "shortimize_video_daily_stats" ADD CONSTRAINT "shortimize_video_daily_stats_video_id_shortimize_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."shortimize_videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortimize_videos" ADD CONSTRAINT "shortimize_videos_account_id_shortimize_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."shortimize_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shortimize_daily_metrics_date_idx" ON "shortimize_daily_metrics" USING btree ("snapshot_date");--> statement-breakpoint
CREATE UNIQUE INDEX "shortimize_video_daily_stats_video_date_idx" ON "shortimize_video_daily_stats" USING btree ("video_id","snapshot_date");--> statement-breakpoint
CREATE INDEX "shortimize_videos_account_idx" ON "shortimize_videos" USING btree ("account_id");