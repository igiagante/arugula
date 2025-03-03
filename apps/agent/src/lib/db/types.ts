import { drizzle } from "drizzle-orm/postgres-js";

export type DrizzleClient = ReturnType<typeof drizzle>;
