import { product, task, taskProduct } from "../schemas";
import { DrizzleClient } from "../types";

export async function seedProducts(db: DrizzleClient) {
  // Insert some real Products from Advanced Nutrients into the Product table
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

  if (insertedProducts.length === 0) {
    throw new Error("Failed to insert products");
  }

  // Get the most recent task to link products to
  const tasks = await db.select().from(task).limit(1);

  if (
    tasks.length > 0 &&
    insertedProducts.length > 0 &&
    tasks[0] &&
    insertedProducts[0]
  ) {
    // Insert TaskProduct linking the Task to one of the inserted Products
    await db.insert(taskProduct).values({
      taskId: tasks[0].id,
      productId: insertedProducts[0].id,
      quantity: "2.5",
      unit: "ml",
    });
  }

  return {
    productIds: insertedProducts
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .map((p) => p.id),
  };
}
