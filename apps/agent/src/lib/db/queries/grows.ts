import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import { grow } from "../schema"; // Adjust path according to your project structure

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE a grow cycle.
 *
 * @param indoorId - The UUID of the indoor where the grow is taking place
 * @param userId   - Clerk user ID (text) performing the operation
 * @param name     - Name/title of the grow cycle (e.g., "Spring Test Cycle")
 * @param stage    - Overall stage of the grow (e.g., "vegetative", "flowering")
 * @param startDate - Start date of the grow
 * @param endDate  - End date of the grow (optional)
 * @param substrateComposition - (Optional) Composition of the substrate (e.g., { soil: 70, perlite: 20, coco: 10 })
 * @param potSize  - (Optional) Default pot size used for the grow (in liters)
 * @param growingMethod - (Optional) Kind of growing (e.g., "soil", "hydroponic", "coco")
 * @param archived - (Optional) Whether the grow is archived (defaults to false)
 * @returns The newly inserted grow record
 */
export async function createGrow({
  indoorId,
  userId,
  name,
  stage,
  startDate,
  endDate,
  substrateComposition,
  potSize,
  growingMethod,
  archived = false,
}: {
  indoorId: string;
  userId: string;
  name: string;
  stage: string;
  startDate: Date;
  endDate?: Date;
  substrateComposition?: Record<string, number>;
  potSize?: number;
  growingMethod?: string;
  archived?: boolean;
}) {
  try {
    const [newGrow] = await db
      .insert(grow)
      .values({
        userId,
        indoorId,
        name,
        stage,
        startDate,
        endDate,
        substrateComposition,
        potSize,
        growingMethod,
        archived,
      })
      .returning();

    return newGrow;
  } catch (error) {
    console.error("Failed to create grow:", error);
    throw error;
  }
}

/**
 * UPDATE a grow cycle.
 *
 * @param growId - The grow cycle's UUID
 * @param userId - The user performing the update (for optional ownership check)
 * @param name - New name for the grow cycle
 * @param stage - New overall stage for the grow
 * @param startDate - Updated start date (if needed)
 * @param endDate - Updated end date (if needed)
 * @param substrateComposition - Updated substrate composition
 * @param potSize - Updated default pot size
 * @param growingMethod - Updated growing method
 * @param archived - Updated archive status
 * @returns The updated grow record
 */
export async function updateGrow({
  growId,
  userId,
  name,
  stage,
  startDate,
  endDate,
  substrateComposition,
  potSize,
  growingMethod,
  archived,
}: {
  growId: string;
  userId: string;
  name: string;
  stage: string;
  startDate: Date;
  endDate?: Date;
  substrateComposition?: Record<string, number>;
  potSize?: number;
  growingMethod?: string;
  archived?: boolean;
}) {
  try {
    const [updatedGrow] = await db
      .update(grow)
      .set({
        name,
        stage,
        startDate,
        endDate,
        substrateComposition,
        potSize,
        growingMethod,
        archived,
      })
      .where(eq(grow.id, growId))
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

/**
 * GET all grow cycles for a specific user.
 *
 * @param userId - The user's ID to fetch grows for
 * @returns A list of grow records associated with the specified user
 */
export async function getGrowsByUserId({ userId }: { userId: string }) {
  try {
    const growsList = await db
      .select()
      .from(grow)
      .where(eq(grow.userId, userId));
    return growsList;
  } catch (error) {
    console.error("Failed to get grows by user id:", error);
    throw error;
  }
}

/**
 * GET a single grow cycle by ID and verify user ownership.
 *
 * @param growId - The grow cycle's UUID
 * @param userId - The user's ID to verify ownership
 * @returns A single grow record or null if not found
 */
export async function getGrowByIdAndUser({
  growId,
  userId,
}: {
  growId: string;
  userId: string;
}) {
  try {
    const [growRecord] = await db
      .select()
      .from(grow)
      .where(and(eq(grow.id, growId), eq(grow.userId, userId)));
    return growRecord || null;
  } catch (error) {
    console.error("Failed to get grow by id and user:", error);
    throw error;
  }
}
