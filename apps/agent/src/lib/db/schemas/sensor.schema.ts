import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { indoor } from "./indoor.schema";

export const sensorReading = pgTable("SensorReading", {
  id: uuid("id").defaultRandom().primaryKey(),
  indoorId: uuid("indoorId")
    .notNull()
    .references(() => indoor.id, { onDelete: "cascade" }),
  recordedAt: timestamp("recordedAt", { withTimezone: true }).defaultNow(),
  data: jsonb("data").notNull(),
});

export type SensorReading = InferSelectModel<typeof sensorReading>;
