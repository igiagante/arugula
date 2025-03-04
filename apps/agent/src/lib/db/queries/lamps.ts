import { eq } from "drizzle-orm";
import { db } from "../index";
import type { Lamp } from "../schemas";
import { lamp } from "../schemas";

export async function createLamp(
  data: Omit<Lamp, "id" | "createdAt" | "updatedAt">
) {
  try {
    const [newLamp] = await db.insert(lamp).values(data).returning();
    return newLamp;
  } catch (error) {
    console.error("Failed to create lamp:", error);
    throw error;
  }
}

export async function updateLamp(
  id: string,
  data: Omit<Lamp, "createdBy" | "createdAt" | "updatedAt">
) {
  try {
    const [updatedLamp] = await db
      .update(lamp)
      .set(data)
      .where(eq(lamp.id, id))
      .returning();

    if (!updatedLamp) {
      throw new Error(`Lamp with id ${id} not found`);
    }

    return updatedLamp;
  } catch (error) {
    console.error("Failed to update lamp:", error);
    throw error;
  }
}

export async function getLamp(id: string) {
  try {
    const [foundLamp] = await db.select().from(lamp).where(eq(lamp.id, id));

    if (!foundLamp) {
      throw new Error(`Lamp with id ${id} not found`);
    }

    return foundLamp;
  } catch (error) {
    console.error("Failed to get lamp:", error);
    throw error;
  }
}

export async function deleteLamp(id: string) {
  try {
    const [deletedLamp] = await db
      .delete(lamp)
      .where(eq(lamp.id, id))
      .returning();

    if (!deletedLamp) {
      throw new Error(`Lamp with id ${id} not found`);
    }

    return deletedLamp;
  } catch (error) {
    console.error("Failed to delete lamp:", error);
    throw error;
  }
}
