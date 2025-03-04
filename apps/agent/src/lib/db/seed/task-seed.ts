import { eq } from "drizzle-orm";
import { grow, sensorReading, task, taskPlant, taskType } from "../schemas";
import { DrizzleClient } from "../types";

export async function seedTasks(
  db: DrizzleClient,
  growId: string,
  plantIds: string[],
  userId: string
) {
  // Insert TaskTypes (e.g., feeding)
  await db.insert(taskType).values({
    id: "feeding",
    label: "Feeding / Irrigation",
    icon: "water_drop",
    schema: {
      requiredFields: ["amount", "pH", "EC"],
      properties: {
        amount: {
          type: "number",
          units: ["ml", "L"],
          defaultUnit: "ml",
        },
        pH: {
          type: "number",
          min: 0,
          max: 14,
        },
        EC: {
          type: "number",
          min: 0,
        },
      },
    },
  });

  // Insert a Task for the Grow (e.g., a feeding task)
  const [taskAdded] = await db
    .insert(task)
    .values({
      taskTypeId: "feeding",
      growId,
      userId,
      notes: "Fed plants with nutrient mix",
      details: { pH: 6.2, EC: 1.8, temperature: 21.5, totalLiters: 3.0 },
      images: ["https://example.com/after_feeding.jpg"],
    })
    .returning();

  if (!taskAdded) {
    throw new Error("Failed to insert task");
  }

  // Link the Task to the Plants via TaskPlant
  for (const plantId of plantIds) {
    await db.insert(taskPlant).values({
      taskId: taskAdded.id,
      plantId,
    });
  }

  // Get the indoor ID from the grow
  const indoorResult = await db
    .select({ indoorId: grow.indoorId })
    .from(grow)
    .where(eq(grow.id, growId))
    .limit(1);

  if (indoorResult.length > 0) {
    const indoorId = indoorResult[0]?.indoorId;

    if (!indoorId) {
      console.warn("Indoor ID not found for grow:", growId);
      return { taskId: taskAdded.id };
    }

    // Insert a SensorReading for the Indoor
    await db.insert(sensorReading).values({
      indoorId,
      recordedAt: new Date(),
      data: { temperature: 25.3, humidity: 50, co2: 800, pH: 6.2 },
    });
  }

  return { taskId: taskAdded.id };
}
