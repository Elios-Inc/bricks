CREATE TYPE "public"."account_category" AS ENUM('personal', 'business');--> statement-breakpoint
ALTER TABLE "social_accounts" ADD COLUMN "account_category" "account_category" NOT NULL;--> statement-breakpoint
ALTER TABLE "tracked_people" ADD COLUMN "email" text;