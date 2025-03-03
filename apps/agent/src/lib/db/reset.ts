import { config } from "dotenv";
import postgres from "postgres";

config({
  path: ".env.local",
});

const resetAndSeedDatabase = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  // Create a connection with higher timeout for dropping tables
  const connection = postgres(process.env.POSTGRES_URL, {
    max: 1,
    timeout: 10000,
  });

  console.log("⏳ Resetting database...");

  try {
    // Drop all tables in the public schema
    console.log("Dropping all tables...");
    await connection.unsafe(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
        END LOOP;
      END $$;
    `);

    console.log("✅ All tables dropped successfully");
    console.log("🎉 Database reset successfully!");
  } catch (err) {
    console.error("❌ Database reset and seed failed");
    console.error(err);
  } finally {
    process.exit(0);
  }
};

resetAndSeedDatabase().catch((err) => {
  console.error("❌ Database reset and seed failed");
  console.error(err);
  process.exit(1);
});
