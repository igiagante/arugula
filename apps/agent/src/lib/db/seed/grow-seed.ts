import { uploadImageToS3ForSeed } from "@/lib/s3/s3-upload";
import { loadImageFile } from "@/lib/utils/image-utils";
import { config } from "dotenv";
import path from "path";
import { grow, growCollaborator } from "../schemas";
import { DrizzleClient, GrowRoles } from "../types";

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

  // Upload sample images to S3 and get their keys
  const imageFile = loadImageFile(
    path.join(process.cwd(), "src/lib/db/seed/images/grow-cero.svg")
  );

  const imageFile2 = loadImageFile(
    path.join(process.cwd(), "src/lib/db/seed/images/grow-one.png")
  );

  // Upload images and get S3 keys
  const _grow_cero_image = await uploadImageToS3ForSeed(imageFile);
  const _grow_one_image = await uploadImageToS3ForSeed(imageFile2);

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
        images: [_grow_cero_image],
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
        images: [_grow_one_image],
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
        growId: growOne.id,
        userId: users[1],
        role: GrowRoles.owner,
      },
      {
        growId: growTwo.id,
        userId: users[1],
        role: GrowRoles.owner,
      },
      {
        growId: growTwo.id,
        userId: users[0],
        role: GrowRoles.owner,
      },
    ]);

    return { growIds: [growOne.id, growTwo.id] };
  } catch (error) {
    console.error("Error seeding grows:", error);
    throw error;
  }
}
