import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { Product, product } from "@/lib/db/schema";
// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * CREATE a Product.
 */
export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  try {
    const [newProduct] = await db.insert(product).values(data).returning();
    return newProduct;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}

/**
 * UPDATE a Product.
 */
export async function updateProduct({
  productId,
  data,
}: {
  productId: string;
  data: Partial<Product>;
}) {
  try {
    const [updatedProduct] = await db
      .update(product)
      .set(data)
      .where(eq(product.id, productId))
      .returning();
    return updatedProduct;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
}

/**
 * DELETE a Product.
 */
export async function deleteProduct({ productId }: { productId: string }) {
  try {
    const [deletedProduct] = await db
      .delete(product)
      .where(eq(product.id, productId))
      .returning();
    return deletedProduct;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

/**
 * GET a Product by ID.
 */
export async function getProductById({ productId }: { productId: string }) {
  try {
    const productsList = await db
      .select()
      .from(product)
      .where(eq(product.id, productId));
    return productsList[0];
  } catch (error) {
    console.error("Failed to get product by id:", error);
    throw error;
  }
}

/**
 * GET all Products.
 */
export async function getAllProducts() {
  try {
    const productsList = await db.select().from(product);
    return productsList;
  } catch (error) {
    console.error("Failed to get all products:", error);
    throw error;
  }
}
