import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { getPlantsByGrowId } from "@/lib/db/queries/plants";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

/**
 * GET /api/grows/[growId]/plants
 * Returns all plants for the specified grow.
 * Requires growId query parameter.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: growId } = await params;

  console.log("growId", growId);

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
