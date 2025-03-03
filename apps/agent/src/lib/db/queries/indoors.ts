import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type Indoor, indoor } from "../schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE an indoor environment.
 *
 * @param name - Name/title of the indoor
 * @param length - Length of the indoor space
 * @param width - Width of the indoor space
 * @param height - Height of the indoor space
 * @param dimensionUnit - Unit of measurement for dimensions (e.g., 'ft', 'm')
 * @param temperature - Temperature setting for the indoor environment
 * @param humidity - Humidity level for the indoor environment
 * @param co2 - CO2 level for the indoor environment
 * @param createdBy - Clerk user ID (text) who is creating it
 * @returns The newly inserted indoor record
 */
export async function createIndoor({
  name,
  length,
  width,
  height,
  dimensionUnit,
  temperature,
  humidity,
  co2,
  images,
  createdBy,
}: Omit<Indoor, "id" | "createdAt" | "updatedAt" | "archived">) {
  try {
    // Drizzle's insert(...).values(...).returning() returns an array
    const [newIndoor] = await db
      .insert(indoor)
      .values({
        name,
        length,
        width,
        height,
        dimensionUnit,
        temperature,
        humidity,
        co2,
        images,
        createdBy, // references a text user ID from Clerk
      })
      .returning(); // get the inserted row back

    return newIndoor;
  } catch (error) {
    console.error("Failed to create indoor:", error);
    throw error;
  }
}

/**
 * UPDATE an indoor environment.
 *
 * @param id - The indoor's UUID
 * @param name - New name for the indoor
 * @param length - New length of the indoor space
 * @param width - New width of the indoor space
 * @param height - New height of the indoor space
 * @param dimensionUnit - New unit of measurement for dimensions (e.g., 'ft', 'm')
 * @param temperature - New temperature setting for the indoor environment
 * @param humidity - New humidity level for the indoor environment
 * @param co2 - New CO2 level for the indoor environment
 * @returns The updated indoor record
 */
export async function updateIndoor({
  id,
  name,
  length,
  width,
  height,
  dimensionUnit,
  temperature,
  humidity,
  co2,
}: Omit<Indoor, "createdBy" | "createdAt" | "updatedAt">) {
  try {
    // If you want to enforce that only the owner can update:
    // .where(and(eq(Indoor.id, indoorId), eq(Indoor.createdBy, userId)))
    // For simplicity, we just match by indoorId:
    const [updatedIndoor] = await db
      .update(indoor)
      .set({
        name,
        length,
        width,
        height,
        dimensionUnit,
        temperature,
        humidity,
        co2,
        // updatedAt will be auto if you have triggers or can set new Date() here
      })
      .where(eq(indoor.id, id))
      .returning();

    return updatedIndoor;
  } catch (error) {
    console.error("Failed to update indoor:", error);
    throw error;
  }
}

/**
 * DELETE an indoor environment entirely.
 *
 * @param indoorId - The indoor's UUID to delete
 * @returns The deleted indoor record
 */
export async function deleteIndoor({ indoorId }: { indoorId: string }) {
  try {
    // If you need to ensure the user is the owner, do something like:
    const [deletedIndoor] = await db
      .delete(indoor)
      .where(eq(indoor.id, indoorId))
      .returning(); // Returns the deleted row

    return deletedIndoor;
  } catch (error) {
    console.error("Failed to delete indoor:", error);
    throw error;
  }
}

/**
 * Get all indoor environments created by the user.
 *
 * @param userId - Clerk user ID (text)
 * @returns A list of indoor records where createdBy equals the userId
 */
export async function getIndoorsByUserId({ userId }: { userId: string }) {
  try {
    // Fetch rows from 'Indoor' where 'createdBy' = userId
    const userIndoors = await db
      .select()
      .from(indoor)
      .where(eq(indoor.createdBy, userId));

    return userIndoors;
  } catch (error) {
    console.error("Failed to get indoors by user id:", error);
    throw error;
  }
}

/**
 * Get all indoor environments where the user is either the owner or a collaborator.
 *
 * @param userId - Clerk user ID (text)
 * @returns A list of indoor records, including those where the user is a collaborator.
 */
export async function getIndoorsWithMyCollaboration({
  userId,
}: {
  userId: string;
}) {
  try {
    const results = await db
      .select({
        indoorId: indoor.id,
        name: indoor.name,
        createdBy: indoor.createdBy,
      })
      .from(indoor)
      .where(eq(indoor.createdBy, userId));

    return results;
  } catch (error) {
    console.error("Failed to get all indoors (owner or collaborator):", error);
    throw error;
  }
}

/**
 * Get a specific indoor environment by its ID and verify user access.
 *
 * @param indoorId - The indoor's UUID
 * @param userId - Clerk user ID to verify ownership/access
 * @returns The indoor record or null if not found
 */
export async function getIndoorById({
  indoorId,
  userId,
}: {
  indoorId: string;
  userId: string;
}) {
  try {
    const [result] = await db
      .select()
      .from(indoor)
      .where(and(eq(indoor.id, indoorId), eq(indoor.createdBy, userId)));

    return result || null;
  } catch (error) {
    console.error("Failed to get indoor by id:", error);
    throw error;
  }
}
