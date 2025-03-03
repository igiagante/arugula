import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/db/queries/products";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../../tags";

/**
 * Retrieves a specific product by ID
 * @param _request - The incoming HTTP request
 * @param params - Route parameters containing the product ID
 * @returns {Promise<NextResponse>} JSON response with product data or error
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (productId) {
      const getCachedProduct = unstable_cache(
        async () => getProductById({ productId }),
        [createDynamicTag(CacheTags.productById, productId)],
        {
          revalidate: 3600, // Cache for 1 hour
          tags: [createDynamicTag(CacheTags.productById, productId)],
        }
      );

      const singleProduct = await getCachedProduct();
      return NextResponse.json(singleProduct, { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Updates an existing product
 * @param request - The incoming HTTP request containing update data
 * @param params - Route parameters containing the product ID
 * @returns {Promise<NextResponse>} JSON response with the updated product or error
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    if (!productId) {
      return NextResponse.json(
        { error: "productId query parameter is missing" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const updated = await updateProduct({ productId, data });

    if (updated) {
      revalidateTag(createDynamicTag(CacheTags.productById, productId));
    }
    revalidateTag(CacheTags.products);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Deletes a product
 * @param _request - The incoming HTTP request
 * @param params - Route parameters containing the product ID
 * @returns {Promise<NextResponse>} JSON response confirming deletion or error
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is missing" },
        { status: 400 }
      );
    }
    const deleted = await deleteProduct({ productId });

    revalidateTag(CacheTags.products);

    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
