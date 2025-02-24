import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  deleteIndoor,
  getIndoorById,
  updateIndoor,
} from "@/lib/db/queries/indoors";

/**
 * GET /api/indoors
 * Returns all indoor records created by the specified user.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id: indoorId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const indoors = await getIndoorById({ userId, indoorId });
    return NextResponse.json(indoors, { status: 200 });
  } catch (error) {
    console.error("GET /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/indoors/[id]
 * Updates an existing indoor record.
 * Request body should include the fields to update (e.g., { name: string })
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

    const { id: indoorId } = await params;

    if (!indoorId) {
      return NextResponse.json(
        { error: "indoorId query parameter is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { id, name, dimensions, notes, images, temperature, humidity, co2 } =
      body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedIndoor = await updateIndoor({
      id,
      name,
      dimensions,
      notes,
      images,
      temperature,
      humidity,
      co2,
    });
    return NextResponse.json(updatedIndoor, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/indoors/[id]
 * Deletes an indoor record.
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

    const { id: indoorId } = await params;

    if (!indoorId) {
      return NextResponse.json(
        { error: "indoorId query parameter is missing" },
        { status: 400 }
      );
    }

    const deletedIndoor = await deleteIndoor({ indoorId, userId });

    return NextResponse.json(deletedIndoor, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/indoors error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
