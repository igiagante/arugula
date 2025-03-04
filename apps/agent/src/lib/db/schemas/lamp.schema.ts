import type { InferSelectModel } from "drizzle-orm";
import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { indoor } from "./indoor.schema";

export const lamp = pgTable("Lamp", {
  id: uuid("id").defaultRandom().primaryKey(),
  indoorId: uuid("indoorId")
    .notNull()
    .references(() => indoor.id, { onDelete: "cascade" }),
  lampType: text("lampType").notNull(),
  lightIntensity: numeric("lightIntensity"),
  fanSpeed: numeric("fanSpeed"),
  current: numeric("current", { precision: 5, scale: 2 }),
  voltage: numeric("voltage", { precision: 5, scale: 1 }),
  power: numeric("power", { precision: 6, scale: 1 }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Lamp = InferSelectModel<typeof lamp>;
