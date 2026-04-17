// register() runs once per cold start — before the instance serves any requests.
//
// Migrations run here so the database is always up to date without a separate
// deploy step. When there's nothing new to apply, Drizzle just does a single
// SELECT against __drizzle_migrations and returns (~5-20ms over Neon HTTP).
//
// If cold starts ever feel slow and you have hundreds of migration files, move
// migrations to a deploy-time step instead (e.g. "drizzle-kit migrate" in the
// Vercel build command or a CI job) and remove the migrateDatabase() call here.
export async function register() {
  // Only run migrations on the Node.js server, not in the Edge runtime.
  // The Neon serverless driver is Edge-compatible, but Drizzle's migrator
  // needs node:fs and node:crypto to read SQL files from disk.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (!process.env.DATABASE_URL) {
      console.warn("[migrate] DATABASE_URL not set — skipping migrations");
      return;
    }
    try {
      const { migrateDatabase } = await import("@/db/migrate");
      await migrateDatabase();
    } catch (err) {
      console.warn("[migrate] migration failed — continuing without database", err);
    }
  }
}
