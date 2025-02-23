import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  json,
  jsonb,
  numeric,
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
    kind: varchar("text", { enum: ["text"] })
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

// Indoor table
export const indoor = pgTable("Indoor", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  dimensions: text("dimensions"),
  lighting: text("lighting"),
  ventilation: text("ventilation"),
  recommendedConditions: jsonb("recommendedConditions"),
  createdBy: text("createdBy")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Indoor = InferSelectModel<typeof indoor>;

// IndoorCollaborator table
export const indoorCollaborator = pgTable("IndoorCollaborator", {
  id: uuid("id").defaultRandom().primaryKey(),
  indoorId: uuid("indoorId")
    .notNull()
    .references(() => indoor.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  role: text("role").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type IndoorCollaborator = InferSelectModel<typeof indoorCollaborator>;

// Grow table
export const grow = pgTable("Grow", {
  id: uuid("id").defaultRandom().primaryKey(),
  // The indoor where this grow is taking place
  indoorId: uuid("indoorId")
    .notNull()
    .references(() => indoor.id, { onDelete: "cascade" }),

  // Added userId field to directly associate the grow with a user
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  name: text("name"),
  stage: text("stage").notNull(),
  startDate: timestamp("startDate", { withTimezone: true }),
  endDate: timestamp("endDate", { withTimezone: true }),
  archived: boolean("archived").default(false).notNull(),

  // New fields for initial setup
  substrateComposition: jsonb("substrateComposition"), // e.g., { soil: 70, perlite: 20, coco: 10 }
  potSize: jsonb("potSize").notNull().default({ size: 0, unit: "L" }), // e.g., { size: 7.5, unit: "L" }
  growingMethod: text("growingMethod"), // e.g., "soil", "hydroponic", "coco"

  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Grow = InferSelectModel<typeof grow>;

// Strain table
export const strain = pgTable("Strain", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  breeder: text("breeder"),
  genotype: text("genotype"),
  ratio: text("ratio"),
  floweringType: text("floweringType"),
  indoorVegTime: text("indoorVegTime"),
  indoorFlowerTime: text("indoorFlowerTime"),
  indoorYield: text("indoorYield"),
  outdoorHeight: text("outdoorHeight"),
  outdoorYield: text("outdoorYield"),
  harvestMonthOutdoor: text("harvestMonthOutdoor"),
  cannabinoidProfile: jsonb("cannabinoidProfile"),
  resistance: jsonb("resistance"),
  optimalConditions: jsonb("optimalConditions"),
  terpeneProfile: jsonb("terpeneProfile"),
  difficulty: text("difficulty"),
  awards: text("awards"),
  description: text("description"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Strain = InferSelectModel<typeof strain>;

// Plant table
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
  startDate: timestamp("startDate", { withTimezone: true }),
  archived: boolean("archived").default(false).notNull(),
  notes: text("notes"),
  potSize: jsonb("potSize").notNull().default({ size: 0, unit: "L" }), // e.g., { size: 7.5, unit: "L" }
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Plant = InferSelectModel<typeof plant>;

// PlantNote table
export const plantNote = pgTable("PlantNote", {
  id: uuid("id").defaultRandom().primaryKey(),
  plantId: uuid("plantId")
    .notNull()
    .references(() => plant.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  images: jsonb("images"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type PlantNote = InferSelectModel<typeof plantNote>;

// TaskType table
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

export type TaskType = InferSelectModel<typeof taskType>;

// Task table
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
  images: jsonb("images"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Task = InferSelectModel<typeof task>;

// TaskPlant table
export const taskPlant = pgTable("TaskPlant", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("taskId")
    .notNull()
    .references(() => task.id, { onDelete: "cascade" }),
  plantId: uuid("plantId")
    .notNull()
    .references(() => plant.id, { onDelete: "cascade" }),
});

export type TaskPlant = InferSelectModel<typeof taskPlant>;

// SensorReading table
export const sensorReading = pgTable("SensorReading", {
  id: uuid("id").defaultRandom().primaryKey(),
  indoorId: uuid("indoorId")
    .notNull()
    .references(() => indoor.id, { onDelete: "cascade" }),
  recordedAt: timestamp("recordedAt", { withTimezone: true }).defaultNow(),
  data: jsonb("data").notNull(),
});

export type SensorReading = InferSelectModel<typeof sensorReading>;

// Product table
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

export type Product = InferSelectModel<typeof product>;

// TaskProduct table
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

export type TaskProduct = InferSelectModel<typeof taskProduct>;
