// lib/db/queries/plantQueries.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type Plant, plant, strain } from "../schema"; // adjust the path as needed

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE a Plant.
 *
 * @param growId - UUID of the grow this plant belongs to
 * @param strainId - UUID of the strain (optional if not selected)
 * @param customName - User-defined name for the plant
 * @param stage - Growth stage (e.g., "seedling", "vegetative")
 * @param startDate - Date when the plant was started
 * @param archived - Whether the plant is archived
 * @param notes - Additional notes for the plant
 * @param potSize - Optional pot size override for this plant
 * @returns The newly inserted plant record.
 */
export async function createPlant({
  growId,
  strainId,
  customName,
  stage,
  potSize,
}: Omit<Plant, "id" | "archived" | "createdAt" | "updatedAt">) {
  try {
    const [newPlant] = await db
      .insert(plant)
      .values({
        growId,
        strainId,
        customName,
        stage,
        archived: false,
        potSize,
      })
      .returning();
    return newPlant;
  } catch (error) {
    console.error("Failed to create plant:", error);
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
  data: Partial<Plant>;
}) {
  try {
    const [updatedPlant] = await db
      .update(plant)
      .set(data)
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
    const plants = await db.select().from(plant).where(eq(plant.id, plantId));
    return plants[0];
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
export async function getPlantsByGrowId({ growId }: { growId: string }) {
  try {
    const plantsList = await db
      .select()
      .from(plant)
      .where(eq(plant.growId, growId));
    return plantsList;
  } catch (error) {
    console.error("Failed to get plants by grow id:", error);
    throw error;
  }
}

/**
 * GET a Plant by its ID with optional strain relation.
 *
 * @param plantId - The plant's UUID
 * @param includeStrain - Whether to include the strain relation
 * @returns The plant record with optional strain data.
 */
export async function getPlantWithStrain({ plantId }: { plantId: string }) {
  try {
    const plants = await db
      .select()
      .from(plant)
      .leftJoin(strain, eq(plant.strainId, strain.id))
      .where(eq(plant.id, plantId));
    return plants[0];
  } catch (error) {
    console.error("Failed to get plant with strain:", error);
    throw error;
  }
}
