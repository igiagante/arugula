import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { grow } from "./grow.schema";
import { strain } from "./strain.schema";

export const plant = pgTable("Plant", {
  id: uuid("id").defaultRandom().primaryKey(),
  growId: uuid("growId")
    .notNull()
    .references(() => grow.id, { onDelete: "cascade" }),
  strainId: uuid("strainId").references(() => strain.id, {
    onDelete: "set null",
  }),
  customName: text("customName").notNull(),
  stage: text("stage").default("seedling"),
  archived: boolean("archived").default(false).notNull(),
  potSize: numeric("potSize", { precision: 5, scale: 2 }),
  potSizeUnit: varchar("potSizeUnit", { length: 10 }).default("L"),
  harvestedAt: timestamp("harvestedAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const plantNote = pgTable("PlantNote", {
  id: uuid("id").defaultRandom().primaryKey(),
  plantId: uuid("plantId")
    .notNull()
    .references(() => plant.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  images: text("images").array(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Plant = InferSelectModel<typeof plant>;
export type PlantNote = InferSelectModel<typeof plantNote>;
