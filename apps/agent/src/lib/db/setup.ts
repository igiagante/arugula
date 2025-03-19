import { execSync } from "child_process";
import * as readline from "readline";

function createPrompt(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

async function setup() {
  try {
    console.log("⚠️  Warning: This will reset the database and all its data!");
    const shouldContinue = await createPrompt(
      "Do you want to continue? (y/N): "
    );

    if (!shouldContinue) {
      console.log("❌ Operation cancelled by user");
      process.exit(0);
    }

    console.log("🗑️  Resetting database...");
    execSync("npx tsx src/lib/db/reset.ts", { stdio: "inherit" });

    console.log("📝 Generating migrations...");
    execSync("drizzle-kit generate:pg", { stdio: "inherit" });

    console.log("⬆️  Pushing schema changes...");
    execSync("drizzle-kit push", { stdio: "inherit" });

    console.log("🌱 Seeding database...");
    execSync("npx tsx src/lib/db/seed/index.ts", { stdio: "inherit" });

    console.log("✅ Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
