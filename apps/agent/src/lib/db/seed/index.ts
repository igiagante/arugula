import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { seedGrows } from "./grow-seed";
import { seedIndoors } from "./indoor-seed";
import { seedPlants } from "./plant-seed";
import { seedProducts } from "./product-seed";
import { seedStrains } from "./strain-seed";
import { seedTasks } from "./task-seed";
import { seedUsers } from "./user-seed";

config({
  path: ".env.local",
});

async function main() {
  // Connect to the database
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  try {
    console.log("🌱 Starting database seeding...");

    // Seed users
    const { users } = await seedUsers(db);
    if (!users) {
      throw new Error("Failed to seed user");
    }

    console.log("👤 Users seeded successfully");

    const seededUser = users[0];
    if (!seededUser) {
      throw new Error("Failed to seed user");
    }

    // Seed indoors and organization
    const { indoors, organization: seededOrg } = await seedIndoors(
      db,
      seededUser.id
    );

    if (!indoors || !seededOrg) {
      throw new Error("Failed to seed indoor or organization");
    }

    console.log(
      `🏠 Indoors (${indoors.length}) and organization seeded successfully`
    );

    // Seed strains
    const { strainIds } = await seedStrains(db);
    console.log(
      `🌿 Strains seeded successfully (${Object.keys(strainIds).length} strains created)`
    );

    if (!strainIds.strain1024Id) throw new Error("Strain ID not found");

    // Seed grows
    const { growIds } = await seedGrows(
      db,
      seededOrg.id,
      indoors,
      users.map((u) => u?.id).filter((id): id is string => id !== undefined)
    );

    if (!growIds?.length) throw new Error("Failed to create grows");

    // Seed plants for each grow
    const allPlantIds = [];
    const strainIdsList = [
      strainIds.strain1024Id,
      strainIds.strainGscId,
    ].filter((id): id is string => id !== undefined);

    for (const growId of growIds) {
      const { plantIds } = await seedPlants(db, growId, strainIdsList);
      allPlantIds.push(...plantIds);
    }

    if (!allPlantIds.length) throw new Error("Failed to create plants");

    console.log(
      `🌲 Plants seeded successfully (${allPlantIds.length} plants created)`
    );

    if (!growIds[0]) throw new Error("Grow ID not found");

    // Seed tasks (using first grow for tasks)
    await seedTasks(db, growIds[0], allPlantIds, seededUser.id);
    console.log("🔧 Tasks seeded successfully");

    // Seed products
    const { productIds } = await seedProducts(db);
    console.log(
      `🛒 Products seeded successfully (${productIds.length} products created)`
    );

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await client.end();
  }
}

main();
