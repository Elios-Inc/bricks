export async function register() {
  // Only run migrations on the Node.js server, not in the Edge runtime.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrateDatabase } = await import("@/db/migrate");
    await migrateDatabase();
  }
}
