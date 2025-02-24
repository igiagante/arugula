import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  user,
  indoor,
  indoorCollaborator,
  grow,
  strain,
  plant,
  plantNote,
  taskType,
  task,
  taskPlant,
  product,
  taskProduct,
  sensorReading,
  lamp,
} from "../schema";
import { config } from "dotenv";

config({
  path: ".env.local",
});

// Connect to the database
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const userId = "user_2tMsS1D6OD8KYB9GQxWHo6as1IX";
const email = "igiagante@gmail.com";
const imageUrl = "https://i.pravatar.cc/150?img=1";

async function seed() {
  // 1. Insert a User (simulate a Clerk user)
  await db.insert(user).values({
    id: userId,
    email,
    firstName: "Nachito",
    lastName: "Giagante",
    imageUrl,
  });

  // 2. Insert an Indoor
  const [indoorAdded] = await db
    .insert(indoor)
    .values({
      name: "Test Grow Tent",
      dimensions: { width: 50, length: 50, height: 70, unit: "cm" },
      temperature: "23",
      humidity: "50",
      images: ["https://example.com/photo1.jpg"],
      notes: "This is a test indoor setup with high-quality LED lighting.",
      createdBy: userId,
    })
    .returning();

  // Add lamp for the indoor
  await db.insert(lamp).values({
    indoorId: indoorAdded!.id,
    lampType: "600W LED",
    lightIntensity: "350",
    fanSpeed: "50",
    current: "2.5",
    voltage: "220",
    power: "600",
  });

  // 3. Insert an IndoorCollaborator (the owner)
  await db.insert(indoorCollaborator).values({
    indoorId: indoorAdded!.id,
    userId,
    role: "owner",
  });

  // 4. Insert a Grow in the Indoor
  const [growAdded] = await db
    .insert(grow)
    .values({
      indoorId: indoorAdded!.id,
      userId,
      name: "Spring Test Cycle",
      stage: "vegetative",
      startDate: new Date(),
      archived: false,
      substrateComposition: {
        soil: "40",
        perlite: "20",
        turba: "20",
        humus: "20",
      },
      potSize: { size: 1, unit: "L" },
      growingMethod: "soil",
    })
    .returning();

  // 5. Insert Strains into the master library
  const [strain1024, strain2] = await db
    .insert(strain)
    .values([
      {
        name: "1024",
        breeder: "MedicalSeeds",
        genotype: "Northern Lights x White Widow",
        ratio: "60% Indica / 40% Sativa",
        floweringType: "photoperiod",
        indoorVegTime: "4 weeks",
        indoorFlowerTime: "8 weeks",
        indoorYield: "500 g/m²",
        outdoorHeight: "1.7 m",
        outdoorYield: "600 g/plant",
        harvestMonthOutdoor: "October",
        cannabinoidProfile: { THC: "28%", CBD: "low" },
        resistance: { mold: "high", pests: "medium" },
        optimalConditions: { temp: "23-27C", humidity: "40-50%" },
        terpeneProfile: { dominant: ["Myrcene", "Limonene", "Caryophyllene"] },
        difficulty: "Advanced",
        awards: "Multiple Cannabis Cup Awards",
        description:
          "A potent strain known for its strong effects and high yields, ideal for experienced growers.",
      },
      {
        name: "Girl Scout Cookies",
        breeder: "Cookie Fam",
        genotype: "OG Kush x Durban Poison",
        ratio: "40% Indica / 60% Sativa",
        floweringType: "photoperiod",
        indoorVegTime: "3-4 weeks",
        indoorFlowerTime: "9-10 weeks",
        indoorYield: "450 g/m²",
        outdoorHeight: "1.8 m",
        outdoorYield: "550 g/plant",
        harvestMonthOutdoor: "October",
        cannabinoidProfile: { THC: "25%", CBD: "0.2%" },
        resistance: { mold: "medium", pests: "high" },
        optimalConditions: { temp: "20-26C", humidity: "45-55%" },
        terpeneProfile: { dominant: ["Caryophyllene", "Limonene", "Linalool"] },
        difficulty: "Intermediate",
        awards: "Multiple High Times Cannabis Cup Winner",
        description:
          "Famous for its sweet and earthy aroma, GSC delivers both full-body relaxation and cerebral euphoria.",
      },
    ])
    .returning();

  // 6. Insert multiple Plants into the Grow
  const [plant1, plant2, plant3] = await db
    .insert(plant)
    .values([
      {
        growId: growAdded!.id,
        strainId: strain1024!.id,
        customName: "1024 #1",
        stage: "vegetative",
        startDate: new Date(),
        archived: false,
        notes: "First 1024 plant",
        potSize: { size: 1, unit: "L" },
      },
      {
        growId: growAdded!.id,
        strainId: strain1024!.id,
        customName: "1024 #2",
        stage: "vegetative",
        startDate: new Date(),
        archived: false,
        notes: "Second 1024 plant",
        potSize: { size: 1, unit: "L" },
      },
      {
        growId: growAdded!.id,
        strainId: strain2!.id,
        customName: "GSC #1",
        stage: "vegetative",
        startDate: new Date(),
        archived: false,
        notes: "First GSC plant",
        potSize: { size: 1, unit: "L" },
      },
    ])
    .returning();

  // 7. Insert PlantNotes for the Plants
  await db.insert(plantNote).values({
    plantId: plant1!.id,
    content: "Observed new bud formation.",
    images: [{ url: "https://example.com/photo1.jpg", caption: "Close-up" }],
  });
  await db.insert(plantNote).values({
    plantId: plant2!.id,
    content: "Observed new bud formation.",
    images: [{ url: "https://example.com/photo1.jpg", caption: "Close-up" }],
  });
  await db.insert(plantNote).values({
    plantId: plant3!.id,
    content: "Observed new bud formation.",
    images: [{ url: "https://example.com/photo1.jpg", caption: "Close-up" }],
  });

  // 8. Insert TaskTypes (e.g., feeding)
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

  // 9. Insert a Task for the Grow (e.g., a feeding task)
  const [taskAdded] = await db
    .insert(task)
    .values({
      taskTypeId: "feeding",
      growId: growAdded!.id,
      userId,
      notes: "Fed plants with nutrient mix",
      details: { pH: 6.2, EC: 1.8, temperature: 21.5, totalLiters: 3.0 },
      images: [
        {
          url: "https://example.com/after_feeding.jpg",
          caption: "After feeding",
        },
      ],
    })
    .returning();

  // 10. Link the Task to the Plants via TaskPlant
  await db.insert(taskPlant).values({
    taskId: taskAdded!.id,
    plantId: plant1!.id,
  });
  await db.insert(taskPlant).values({
    taskId: taskAdded!.id,
    plantId: plant2!.id,
  });
  await db.insert(taskPlant).values({
    taskId: taskAdded!.id,
    plantId: plant3!.id,
  });

  // 11. Insert some real Products from Advanced Nutrients into the Product table
  const productsData = [
    {
      name: "Sensi Grow A",
      brand: "Advanced Nutrients",
      category: "Nutrient",
      defaultCost: "29.99",
      description: "A nutrient for vegetative growth.",
      productUrl: "https://store.advancednutrients.com/products/sensi-grow-a",
      extraData: { dosage: "2ml/L" },
    },
    {
      name: "Sensi Bloom",
      brand: "Advanced Nutrients",
      category: "Nutrient",
      defaultCost: "34.99",
      description: "A nutrient for the flowering stage.",
      productUrl: "https://store.advancednutrients.com/products/sensi-bloom",
      extraData: { dosage: "2ml/L" },
    },
    {
      name: "pH Perfect Grow",
      brand: "Advanced Nutrients",
      category: "pH Stabilizer",
      defaultCost: "24.99",
      description: "Maintains optimal pH during vegetative growth.",
      productUrl:
        "https://store.advancednutrients.com/products/ph-perfect-grow",
      extraData: { dosage: "3ml/L" },
    },
    {
      name: "pH Perfect Bloom",
      brand: "Advanced Nutrients",
      category: "pH Stabilizer",
      defaultCost: "24.99",
      description: "Maintains optimal pH during flowering.",
      productUrl:
        "https://store.advancednutrients.com/products/ph-perfect-bloom",
      extraData: { dosage: "3ml/L" },
    },
  ];

  const insertedProducts = [];
  for (const prod of productsData) {
    const [inserted] = await db.insert(product).values(prod).returning();
    insertedProducts.push(inserted);
  }

  // Optionally, log inserted products to verify
  console.log("Inserted Products:", insertedProducts);

  // 12. Insert TaskProduct linking the Task to one of the inserted Products
  if (insertedProducts.length > 0) {
    await db.insert(taskProduct).values({
      taskId: taskAdded!.id,
      productId: insertedProducts[0]!.id,
      quantity: "2.5",
      unit: "ml",
    });
  }

  // 13. Insert a SensorReading for the Indoor
  await db.insert(sensorReading).values({
    indoorId: indoorAdded!.id,
    recordedAt: new Date(),
    data: { temperature: 25.3, humidity: 50, co2: 800, pH: 6.2 },
  });

  console.log("Database seeded successfully!");
}

seed()
  .catch((err) => {
    console.error("Seeding error:", err);
  })
  .finally(() => client.end());
