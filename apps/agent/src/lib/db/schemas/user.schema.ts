import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./organization.schema";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const user = pgTable("User", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull().unique(),
  firstName: text("firstName").notNull().default(""),
  lastName: text("lastName").notNull().default(""),
  imageUrl: text("imageUrl").notNull().default(""),
  role: userRoleEnum("role").notNull().default("user"),
  preferences: jsonb("preferences"),
  orgId: text("orgId")
    .notNull()
    .references(() => organization.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = InferSelectModel<typeof user>;
