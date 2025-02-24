// app/(grows)/api/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createGrow,
  deleteGrow,
  getGrowByIdAndUser,
  updateGrow,
} from "@/lib/db/queries/grows"; // adjust path as needed

/**
 * GET /api/grows/[id]
 * Returns the grow cycle with the specified ID.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  const { id: growId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const grow = await getGrowByIdAndUser({ userId, growId });
    return NextResponse.json(grow, { status: 200 });
  } catch (error) {
    console.error("GET /api/grows/[id] error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/grows/[id]
 * Updates an existing grow cycle.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: growId } = await params;

    if (!growId) {
      return NextResponse.json(
        { error: "growId query parameter is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedGrow = await updateGrow({ growId, userId, ...body });

    return NextResponse.json(updatedGrow, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/grows error:", error);
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    const { id: growId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!growId) {
      return NextResponse.json(
        { error: "growId query parameter is missing" },
        { status: 400 }
      );
    }

    const deletedGrow = await deleteGrow({ growId, userId });

    return NextResponse.json(deletedGrow, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/grows error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
