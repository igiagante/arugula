import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { grow } from "./grow.schema";
import { user } from "./user.schema";

export const growCollaborator = pgTable(
  "GrowCollaborator",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    growId: uuid("growId")
      .notNull()
      .references(() => grow.id, { onDelete: "cascade" }),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    role: varchar("role", {
      enum: ["owner", "grower", "trimmer", "seller", "consultant", "viewer"],
    }).notNull(),
    archived: boolean("archived").default(false).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueUserGrow: unique().on(table.userId, table.growId),
      userIdIdx: index("growCollaborator_userId_idx").on(table.userId),
      growIdIdx: index("growCollaborator_growId_idx").on(table.growId),
    };
  }
);

export type GrowCollaborator = InferSelectModel<typeof growCollaborator>;
