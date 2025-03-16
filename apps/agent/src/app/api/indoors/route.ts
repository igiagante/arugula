import {
  createIndoor,
  getIndoorsByOrganizationId,
} from "@/lib/db/queries/indoors";
import { createLamp } from "@/lib/db/queries/lamps";
import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../tags";

/**
 * GET /api/indoors
 * Returns all indoor records for the authenticated user in the specified organization.
 */
export async function GET(request: NextRequest) {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  console.log("userId:", userId);
  console.log("orgId:", orgId);

  // Check if the user has organizations

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
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, lamp, ...rest } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newIndoor = await createIndoor({
      name,
      ...rest,
      createdBy: userId,
      organizationId: orgId,
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
    revalidateTag(createDynamicTag(CacheTags.indoorsByOrganizationId, orgId));

    return NextResponse.json(newIndoor, { status: 201 });
  } catch (error) {
    console.error("POST /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
