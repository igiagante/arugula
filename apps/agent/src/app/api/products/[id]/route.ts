// app/(products)/api/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/lib/db/queries/products";

/**
 * Retrieves a specific product by ID
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the product ID
 * @returns {Promise<NextResponse>} JSON response with product data or error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (productId) {
      const singleProduct = await getProductById({ productId });
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
    return NextResponse.json(newProd, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
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
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the product ID
 * @returns {Promise<NextResponse>} JSON response confirming deletion or error
 */
export async function DELETE(
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
        { error: "Product ID is missing" },
        { status: 400 }
      );
    }
    const deleted = await deleteProduct({ productId });
    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
