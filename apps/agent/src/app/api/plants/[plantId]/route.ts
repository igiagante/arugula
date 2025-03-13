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
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: plantId } = await params;
  const plant = await getPlantById({ plantId });

  if (!plant) {
    return NextResponse.json({ error: "Plant not found" }, { status: 404 });
  }

  return NextResponse.json(plant);
}

/**
 * PATCH /api/plants/[plantId]
 * Updates an existing plant record.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: plantId } = await params;
    const data = await request.json();

    const updatedPlant = await updatePlant({
      plantId,
      data: { ...data, updatedAt: new Date() },
    });

    if (!updatedPlant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    revalidateTag(
      createDynamicTag(CacheTags.getPlantsByGrowId, updatedPlant.growId)
    );

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: plantId } = await params;
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
