import {
  deletePlant,
  getPlantById,
  getPlantWithStrain,
  updatePlant,
} from "@/lib/db/queries/plants";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../../tags";

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

  const getCachedPlant = unstable_cache(
    async () => {
      return includeStrain
        ? await getPlantWithStrain({ plantId })
        : await getPlantById({ plantId });
    },
    [createDynamicTag(CacheTags.plantByUserId, plantId)],
    {
      tags: [createDynamicTag(CacheTags.plantByUserId, plantId)],
      revalidate: 30, // Cache for 30 seconds
    }
  );

  const plant = await getCachedPlant();

  if (!plant) {
    return new Response("Plant not found", { status: 404 });
  }

  return Response.json(plant);
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

    if (updatedPlant?.growId) {
      revalidateTag(
        createDynamicTag(CacheTags.getPlantsByGrowId, updatedPlant.growId)
      );
      revalidateTag(createDynamicTag(CacheTags.plantByUserId, plantId));
    }

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

    if (deletedPlant?.growId) {
      revalidateTag(
        createDynamicTag(CacheTags.getPlantsByGrowId, deletedPlant.growId)
      );
    }

    return NextResponse.json(deletedPlant, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/plants error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
