import {
  createIndoor,
  getIndoorsByOrganizationId,
} from "@/lib/db/queries/indoors";
import { createLamp } from "@/lib/db/queries/lamps";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../tags";

/**
 * GET /api/indoors
 * Returns all indoor records for the authenticated user in the specified organization.
 */
export async function GET() {
  const { userId } = await auth();

  // TODO: Remove this once we have a real organization ID
  const orgId = "516e3958-1842-4219-bf07-2a515b86df04";

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  try {
    const indoors = await unstable_cache(
      async () => getIndoorsByOrganizationId({ userId, orgId }),
      [createDynamicTag(CacheTags.indoorsByOrganizationId, orgId)],
      {
        revalidate: 3600, // Cache for 1 hour
        tags: [createDynamicTag(CacheTags.indoorsByOrganizationId, orgId)],
      }
    )();

    if (!indoors) {
      return NextResponse.json(
        { error: "Indoor records not found" },
        { status: 404 }
      );
    }

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
 * POST /api/indoors
 * Creates a new indoor record.
 * Request body should include: { name: string, organizationId: string, ... }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { name, lamp, organizationId, ...rest } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const newIndoor = await createIndoor({
      name,
      ...rest,
      createdBy: userId,
      organizationId,
    });

    if (!newIndoor) {
      return NextResponse.json(
        { error: "Failed to create indoor" },
        { status: 500 }
      );
    }

    const newLamp = await createLamp({
      ...lamp,
      indoorId: newIndoor.id,
    });

    if (!newLamp) {
      return NextResponse.json(
        { error: "Failed to create lamp" },
        { status: 500 }
      );
    }

    // Invalidate the cache for this user's indoors
    revalidateTag(createDynamicTag(CacheTags.indoorsByUserId, userId));

    // Also invalidate the organization's indoors cache
    revalidateTag(
      createDynamicTag(CacheTags.indoorsByOrganizationId, organizationId)
    );

    return NextResponse.json(newIndoor, { status: 201 });
  } catch (error) {
    console.error("POST /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
