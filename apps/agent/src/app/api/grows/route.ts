import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createGrow, getGrowsByUserId } from "@/lib/db/queries/grows";
import { Grow } from "@/lib/db/schema";
import { unstable_cache, revalidateTag } from "next/cache";
import { createDynamicTag, CacheTags } from "../tags";
import { CreateGrowDto } from "../dto";

/**
 * GET /api/grows
 * Returns all grow records for the authenticated user.
 */
export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const getCachedGrows = unstable_cache(
      async () => getGrowsByUserId({ userId }),
      [createDynamicTag(CacheTags.growsByUserId, userId)],
      {
        revalidate: 60, // Cache for 60 seconds
        tags: [createDynamicTag(CacheTags.growsByUserId, userId)],
      }
    );

    const grows = await getCachedGrows();
    console.log("grows", grows);
    if (!grows) {
      return NextResponse.json(
        { error: "Grows records not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(grows, { status: 200 });
  } catch (error) {
    console.error("GET /api/grows error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/grows
 * Creates a new grow cycle.
 * Request body should include: { indoorId, name, stage, startDate, substrateComposition, potSize, growingMethod, ... }
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateGrowDto;

    // Validate required fields
    const requiredFields = ["indoorId", "name", "stage", "startDate"] as const;
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    // Validate date format
    const startDate = new Date(body.startDate);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format for startDate" },
        { status: 400 }
      );
    }

    const newGrow = await createGrow({ ...body, userId } as Grow);

    // Invalidate the cache using revalidateTag
    revalidateTag(createDynamicTag(CacheTags.growsByUserId, userId));

    return NextResponse.json(newGrow, { status: 201 });
  } catch (error) {
    console.error("POST /api/grows error:", error);

    // Handle specific error types if needed
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
