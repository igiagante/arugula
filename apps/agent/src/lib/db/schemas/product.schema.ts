import type { InferSelectModel } from "drizzle-orm";
import {
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { task } from "./task.schema";

export const product = pgTable("Product", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  category: text("category"),
  defaultCost: numeric("defaultCost", { precision: 10, scale: 2 }),
  description: text("description"),
  productUrl: text("productUrl"),
  extraData: jsonb("extraData"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const taskProduct = pgTable("TaskProduct", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("taskId")
    .notNull()
    .references(() => task.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  quantity: numeric("quantity", { precision: 10, scale: 2 }),
  unit: text("unit"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Product = InferSelectModel<typeof product>;
export type TaskProduct = InferSelectModel<typeof taskProduct>;
