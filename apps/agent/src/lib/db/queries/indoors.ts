import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, or } from "drizzle-orm";
import { indoor, indoorCollaborator } from "../schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE an indoor environment.
 *
 * @param userId - Clerk user ID (text) who is creating it
 * @param name   - Name/title of the indoor
 * @param location - Location of the indoor
 * @param dimensions - Dimensions of the indoor
 * @param lighting - Lighting of the indoor
 * @param ventilation - Ventilation of the indoor
 * @param recommendedConditions - Recommended conditions for the indoor
 * @returns The newly inserted indoor record
 */
export async function createIndoor({
  userId,
  name,
  location,
  dimensions,
  lighting,
  ventilation,
  recommendedConditions,
}: {
  userId: string;
  name: string;
  location?: string;
  dimensions?: string;
  lighting?: string;
  ventilation?: string;
  recommendedConditions?: any;
}) {
  try {
    // Drizzle's insert(...).values(...).returning() returns an array
    const [newIndoor] = await db
      .insert(indoor)
      .values({
        name,
        location,
        dimensions,
        lighting,
        ventilation,
        recommendedConditions,
        createdBy: userId, // references a text user ID from Clerk
      })
      .returning(); // get the inserted row back

    return newIndoor;
  } catch (error) {
    console.error("Failed to create indoor:", error);
    throw error;
  }
}

/**
 * UPDATE an indoor environment (e.g., rename it).
 *
 * @param indoorId - The indoor's UUID
 * @param userId   - The user performing the update (for optional ownership check)
 * @param name     - New name for the indoor
 * @param location - New location for the indoor
 * @param dimensions - New dimensions for the indoor
 * @param lighting - New lighting for the indoor
 * @param ventilation - New ventilation for the indoor
 * @param recommendedConditions - New recommended conditions for the indoor
 * @returns The updated indoor record
 */
export async function updateIndoor({
  indoorId,
  userId,
  name,
  location,
  dimensions,
  lighting,
  ventilation,
  recommendedConditions,
}: {
  indoorId: string;
  userId: string;
  name: string;
  location?: string;
  dimensions?: string;
  lighting?: string;
  ventilation?: string;
  recommendedConditions?: any;
}) {
  try {
    // If you want to enforce that only the owner can update:
    // .where(and(eq(Indoor.id, indoorId), eq(Indoor.createdBy, userId)))
    // For simplicity, we just match by indoorId:
    const [updatedIndoor] = await db
      .update(indoor)
      .set({
        name,
        location,
        dimensions,
        lighting,
        ventilation,
        recommendedConditions,
        // updatedAt will be auto if you have triggers or can set new Date() here
      })
      .where(eq(indoor.id, indoorId))
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
 * @param userId   - The user performing the delete (for optional ownership check)
 * @returns The deleted indoor record
 */
export async function deleteIndoor({
  indoorId,
  userId,
}: {
  indoorId: string;
  userId: string;
}) {
  try {
    // If you need to ensure the user is the owner, do something like:
    // .where(and(eq(Indoor.id, indoorId), eq(Indoor.createdBy, userId)))
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
export async function getAllIndoorsForUser({ userId }: { userId: string }) {
  try {
    // Using a LEFT JOIN on IndoorCollaborator to include collaborations
    const results = await db
      .select({
        indoorId: indoor.id,
        name: indoor.name,
        createdBy: indoor.createdBy,
        collaboratorId: indoorCollaborator.id,
        collaboratorUserId: indoorCollaborator.userId,
        role: indoorCollaborator.role,
      })
      .from(indoor)
      .leftJoin(indoorCollaborator, eq(indoor.id, indoorCollaborator.indoorId))
      .where(
        or(eq(indoor.createdBy, userId), eq(indoorCollaborator.userId, userId))
      );

    return results;
  } catch (error) {
    console.error("Failed to get all indoors (owner or collaborator):", error);
    throw error;
  }
}
