import { createProduct, getAllProducts } from "@/lib/db/queries/products";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../tags";

/**
 * GET /api/products
 * Retrieves all products.
 */
export async function GET(_request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const getCachedProducts = unstable_cache(
      async () => getAllProducts(),
      [CacheTags.products],
      {
        revalidate: 3600, // Cache for 1 hour
        tags: [CacheTags.products],
      }
    );

    const products = await getCachedProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET /api/strains error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Creates a new product
 * @param request - The incoming HTTP request containing product data
 * @returns {Promise<NextResponse>} JSON response with the created product or error
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "price", "description"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const newProd = await createProduct(data);

    if (newProd) {
      revalidateTag(createDynamicTag(CacheTags.productById, newProd.id));
    }
    revalidateTag(CacheTags.products);

    return NextResponse.json(newProd, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
