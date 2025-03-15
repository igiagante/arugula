// lib/db/queries/plantQueries.ts
import { mapImages } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type Plant, plant, plantNote, strain } from "../schemas"; // adjust the path as needed
import { PlantWithStrain } from "./types/plant";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const plantSelection = {
  id: plant.id,
  growId: plant.growId,
  strainId: plant.strainId,
  customName: plant.customName,
  stage: plant.stage,
  archived: plant.archived,
  potSize: plant.potSize,
  potSizeUnit: plant.potSizeUnit,
  harvestedAt: plant.harvestedAt,
  createdAt: plant.createdAt,
  updatedAt: plant.updatedAt,
  notes: plant.notes,
  images: plant.images,
  strain: {
    id: strain.id,
    name: strain.name,
    type: strain.type,
    cannabinoidProfile: strain.cannabinoidProfile,
    description: strain.description,
    ratio: strain.ratio,
    images: strain.images,
  },
} as const;

/**
 * CREATE a Plant.
 *
 * @param growId - UUID of the grow this plant belongs to
 * @param strainId - UUID of the strain (optional if not selected)
 * @param customName - User-defined name for the plant
 * @param stage - Growth stage (e.g., "seedling", "vegetative")
 * @param potSize - Size of the pot the plant is in
 * @param potSizeUnit - Unit of measurement for the pot size
 * @param notes - Additional notes for the plant
 * @param images - Images of the plant
 * @returns The newly inserted plant record.
 */
export async function createPlant({
  growId,
  strainId,
  customName,
  stage,
  potSize,
  notes,
  images,
}: Omit<Plant, "id" | "archived" | "createdAt" | "updatedAt">) {
  try {
    console.log("growId", growId);
    const [newPlant] = await db
      .insert(plant)
      .values({
        growId,
        strainId,
        customName,
        stage,
        potSize,
        notes,
        images,
      })
      .returning();

    console.log("newPlant", newPlant);
    return newPlant;
  } catch (error) {
    console.error("Failed to create plant:", error);
    throw error;
  }
}

export async function createPlantNote({
  plantId,
  content,
  images,
}: {
  plantId: string;
  content: string;
  images: string[];
}) {
  try {
    const [newNote] = await db
      .insert(plantNote)
      .values({
        plantId,
        content,
        images,
        createdAt: new Date(),
      })
      .returning();
    return newNote;
  } catch (error) {
    console.error("Failed to create plant note:", error);
    throw error;
  }
}

export async function updatePlantNote({
  noteId,
  content,
  images,
}: {
  noteId: string;
  content: string;
  images: string[];
}) {
  try {
    const [updatedNote] = await db
      .update(plantNote)
      .set({
        content,
        images,
        updatedAt: new Date(),
      })
      .where(eq(plantNote.id, noteId))
      .returning();
    return updatedNote;
  } catch (error) {
    console.error("Failed to update plant note:", error);
    throw error;
  }
}

/**
 * UPDATE a Plant.
 *
 * @param plantId - The plant's UUID
 * @param data - Object with fields to update (e.g., customName, stage, notes, potSize)
 * @returns The updated plant record.
 */
export async function updatePlant({
  plantId,
  data,
}: {
  plantId: string;
  data: Partial<Omit<Plant, "id" | "createdAt" | "updatedAt" | "growId">>;
}) {
  try {
    const [updatedPlant] = await db
      .update(plant)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(plant.id, plantId))
      .returning();

    return updatedPlant;
  } catch (error) {
    console.error("Failed to update plant:", error);
    throw error;
  }
}

/**
 * DELETE a Plant.
 *
 * @param plantId - The plant's UUID to delete
 * @returns The deleted plant record.
 */
export async function deletePlant({ plantId }: { plantId: string }) {
  try {
    const [deletedPlant] = await db
      .delete(plant)
      .where(eq(plant.id, plantId))
      .returning();
    return deletedPlant;
  } catch (error) {
    console.error("Failed to delete plant:", error);
    throw error;
  }
}

/**
 * GET a Plant by its ID.
 *
 * @param plantId - The plant's UUID
 * @returns The plant record.
 */
export async function getPlantById({ plantId }: { plantId: string }) {
  try {
    const [plantData] = await db
      .select(plantSelection)
      .from(plant)
      .leftJoin(strain, eq(plant.strainId, strain.id))
      .where(eq(plant.id, plantId));

    return plantData
      ? mapImages({ ...plantData, images: plantData.images || [] })
      : null;
  } catch (error) {
    console.error("Failed to get plant by id:", error);
    throw error;
  }
}

/**
 * GET all Plants for a given Grow.
 *
 * @param growId - The grow cycle's UUID
 * @returns An array of plant records for the specified grow.
 */
export async function getPlantsByGrowId({
  growId,
}: {
  growId: string;
}): Promise<PlantWithStrain[]> {
  try {
    const plantsList = await db
      .select(plantSelection)
      .from(plant)
      .leftJoin(strain, eq(plant.strainId, strain.id))
      .where(eq(plant.growId, growId));

    return Promise.all(
      plantsList.map((plant) =>
        mapImages({ ...plant, images: plant.images || [] })
      )
    ) as Promise<PlantWithStrain[]>;
  } catch (error) {
    console.error("Failed to get plants by grow id:", error);
    throw error;
  }
}

export async function getPlantByGrowId({
  growId,
  plantId,
}: {
  growId: string;
  plantId: string;
}): Promise<PlantWithStrain | null> {
  try {
    const [plantData] = await db
      .select(plantSelection)
      .from(plant)
      .leftJoin(strain, eq(plant.strainId, strain.id))
      .where(and(eq(plant.growId, growId), eq(plant.id, plantId)));

    return plantData
      ? mapImages({
          ...plantData,
          strain: plantData.strain
            ? {
                ...plantData.strain,
                cannabinoidProfile: plantData.strain.cannabinoidProfile as {
                  thc: number;
                  cbd: number;
                } | null,
                images: plantData.strain.images || [],
              }
            : null,
          images: plantData.images || [],
        })
      : null;
  } catch (error) {
    console.error("Failed to get plant:", error);
    throw error;
  }
}
