import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./organization.schema";

export const site = pgTable("Site", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  orgId: text("orgId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const siteRelations = relations(site, ({ one }) => ({
  organization: one(organization, {
    fields: [site.orgId],
    references: [organization.id],
  }),
}));

export type Site = typeof site.$inferSelect;
export type NewSite = typeof site.$inferInsert;
