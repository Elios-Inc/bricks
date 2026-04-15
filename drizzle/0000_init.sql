CREATE TYPE "public"."content_type" AS ENUM('post', 'reel', 'short', 'video', 'story');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('instagram', 'tiktok', 'youtube', 'facebook');--> statement-breakpoint
CREATE TYPE "public"."tracked_person_type" AS ENUM('member', 'internal');--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"social_account_id" uuid NOT NULL,
	"platform_content_id" text NOT NULL,
	"type" "content_type",
	"content_url" text,
	"title" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_content_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_item_id" uuid NOT NULL,
	"snapshot_date" date NOT NULL,
	"views" bigint,
	"likes" integer,
	"comments" integer,
	"shares" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_profile_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"social_account_id" uuid NOT NULL,
	"snapshot_date" date NOT NULL,
	"followers" integer,
	"following" integer,
	"total_content_count" integer,
	"avg_views" integer,
	"avg_likes" integer,
	"avg_comments" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_rollups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"social_account_id" uuid NOT NULL,
	"month_start_date" date NOT NULL,
	"avg_views_per_content" integer,
	"median_views" integer,
	"follower_delta" integer,
	"content_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracked_person_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"handle" text NOT NULL,
	"profile_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"tracking_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracked_people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "tracked_person_type" NOT NULL,
	"bricks_start_date" date,
	"notes" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_rollups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"social_account_id" uuid NOT NULL,
	"week_start_date" date NOT NULL,
	"avg_views_per_content" integer,
	"median_views" integer,
	"follower_delta" integer,
	"content_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_content_snapshots" ADD CONSTRAINT "daily_content_snapshots_content_item_id_content_items_id_fk" FOREIGN KEY ("content_item_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_profile_snapshots" ADD CONSTRAINT "daily_profile_snapshots_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_rollups" ADD CONSTRAINT "monthly_rollups_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_tracked_person_id_tracked_people_id_fk" FOREIGN KEY ("tracked_person_id") REFERENCES "public"."tracked_people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_rollups" ADD CONSTRAINT "weekly_rollups_social_account_id_social_accounts_id_fk" FOREIGN KEY ("social_account_id") REFERENCES "public"."social_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_items_social_account_idx" ON "content_items" USING btree ("social_account_id");--> statement-breakpoint
CREATE INDEX "content_items_platform_content_idx" ON "content_items" USING btree ("platform_content_id");--> statement-breakpoint
CREATE INDEX "daily_content_snap_item_date_idx" ON "daily_content_snapshots" USING btree ("content_item_id","snapshot_date");--> statement-breakpoint
CREATE INDEX "daily_profile_snap_account_date_idx" ON "daily_profile_snapshots" USING btree ("social_account_id","snapshot_date");--> statement-breakpoint
CREATE INDEX "monthly_rollup_account_month_idx" ON "monthly_rollups" USING btree ("social_account_id","month_start_date");--> statement-breakpoint
CREATE INDEX "social_accounts_tracked_person_idx" ON "social_accounts" USING btree ("tracked_person_id");--> statement-breakpoint
CREATE INDEX "social_accounts_platform_handle_idx" ON "social_accounts" USING btree ("platform","handle");--> statement-breakpoint
CREATE INDEX "weekly_rollup_account_week_idx" ON "weekly_rollups" USING btree ("social_account_id","week_start_date");