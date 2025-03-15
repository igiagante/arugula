// app/(grows)/api/route.ts
import {
  deleteGrow,
  getGrowByIdAndUser,
  updateGrow,
} from "@/lib/db/queries/grows"; // adjust path as needed
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../../tags";

/**
 * GET /api/grows/[id]
 * Returns the grow cycle with the specified ID.
 * This route is used to edit a grow cycle.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ growId: string }> }
): Promise<NextResponse> {
  try {
    const { growId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await getGrowByIdAndUser({
      growId,
      userId,
    });

    // Check if result is an error object
    if (result && "error" in result) {
      return new NextResponse(result.error, { status: result.status });
    }

    // Check if result is null
    if (!result) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GROW_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * PATCH /api/grows/[id]
 * Updates an existing grow cycle.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ growId: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    const { growId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Ensure dates are properly handled
    const cleanData = {
      ...data,
      id: growId,
      updatedAt: new Date(),
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };

    const updatedGrow = await updateGrow(cleanData);

    // Invalidate the cache using revalidateTag
    revalidateTag(createDynamicTag(CacheTags.growsByOrganizationId, userId));

    return NextResponse.json(updatedGrow, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/grows/[growId] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/grows/[id]
 * Deletes (or archives) a grow cycle.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ growId: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    const { growId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!growId) {
      return NextResponse.json(
        { error: "growId query parameter is missing" },
        { status: 400 }
      );
    }

    const deletedGrow = await deleteGrow({ growId });

    // Invalidate the cache using revalidateTag
    revalidateTag(createDynamicTag(CacheTags.growsByOrganizationId, userId));

    return NextResponse.json(deletedGrow, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/grows error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
