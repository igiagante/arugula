import { GrowRoles } from "@/lib/db/types";
import { config } from "dotenv";
import { grow, growCollaborator } from "../schemas";
import { DrizzleClient } from "../types";
config({
  path: ".env.local",
});

export async function seedGrows(
  db: DrizzleClient,
  organizationId: string,
  indoors: string[],
  users: string[]
) {
  if (!indoors[0] || !indoors[1]) throw new Error("Indoors not found");

  try {
    // Sample grows data
    const [growOne] = await db
      .insert(grow)
      .values({
        name: "First Indoor Grow",
        indoorId: indoors[0],
        organizationId,
        stage: "vegetative",
        startDate: new Date("2024-01-01"),
        growingMethod: "soil",
        potSize: "5",
        potSizeUnit: "liters",
      })
      .returning();

    if (!growOne) throw new Error("Failed to create first grow");

    const [growTwo] = await db
      .insert(grow)
      .values({
        name: "Second Indoor Grow",
        indoorId: indoors[1],
        organizationId,
        stage: "flowering",
        startDate: new Date("2024-02-01"),
        growingMethod: "hydroponic",
        potSize: "10",
        potSizeUnit: "liters",
      })
      .returning();

    if (!growTwo) throw new Error("Failed to create second grow");

    if (!users[0] || !users[1]) throw new Error("Users not found");

    // Insert collaborators
    await db.insert(growCollaborator).values([
      {
        growId: growOne.id,
        userId: users[0],
        role: GrowRoles.owner,
      },
      {
        growId: growTwo.id,
        userId: users[1],
        role: GrowRoles.owner,
      },
    ]);

    return { growIds: [growOne.id, growTwo.id] };
  } catch (error) {
    console.error("Error seeding grows:", error);
    throw error;
  }
}

// seedGrows("org_1", "indoor_1", ["user_1", "user_2"]);
