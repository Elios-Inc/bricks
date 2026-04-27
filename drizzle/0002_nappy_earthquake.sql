ALTER TABLE "tracked_people" ALTER COLUMN "bricks_start_date" SET DEFAULT CURRENT_DATE;--> statement-breakpoint
UPDATE "tracked_people" SET "bricks_start_date" = '2026-04-01' WHERE "bricks_start_date" IS NULL;--> statement-breakpoint
ALTER TABLE "tracked_people" ALTER COLUMN "bricks_start_date" SET NOT NULL;