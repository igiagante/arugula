import { mapImages } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type Strain, strain } from "../schemas"; // adjust the path as needed

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE a strain in the master library.
 *
 * @param data - Strain data (name, breeder, genotype, ratio, etc.)
 * @returns The newly inserted strain record.
 */
export async function createStrain(data: Strain) {
  try {
    const [newStrain] = await db.insert(strain).values(data).returning();
    return newStrain;
  } catch (error) {
    console.error("Failed to create strain:", error);
    throw error;
  }
}

/**
 * UPDATE an existing strain.
 *
 * @param strainId - The strain's UUID
 * @param data - Fields to update
 * @returns The updated strain record.
 */
export async function updateStrain({
  strainId,
  data,
}: {
  strainId: string;
  data: Partial<Strain>;
}) {
  try {
    const [updatedStrain] = await db
      .update(strain)
      .set(data)
      .where(eq(strain.id, strainId))
      .returning();
    return updatedStrain;
  } catch (error) {
    console.error("Failed to update strain:", error);
    throw error;
  }
}

/**
 * DELETE a strain.
 *
 * @param strainId - The strain's UUID
 * @returns The deleted strain record.
 */
export async function deleteStrain({ strainId }: { strainId: string }) {
  try {
    const [deletedStrain] = await db
      .delete(strain)
      .where(eq(strain.id, strainId))
      .returning();
    return deletedStrain;
  } catch (error) {
    console.error("Failed to delete strain:", error);
    throw error;
  }
}

/**
 * GET a strain by its ID.
 *
 * @param strainId - The strain's UUID
 * @returns The strain record.
 */
export async function getStrainById({ strainId }: { strainId: string }) {
  try {
    const strainsList = await db
      .select()
      .from(strain)
      .where(eq(strain.id, strainId));
    return strainsList[0];
  } catch (error) {
    console.error("Failed to get strain by id:", error);
    throw error;
  }
}

/**
 * GET all strains from the master library.
 *
 * @returns An array of strain records.
 */
export async function getAllStrains() {
  try {
    const strainsList = await db.select().from(strain);

    // Filter out strains with null images or provide a default empty array
    return Promise.all(
      strainsList.map(async (strain) =>
        mapImages({ ...strain, images: strain.images || [] })
      )
    );
  } catch (error) {
    console.error("Failed to get strains:", error);
    throw error;
  }
}
