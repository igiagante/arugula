import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "node:path";

config({
  path: path.resolve(process.cwd(), ".env.local"),
});

export default defineConfig({
  schema: "./src/lib/db/schemas/*.schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
