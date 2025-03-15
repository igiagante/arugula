import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { grow, growCollaborator, type Indoor, indoor } from "../schemas";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const dbDrizzle = drizzle(client);

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
 * @param organizationId - Organization ID that this indoor belongs to
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
  organizationId,
}: Omit<Indoor, "id" | "createdAt" | "updatedAt">) {
  try {
    // Drizzle's insert(...).values(...).returning() returns an array
    const [newIndoor] = await dbDrizzle
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
        organizationId, // references the organization ID
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
    const [updatedIndoor] = await dbDrizzle
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
    const [deletedIndoor] = await dbDrizzle
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
    const userIndoors = await dbDrizzle
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
    const results = await dbDrizzle
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
 * Access is granted if user is a collaborator on an associated grow.
 *
 * @param indoorId - The indoor's UUID
 * @param userId - Clerk user ID to verify access
 * @param organizationId - Organization ID to verify context
 * @returns The indoor record or null if not found
 */
export async function getIndoorById({
  indoorId,
  userId,
  organizationId,
}: {
  indoorId: string;
  userId: string;
  organizationId: string;
}) {
  try {
    // Check if user is a collaborator on a grow that uses this indoor
    const [result] = await dbDrizzle
      .select({
        indoor: indoor,
      })
      .from(indoor)
      .innerJoin(grow, eq(indoor.id, grow.indoorId))
      .innerJoin(growCollaborator, eq(grow.id, growCollaborator.growId))
      .where(
        and(
          eq(indoor.id, indoorId),
          eq(grow.organizationId, organizationId),
          eq(growCollaborator.userId, userId)
        )
      );

    return result ? result.indoor : null;
  } catch (error) {
    console.error("Failed to get indoor by id:", error);
    throw error;
  }
}

/**
 * Get all indoor spaces by organization ID
 *
 * @param params - Object containing userId and organizationId
 * @returns Promise<Indoor[]> Array of accessible indoor spaces
 */
export async function getIndoorsByOrganizationId({
  userId,
  orgId,
}: {
  userId: string;
  orgId: string;
}) {
  try {
    // Get all indoors in the organization
    const indoors = await dbDrizzle
      .select()
      .from(indoor)
      .where(eq(indoor.organizationId, orgId));

    return indoors;
  } catch (error) {
    console.error("Failed to get indoors by organization id:", error);
    throw error;
  }
}
