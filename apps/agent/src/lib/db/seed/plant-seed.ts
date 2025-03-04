import { plant, plantNote } from "../schemas";
import { DrizzleClient } from "../types";

export async function seedPlants(
  db: DrizzleClient,
  growId: string,
  strainIds: string[]
) {
  // Insert multiple Plants into the Grow
  const [plant1, plant2, plant3] = await db
    .insert(plant)
    .values([
      {
        growId,
        strainId: strainIds[0],
        customName: "1024 #1",
        stage: "vegetative",
        harvestedAt: null,
        archived: false,
        potSize: "1",
        potSizeUnit: "L",
      },
      {
        growId,
        strainId: strainIds[0],
        customName: "1024 #2",
        stage: "vegetative",
        harvestedAt: null,
        archived: false,
        potSize: "1",
        potSizeUnit: "L",
      },
      {
        growId,
        strainId: strainIds[1],
        customName: "GSC #1",
        stage: "vegetative",
        harvestedAt: null,
        archived: false,
        potSize: "1",
        potSizeUnit: "L",
      },
    ])
    .returning();

  if (!plant1 || !plant2 || !plant3) {
    throw new Error("Failed to insert plants");
  }

  // Insert PlantNotes for the Plants
  await db.insert(plantNote).values({
    plantId: plant1.id,
    content: "First 1024 plant",
    images: ["https://example.com/photo1.jpg"],
  });
  await db.insert(plantNote).values({
    plantId: plant2.id,
    content: "Second 1024 plant",
    images: ["https://example.com/photo1.jpg"],
  });
  await db.insert(plantNote).values({
    plantId: plant3.id,
    content: "First GSC plant",
    images: ["https://example.com/photo1.jpg"],
  });

  return {
    growId,
    plantIds: [plant1.id, plant2.id, plant3.id],
  };
}
