import {
  deletePlant,
  getPlantById,
  updatePlant,
} from "@/lib/db/queries/plants";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../../tags";

/**
 * GET /api/plants/[plantId]
 * Returns a plant record by plantId.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ plantId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plantId } = await params;
  const plant = await getPlantById({ plantId });

  if (!plant) {
    return NextResponse.json({ error: "Plant not found" }, { status: 404 });
  }

  return NextResponse.json(plant);
}

/**
 * PATCH /api/[growId]/plants
 * Updates an existing plant record.
 */
export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    // First update the plant
    await updatePlant({
      plantId: data.id,
      data: { ...data, updatedAt: new Date() },
    });

    // Then fetch the updated plant with notes
    const updatedPlant = await getPlantById({
      plantId: data.id,
    });

    if (!updatedPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    // Only invalidate the tags we actually use
    revalidateTag(
      createDynamicTag(CacheTags.getPlantsByGrowId, updatedPlant.growId)
    );
    revalidateTag(createDynamicTag(CacheTags.growById, updatedPlant.growId));

    return NextResponse.json(updatedPlant);
  } catch (error) {
    console.error("PATCH /api/plants/[plantId] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/plants/[plantId]
 * Deletes a plant record.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ plantId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plantId } = await params;
    const deletedPlant = await deletePlant({ plantId });

    if (!deletedPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    revalidateTag(
      createDynamicTag(CacheTags.getPlantsByGrowId, deletedPlant.growId)
    );

    return NextResponse.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/plants/[plantId] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
