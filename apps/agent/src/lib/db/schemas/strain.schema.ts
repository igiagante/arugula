import type { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const strain = pgTable("Strain", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  genotype: text("genotype"),
  breeder: text("breeder"),
  floweringType: text("floweringType"),
  ratio: text("ratio"),
  indoorVegTime: text("indoorVegTime"),
  indoorFlowerTime: text("indoorFlowerTime"),
  indoorYield: text("indoorYield"),
  indoorHeight: text("indoorHeight"),
  outdoorHeight: text("outdoorHeight"),
  outdoorYield: text("outdoorYield"),
  cannabinoidProfile: jsonb("cannabinoidProfile"),
  terpeneProfile: text("terpeneProfile"),
  awards: text("awards"),
  description: text("description"),
  images: text("images").array(),
});

export type Strain = InferSelectModel<typeof strain>;
