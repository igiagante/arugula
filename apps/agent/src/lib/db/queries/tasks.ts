// lib/db/queries/taskQueries.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { Task, task, product, taskProduct, plant, taskPlant } from "../schema"; // adjust the path as needed

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE a Task.
 * @param data - Basic task fields (taskTypeId, growId, userId, notes, details, images)
 */
export async function createTask(
  data: Omit<Task, "id" | "createdAt" | "updatedAt">
) {
  try {
    const [newTask] = await db.insert(task).values(data).returning();
    return newTask;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}

/**
 * UPDATE a Task.
 */
export async function updateTask({
  taskId,
  data,
}: {
  taskId: string;
  data: Partial<Task>;
}) {
  try {
    const [updatedTask] = await db
      .update(task)
      .set(data)
      .where(eq(task.id, taskId))
      .returning();
    return updatedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
}

/**
 * DELETE a Task.
 */
export async function deleteTask({ taskId }: { taskId: string }) {
  try {
    const [deletedTask] = await db
      .delete(task)
      .where(eq(task.id, taskId))
      .returning();
    return deletedTask;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
}

/**
 * GET a Task by ID.
 */
export async function getTaskById({ taskId }: { taskId: string }) {
  try {
    const tasksList = await db.select().from(task).where(eq(task.id, taskId));
    return tasksList[0];
  } catch (error) {
    console.error("Failed to get task by id:", error);
    throw error;
  }
}

/**
 * GET all Tasks for a given grow, including product information.
 */
export async function getTasksByGrowId({ growId }: { growId: string }) {
  try {
    const tasksList = await db
      .select({
        id: task.id,
        growId: task.growId,
        userId: task.userId,
        notes: task.notes,
        details: task.details,
        images: task.images,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })
      .from(task)
      .where(eq(task.growId, growId));

    // Get related products and plants for each task
    const tasksWithRelations = await Promise.all(
      tasksList.map(async (task) => {
        const products = await db
          .select({
            id: product.id,
            name: product.name,
            brand: product.brand,
            quantity: taskProduct.quantity,
            unit: taskProduct.unit,
          })
          .from(taskProduct)
          .leftJoin(product, eq(taskProduct.productId, product.id))
          .where(eq(taskProduct.taskId, task.id));

        const plants = await db
          .select({
            id: plant.id,
            growId: plant.growId,
            strainId: plant.strainId,
            customName: plant.customName,
            stage: plant.stage,
            startDate: plant.startDate,
            archived: plant.archived,
            notes: plant.notes,
            potSize: plant.potSize,
          })
          .from(taskPlant)
          .leftJoin(plant, eq(taskPlant.plantId, plant.id))
          .where(eq(taskPlant.taskId, task.id));

        return {
          ...task,
          products,
          plants,
        };
      })
    );

    return tasksWithRelations;
  } catch (error) {
    console.error("Failed to get tasks by grow id:", error);
    throw error;
  }
}
