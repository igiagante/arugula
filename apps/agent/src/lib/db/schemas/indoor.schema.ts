import type { InferSelectModel } from "drizzle-orm";
import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organization } from "./organization.schema";
import { user } from "./user.schema";

export const indoor = pgTable("Indoor", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  height: numeric("height", { precision: 5, scale: 2 }),
  width: numeric("width", { precision: 5, scale: 2 }),
  length: numeric("length", { precision: 5, scale: 2 }),
  dimensionUnit: varchar("dimensionUnit", { length: 10 }).default("cm"),
  temperature: numeric("temperature"),
  humidity: numeric("humidity"),
  co2: numeric("co2"),
  images: text("images").array(),
  notes: text("notes"),
  createdBy: text("createdBy")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "restrict" }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Indoor = InferSelectModel<typeof indoor>;
