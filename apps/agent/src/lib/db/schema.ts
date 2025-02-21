import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------
   USERS TABLE
   Clerk userId is a text (e.g. "user_xxx"), so we store as primaryKey
------------------------------------------------------------------ */

export const user = pgTable("User", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull().unique(),
  firstName: text("firstName").notNull().default(""),
  lastName: text("lastName").notNull().default(""),
  imageUrl: text("imageUrl").notNull().default(""),
});

export type User = InferSelectModel<typeof user>;

/* ------------------------------------------------------------------
   ORGANIZATION TABLE
   Store info about each organization
------------------------------------------------------------------ */
export const organization = pgTable("Organization", {
  id: text("id").primaryKey().notNull(),
  domain: text("domain").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export type Organization = InferSelectModel<typeof organization>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: text("userId").references(() => user.id),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id),
  isAdmin: boolean("isAdmin").notNull().default(false),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "sheet"] })
      .notNull()
      .default("text"),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

/* ------------------------------------------------------------------
   INDOORS TABLE
   Store info about each indoor environment
------------------------------------------------------------------ */
export const indoors = pgTable("indoors", {
  // Using UUID for indoors, but you can also do text if you want
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  // user who created the indoor
  createdBy: text("created_by") // references users.id (text)
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Indoor = InferSelectModel<typeof indoors>;

/* ------------------------------------------------------------------
   INDOOR_COLLABORATORS TABLE
   Many users can collaborate on one indoor
------------------------------------------------------------------ */
export const indoorCollaborators = pgTable("indoor_collaborators", {
  id: uuid("id").primaryKey().defaultRandom(),

  // references indoors.id
  indoorId: uuid("indoor_id").notNull(),

  // references users.id (text)
  userId: text("user_id").notNull(),

  role: varchar("role", { length: 50 }).notNull(), // 'owner', 'editor', etc.

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type IndoorCollaborator = InferSelectModel<typeof indoorCollaborators>;

/* ------------------------------------------------------------------
   PLANTS TABLE
   Each plant belongs to an indoor
------------------------------------------------------------------ */
export const plants = pgTable("plants", {
  id: uuid("id").defaultRandom().primaryKey(),

  indoorId: uuid("indoor_id").notNull(),

  name: text("name").notNull(),
  strain: text("strain"),
  stage: varchar("stage", { length: 50 }).default("seedling").notNull(),

  // Example: store as a timestamp
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),

  archived: boolean("archived").default(false).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Plant = InferSelectModel<typeof plants>;

/* ------------------------------------------------------------------
   TASKS TABLE
   Feedings, prunings, transplants, etc.
------------------------------------------------------------------ */
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  indoorId: uuid("indoor_id").notNull(), // which indoor
  userId: text("user_id").notNull(), // Clerk user ID for who performed it

  type: varchar("type", { length: 50 }).notNull(), // 'feeding', 'pruning', etc.
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Task = InferSelectModel<typeof tasks>;

/* ------------------------------------------------------------------
   TASK_PLANTS TABLE
   Many-to-many linking tasks to plants
------------------------------------------------------------------ */
export const taskPlants = pgTable("task_plants", {
  id: uuid("id").defaultRandom().primaryKey(),

  taskId: uuid("task_id").notNull(),
  plantId: uuid("plant_id").notNull(),
});

export type TaskPlant = InferSelectModel<typeof taskPlants>;
