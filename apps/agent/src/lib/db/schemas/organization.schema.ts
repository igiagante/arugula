import type { InferSelectModel } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const organization = pgTable("Organization", {
  id: text("id").primaryKey().notNull(),
  domain: text("domain").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export type Organization = InferSelectModel<typeof organization>;
