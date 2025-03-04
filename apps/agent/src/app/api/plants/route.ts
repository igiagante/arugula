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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const growId = searchParams.get("growId");

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
      startDate,
      notes,
      potSize,
      potSizeUnit,
    } = body;

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
      potSize,
      potSizeUnit,
      harvestedAt: null,
    });

    if (newPlant) {
      revalidateTag(createDynamicTag(CacheTags.plantByUserId, newPlant.id));
    }

    revalidateTag(createDynamicTag(CacheTags.getPlantsByGrowId, growId));

    return NextResponse.json(newPlant, { status: 201 });
  } catch (error) {
    console.error("POST /api/plants error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
