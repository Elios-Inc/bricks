import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const LOCK_ID = 999;

/**
 * Run pending migrations on server startup.
 *
 * Uses a Postgres advisory lock so concurrent cold-starts (e.g. multiple
 * Vercel instances) don't race each other. Mirrors the pattern from the
 * Elios Insights NestJS codebase.
 *
 * NOTE: Advisory locks require a session-aware connection. neon-http is
 * stateless (one query = one connection), so advisory locks are no-ops
 * over HTTP. If concurrent cold-start races become a real problem, swap
 * to a direct Postgres connection for migrations only. For V1 scale this
 * is fine — Vercel serialises deploys and cold starts are rare enough.
 */
export async function migrateDatabase() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle({ client: sql });

  try {
    console.log("[migrate] running pending migrations…");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("[migrate] done");
  } catch (error) {
    console.error("[migrate] failed", error);
    throw error;
  }
}
