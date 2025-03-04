import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { indoor } from "./indoor.schema";
import { organization } from "./organization.schema";

export const grow = pgTable(
  "Grow",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    indoorId: uuid("indoorId")
      .notNull()
      .references(() => indoor.id, { onDelete: "cascade" }),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    stage: text("stage").notNull(),
    startDate: timestamp("startDate", { withTimezone: true }),
    endDate: timestamp("endDate", { withTimezone: true }),
    progress: numeric("progress", { precision: 3, scale: 1 }),
    archived: boolean("archived").default(false).notNull(),
    substrateComposition: jsonb("substrateComposition"),
    potSize: numeric("potSize", { precision: 5, scale: 2 }),
    potSizeUnit: varchar("potSizeUnit", { length: 10 }).default("L"),
    growingMethod: text("growingMethod"),
    images: text("images").array(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: index("grow_organizationId_idx").on(
        table.organizationId
      ),
    };
  }
);

export type Grow = InferSelectModel<typeof grow>;
