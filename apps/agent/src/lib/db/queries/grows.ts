"use server";

import { GrowRoles } from "@/lib/db/types";
import { mapImages } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { db } from "../index";
import {
  grow,
  growCollaborator,
  indoor,
  lamp,
  plant,
  strain,
  type Grow,
} from "../schemas";
import type { GrowStrainPlants, GrowView } from "./types/grow";
import { createGrowView } from "./views/grows";

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
 * @param userId - The user performing the operation
 * @returns Promise<Grow> The newly created grow record
 * @throws {Error} If the database operation fails
 */
export async function createGrow(
  data: Omit<Grow, "id" | "createdAt" | "updatedAt"> & {
    strainPlants: GrowStrainPlants[];
  },
  userId: string
) {
  try {
    // Remove any undefined values from the data object
    const { strainPlants, ...restData } = data;
    const cleanData = Object.fromEntries(
      Object.entries(restData).filter(([_, v]) => v !== undefined)
    ) as Grow;

    // Ensure startDate is a Date object
    if (cleanData.startDate && typeof cleanData.startDate === "string") {
      cleanData.startDate = new Date(cleanData.startDate);
    }

    // Use a transaction to ensure operations succeed or fail together
    return await db.transaction(async (tx) => {
      // Insert the grow
      const [newGrow] = await tx.insert(grow).values(cleanData).returning();

      if (!newGrow) {
        throw new Error("Failed to create grow");
      }

      // Add the creator as an owner collaborator
      await tx.insert(growCollaborator).values({
        growId: newGrow.id,
        userId: userId,
        role: GrowRoles.owner,
      });

      // Create plants for each strain in the grow
      if (strainPlants && strainPlants.length > 0) {
        const plantsToCreate = strainPlants.flatMap(
          (strain: GrowStrainPlants) =>
            Array.from({ length: strain.plants }, (_, index) => ({
              growId: newGrow.id,
              strainId: strain.strainId,
              customName: `${strain.strain} #${index + 1}`,
              status: "seedling",
              potSize: cleanData.potSize,
              potSizeUnit: cleanData.potSizeUnit,
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
        );

        await tx.insert(plant).values(plantsToCreate);
      }

      return newGrow;
    });
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
export async function updateGrow(
  data: Grow & { strainPlants?: GrowStrainPlants[] }
) {
  try {
    const { strainPlants, ...restData } = data;
    const cleanData = Object.fromEntries(
      Object.entries(restData).filter(([_, v]) => v !== undefined)
    ) as Grow;

    return await db.transaction(async (tx) => {
      const [updatedGrow] = await tx
        .update(grow)
        .set(cleanData)
        .where(eq(grow.id, data.id))
        .returning();

      if (!updatedGrow) {
        throw new Error("Failed to update grow");
      }

      // Create new plants for each strain if provided
      if (strainPlants && strainPlants.length > 0) {
        const plantsToCreate = strainPlants.flatMap(
          (strain: GrowStrainPlants) =>
            Array.from({ length: strain.plants }, (_, index) => ({
              growId: updatedGrow.id,
              strainId: strain.strainId,
              customName: `${strain.strain} #${index + 1}`,
              status: "seedling",
              potSize: cleanData.potSize,
              potSizeUnit: cleanData.potSizeUnit,
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
        );

        await tx.insert(plant).values(plantsToCreate);
      }

      return updatedGrow;
    });
  } catch (error) {
    console.error("Failed to update grow:", error);
    throw error;
  }
}

/**
 * DELETE a grow cycle.
 *
 * @param growId - The grow cycle's UUID to delete
 * @returns The deleted grow record
 */
export async function deleteGrow({ growId }: { growId: string }) {
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
export async function getGrowsByIndoorId({ indoorId }: { indoorId: string }) {
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
  const growsList = await baseGrowQuery().innerJoin(
    growCollaborator,
    and(
      eq(grow.id, growCollaborator.growId),
      eq(growCollaborator.userId, userId)
    )
  );

  const growsMap = new Map();

  for (const row of growsList) {
    if (!growsMap.has(row.grow.id)) {
      growsMap.set(row.grow.id, [row]);
    } else {
      growsMap.get(row.grow.id).push(row);
    }
  }

  const views = await Promise.all(
    Array.from(growsMap.values()).map(async (growData) => {
      try {
        return createGrowView(growData);
      } catch (error) {
        return null;
      }
    })
  );

  const filteredViews = views.filter((view): view is GrowView => view !== null);
  const result = await Promise.all(
    filteredViews.map((view) => mapImages(view))
  );

  return result;
}

export async function getGrowByIdAndUser({
  growId,
  userId,
}: {
  growId: string;
  userId: string;
}): Promise<GrowView | { error: string; code: string; status: number } | null> {
  try {
    const growData = await baseGrowQuery().innerJoin(
      growCollaborator,
      and(
        eq(grow.id, growCollaborator.growId),
        eq(growCollaborator.userId, userId),
        eq(grow.id, growId)
      )
    );

    // If no data was found, check if the grow exists at all
    if (growData.length === 0) {
      const growExists = await db
        .select({ id: grow.id })
        .from(grow)
        .where(eq(grow.id, growId));

      // Check if the user has access to this grow
      if (growExists.length > 0) {
        const userHasAccess = await db
          .select({ id: growCollaborator.id })
          .from(growCollaborator)
          .where(
            and(
              eq(growCollaborator.growId, growId),
              eq(growCollaborator.userId, userId)
            )
          );

        if (!userHasAccess.length) {
          return {
            error: "You don't have permission to access this grow",
            code: "UNAUTHORIZED",
            status: 403,
          };
        }
      } else {
        return {
          error: "Grow not found",
          code: "NOT_FOUND",
          status: 404,
        };
      }

      return null;
    }

    const view = createGrowView(growData);
    const result = view ? await mapImages(view) : null;

    return result;
  } catch (error) {
    console.error("Error fetching grow:", error);
    return {
      error: "An error occurred while fetching the grow",
      code: "INTERNAL_SERVER_ERROR",
      status: 500,
    };
  }
}

/**
 * GET all grows for a specific organization.
 *
 * @param organizationId - The organization's ID
 * @returns Promise<GrowView[]> Array of grow views with their associated data
 */
export async function getGrowsByOrganizationId(
  organizationId: string
): Promise<GrowView[]> {
  console.log("organizationId", organizationId);
  const growsList = await db
    .select({
      grow: grow,
      indoor: indoor,
      plant: plant,
      strain: strain,
      lamp: lamp,
    })
    .from(grow)
    .where(eq(grow.organizationId, organizationId))
    .leftJoin(indoor, eq(grow.indoorId, indoor.id))
    .leftJoin(plant, eq(grow.id, plant.growId))
    .leftJoin(strain, eq(plant.strainId, strain.id))
    .leftJoin(lamp, eq(indoor.id, lamp.indoorId))
    .orderBy(plant.id);

  const growsMap = new Map();

  for (const row of growsList) {
    if (!growsMap.has(row.grow.id)) {
      growsMap.set(row.grow.id, [row]);
    } else {
      const existingRows = growsMap.get(row.grow.id);
      const plantExists = existingRows.some(
        (existingRow: typeof row) => existingRow.plant?.id === row.plant?.id
      );
      if (!plantExists) {
        growsMap.get(row.grow.id).push(row);
      }
    }
  }

  const views = await Promise.all(
    Array.from(growsMap.values()).map(async (growData) => {
      try {
        return createGrowView(growData);
      } catch (error) {
        return null;
      }
    })
  );

  const filteredViews = views.filter((view): view is GrowView => view !== null);
  const result = await Promise.all(
    filteredViews.map((view) => mapImages(view))
  );

  return result;
}
