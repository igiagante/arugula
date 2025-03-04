import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { grow } from "./grow.schema";
import { plant } from "./plant.schema";
import { user } from "./user.schema";

export const taskType = pgTable("TaskType", {
  id: text("id").primaryKey().notNull(),
  label: text("label").notNull(),
  icon: text("icon"),
  schema: jsonb("schema"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const task = pgTable("Task", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskTypeId: text("taskTypeId")
    .notNull()
    .references(() => taskType.id, { onDelete: "restrict" }),
  growId: uuid("growId")
    .notNull()
    .references(() => grow.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  notes: text("notes"),
  details: jsonb("details"),
  images: text("images").array(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const taskPlant = pgTable("TaskPlant", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("taskId")
    .notNull()
    .references(() => task.id, { onDelete: "cascade" }),
  plantId: uuid("plantId")
    .notNull()
    .references(() => plant.id, { onDelete: "cascade" }),
});

export type TaskType = InferSelectModel<typeof taskType>;
export type Task = InferSelectModel<typeof task>;
export type TaskPlant = InferSelectModel<typeof taskPlant>;
