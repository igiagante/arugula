import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  json,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
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
  preferences: jsonb("preferences"),
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

  // Dimensions
  height: numeric("height", { precision: 5, scale: 2 }),
  width: numeric("width", { precision: 5, scale: 2 }),
  length: numeric("length", { precision: 5, scale: 2 }),
  dimensionUnit: varchar("dimensionUnit", { length: 10 }).default("cm"),

  // Environment
  temperature: numeric("temperature"),
  humidity: numeric("humidity"),
  co2: numeric("co2"),

  // Images
  images: text("images").array(),

  // Notes
  notes: text("notes"),

  // Created by
  createdBy: text("createdBy")
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Indoor = InferSelectModel<typeof indoor>;

// Lamp table
export const lamp = pgTable("Lamp", {
  id: uuid("id").defaultRandom().primaryKey(),
  indoorId: uuid("indoorId")
    .notNull()
    .references(() => indoor.id, { onDelete: "cascade" }),
  lampType: text("lampType").notNull(),
  lightIntensity: numeric("lightIntensity"),
  fanSpeed: numeric("fanSpeed"),
  current: numeric("current", { precision: 5, scale: 2 }), // Amperes (A)
  voltage: numeric("voltage", { precision: 5, scale: 1 }), // Volts (V)
  power: numeric("power", { precision: 6, scale: 1 }), // Watts (W)
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Lamp = InferSelectModel<typeof lamp>;

// GrowCollaborator table
export const growCollaborator = pgTable(
  "GrowCollaborator",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    growId: uuid("growId")
      .notNull()
      .references(() => grow.id, { onDelete: "cascade" }),
    userId: text("userId")
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

// Grow table
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

// Strain table
export const strain = pgTable("Strain", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  genotype: text("genotype"), // e.g. "Northern Lights x White Widow"
  breeder: text("breeder"), // e.g. "Sensi Seeds"
  floweringType: text("floweringType"), // photoperiod, autoflowering, etc.
  ratio: text("ratio"), // e.g. "Indica 80/20"

  // Indoor grow info
  indoorVegTime: text("indoorVegTime"),
  indoorFlowerTime: text("indoorFlowerTime"),
  indoorYield: text("indoorYield"),
  indoorHeight: text("indoorHeight"),
  outdoorHeight: text("outdoorHeight"),
  outdoorYield: text("outdoorYield"),

  // Cannabinoid profile
  cannabinoidProfile: jsonb("cannabinoidProfile"),

  // Terpene profile
  terpeneProfile: text("terpeneProfile"),

  awards: text("awards"),
  description: text("description"),
  images: text("images").array(),
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

export type Plant = InferSelectModel<typeof plant>;

// PlantNote table
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

export type PlantNote = InferSelectModel<typeof plantNote>;

// TaskType table
export const taskType = pgTable("TaskType", {
  id: text("id").primaryKey().notNull(),
  label: text("label").notNull(),
  icon: text("icon"),

  // Keep schema as JSONB as it defines the structure for task details
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

  // Keep details as JSONB since it follows the schema defined in taskType
  details: jsonb("details"),

  // Replace images JSONB with array
  images: text("images").array(),

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

  // Keep data as JSONB since sensor data structure can vary
  // and evolve over time
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

  // Keep extraData as JSONB for flexibility with product-specific attributes
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
