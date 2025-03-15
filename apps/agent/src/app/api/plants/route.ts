import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { createPlant, getPlantsByGrowId } from "@/lib/db/queries/plants";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

/**
 * GET /api/plants?growId=...
 * Returns all plants for the specified grow.
 * Requires growId query parameter.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ growId: string }> }
) {
  const { growId } = await params;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (growId) {
      const getCachedPlants = unstable_cache(
        async () => getPlantsByGrowId({ growId }),
        [createDynamicTag(CacheTags.getPlantsByGrowId, growId)],
        {
          revalidate: 30, // Cache for 30 seconds
          tags: [createDynamicTag(CacheTags.getPlantsByGrowId, growId)], // Tag for cache invalidation
        }
      );

      const plants = await getCachedPlants();
      return NextResponse.json(plants, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Missing grow id query parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("GET /api/plants error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/plants
 * Creates a new plant record.
 * Request body should include: { growId, strainId, customName, stage, startDate, notes, potSize, potSizeUnit }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const {
      growId,
      strainId,
      customName,
      stage,
      quantity,
      potSize,
      potSizeUnit,
      notes,
      images,
    } = body;

    console.log("body", body);

    if (!growId || !customName || !stage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create multiple plants based on quantity
    const createdPlants = [];
    for (let i = 0; i < quantity; i++) {
      const newPlant = await createPlant({
        growId,
        strainId,
        customName: quantity > 1 ? `${customName || ""} #${i + 1}` : customName,
        stage,
        potSize,
        potSizeUnit,
        notes,
        images,
        harvestedAt: null,
      });

      if (!newPlant) {
        throw new Error("Failed to create plant");
      }

      createdPlants.push(newPlant);
    }

    // Invalidate the cache using revalidateTag
    revalidateTag(createDynamicTag(CacheTags.getPlantsByGrowId, growId));
    revalidateTag(createDynamicTag(CacheTags.growById, growId));

    // Return all created plants instead of just one
    return NextResponse.json(createdPlants);
  } catch (error) {
    console.error("POST /api/plants error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
