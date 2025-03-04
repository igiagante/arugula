import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull().unique(),
  firstName: text("firstName").notNull().default(""),
  lastName: text("lastName").notNull().default(""),
  imageUrl: text("imageUrl").notNull().default(""),
  preferences: jsonb("preferences"),
});

export type User = InferSelectModel<typeof user>;
