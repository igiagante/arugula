import { getAuthContext } from "@/lib/auth/auth-context";
import { createGrow, getGrowsByOrganizationId } from "@/lib/db/queries/grows";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import type { CreateGrowDto } from "../dto";
import { CacheTags, createDynamicTag } from "../tags";
/**
 * GET /api/grows
 * Returns all grow records for the authenticated user.
 */
export async function GET(): Promise<NextResponse> {
  const { userId, orgId, error } = await getAuthContext();

  if (error) {
    return error;
  }

  try {
    const getCachedGrows = unstable_cache(
      async () => getGrowsByOrganizationId(orgId),
      [createDynamicTag(CacheTags.growsByOrganizationId, orgId)],
      {
        revalidate: 60, // Cache for 60 seconds
        tags: [createDynamicTag(CacheTags.growsByOrganizationId, userId)],
      }
    );

    const grows = await getCachedGrows();

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
    const { userId, error } = await getAuthContext();

    if (error) {
      return error;
    }

    const body = (await request.json()) as CreateGrowDto;

    // Validate required fields
    const requiredFields = [
      "indoorId",
      "name",
      "stage",
      "startDate",
      "organizationId",
    ] as const;
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
    if (Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format for startDate" },
        { status: 400 }
      );
    }

    const newGrow = await createGrow(
      {
        ...body,
        archived: false,
        endDate: body.endDate || null,
        images: body.images || [],
        growingMethod: body.growingMethod || null,
        substrateComposition: body.substrateComposition || null,
        progress: body.progress || null,
        strainPlants: body.strainPlants || [],
      },
      userId
    );

    // Invalidate the cache using revalidateTag
    revalidateTag(createDynamicTag(CacheTags.growsByOrganizationId, userId));

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
