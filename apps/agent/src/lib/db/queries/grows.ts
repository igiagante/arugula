"use server";

import { eq, and } from "drizzle-orm";
import { grow, indoor, strain, plant, lamp, Grow } from "../schema";
import { createGrowView } from "./views/grows";
import { db } from "../index";
import { GrowView } from "./types/grow";

const GROW_SELECTION = {
  grow: grow,
  indoor: indoor,
  plant: plant,
  strain: strain,
  lamp: lamp,
} as const;

/**
 * Creates a new grow cycle in the database.
 *
 * @param data - The grow cycle data of type Grow
 * @returns Promise<Grow> The newly created grow record
 * @throws {Error} If the database operation fails
 */
export async function createGrow(data: Grow) {
  try {
    // Remove any undefined values from the data object
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ) as Grow;

    // Ensure startDate is a Date object
    if (cleanData.startDate && typeof cleanData.startDate === "string") {
      cleanData.startDate = new Date(cleanData.startDate);
    }

    const [newGrow] = await db.insert(grow).values(cleanData).returning();
    return newGrow;
  } catch (error) {
    console.error("Failed to create grow:", error);
    throw error;
  }
}

/**
 * Updates an existing grow cycle in the database.
 *
 * @param data - The grow cycle data of type Grow
 * @returns Promise<Grow> The updated grow record
 * @throws {Error} If the database operation fails
 */
export async function updateGrow(data: Grow) {
  try {
    // Remove any undefined values from the data object
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ) as Grow;

    const [updatedGrow] = await db
      .update(grow)
      .set(cleanData)
      .where(eq(grow.id, data.id))
      .returning();

    return updatedGrow;
  } catch (error) {
    console.error("Failed to update grow:", error);
    throw error;
  }
}

/**
 * DELETE a grow cycle.
 *
 * @param growId - The grow cycle's UUID to delete
 * @param userId - The user performing the deletion (for optional ownership check)
 * @returns The deleted grow record
 */
export async function deleteGrow({
  growId,
  userId,
}: {
  growId: string;
  userId: string;
}) {
  try {
    const [deletedGrow] = await db
      .delete(grow)
      .where(eq(grow.id, growId))
      .returning();

    return deletedGrow;
  } catch (error) {
    console.error("Failed to delete grow:", error);
    throw error;
  }
}

/**
 * GET all grow cycles for a specific indoor.
 *
 * @param indoorId - The indoor's UUID
 * @param userId - The user performing the query (for optional access check)
 * @returns A list of grow records associated with the specified indoor
 */
export async function getGrowsByIndoorId({
  indoorId,
  userId,
}: {
  indoorId: string;
  userId: string;
}) {
  try {
    const growsList = await db
      .select()
      .from(grow)
      .where(eq(grow.indoorId, indoorId));
    return growsList;
  } catch (error) {
    console.error("Failed to get grows by indoor id:", error);
    throw error;
  }
}

function baseGrowQuery() {
  return db
    .select(GROW_SELECTION)
    .from(grow)
    .leftJoin(indoor, eq(grow.indoorId, indoor.id))
    .leftJoin(lamp, eq(indoor.id, lamp.indoorId))
    .leftJoin(plant, eq(grow.id, plant.growId))
    .leftJoin(strain, eq(plant.strainId, strain.id));
}

export async function getGrowsByUserId({
  userId,
}: {
  userId: string;
}): Promise<GrowView[]> {
  const growsList = await baseGrowQuery().where(eq(grow.userId, userId));

  // Create a Map to store unique grows
  const growsMap = new Map();

  // Process each row and store only unique grows
  for (const row of growsList) {
    if (!growsMap.has(row.grow.id)) {
      growsMap.set(row.grow.id, [row]);
    } else {
      growsMap.get(row.grow.id).push(row);
    }
  }

  // Convert to array and create views, with error handling
  return Array.from(growsMap.values())
    .map((growData) => {
      try {
        const view = createGrowView(growData);
        return view;
      } catch (error) {
        console.error(`Failed to create grow view for data:`, error);
        return null;
      }
    })
    .filter((view): view is GrowView => view !== null);
}

export async function getGrowByIdAndUser({
  growId,
  userId,
}: {
  growId: string;
  userId: string;
}): Promise<GrowView | null> {
  const growData = await baseGrowQuery().where(
    and(eq(grow.id, growId), eq(grow.userId, userId))
  );

  return createGrowView(growData);
}
