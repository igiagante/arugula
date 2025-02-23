import {
  deletePlant,
  getPlantWithStrain,
  getPlantById,
  updatePlant,
  createPlant,
} from "@/lib/db/queries/plants";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/plants/[id]
 * Retrieves a plant record by ID with optional strain relation.
 *
 * @param request - The incoming HTTP request
 * @param params.id - The unique identifier of the plant to retrieve
 * @query includeStrain - Set to "true" to include related strain data
 *
 * @returns
 * - 200: Plant object, optionally including strain data
 * - 404: When plant is not found
 *
 * @example
 * // Fetch plant only
 * GET /api/plants/123
 *
 * // Fetch plant with strain data
 * GET /api/plants/123?includeStrain=true
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const includeStrain = searchParams.get("includeStrain") === "true";

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: plantId } = await params;

  const plant = includeStrain
    ? await getPlantWithStrain({ plantId })
    : await getPlantById({ plantId });

  if (!plant) {
    return new Response("Plant not found", { status: 404 });
  }

  return Response.json(plant);
}

/**
 * POST /api/plants
 * Creates a new plant record.
 * Request body should include: { growId, strainId, customName, stage, startDate, notes, potSize }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { growId, strainId, customName, stage, startDate, notes, potSize } =
      body;

    if (!growId || !customName || !stage || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPlant = await createPlant({
      growId,
      strainId,
      customName,
      stage,
      startDate: new Date(startDate),
      notes,
      potSize,
    });

    return NextResponse.json(newPlant, { status: 201 });
  } catch (error) {
    console.error("POST /api/plants error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/plants/[id]
 * Updates an existing plant record.
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

    const { id: plantId } = await params;

    if (!plantId) {
      return NextResponse.json(
        { error: "plantId query parameter is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedPlant = await updatePlant({ plantId, data: body });

    return NextResponse.json(updatedPlant, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/plants error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/plants/[id]
 * Deletes a plant record.
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

    const { id: plantId } = await params;

    if (!plantId) {
      return NextResponse.json(
        { error: "plantId query parameter is missing" },
        { status: 400 }
      );
    }

    const deletedPlant = await deletePlant({ plantId });
    return NextResponse.json(deletedPlant, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/plants error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
