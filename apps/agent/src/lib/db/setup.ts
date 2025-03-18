import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function setup() {
  try {
    console.log("🗑️  Resetting database...");
    await execAsync("npx tsx src/lib/db/reset.ts");

    console.log("📝 Generating migrations...");
    await execAsync("drizzle-kit generate:pg");

    console.log("⬆️  Pushing schema changes...");
    await execAsync("drizzle-kit push");

    console.log("🌱 Seeding database...");
    await execAsync("npx tsx src/lib/db/seed/index.ts");

    console.log("✅ Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
