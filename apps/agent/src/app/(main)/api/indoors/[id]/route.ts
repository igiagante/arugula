import { getAuthContext } from "@/lib/auth/auth-context";
import {
  deleteIndoor,
  getIndoorById,
  updateIndoor,
} from "@/lib/db/queries/indoors";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../../tags";

/**
 * GET /api/indoors
 * Returns all indoor records created by the specified user.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: indoorId } = await params;
  const { userId, orgId, error } = await getAuthContext();

  if (error) {
    return error;
  }
  try {
    const getIndoorWithCache = unstable_cache(
      async () => getIndoorById({ userId, indoorId, organizationId: orgId }),
      [createDynamicTag(CacheTags.indoorByUserId, userId)],
      {
        tags: [createDynamicTag(CacheTags.indoorByUserId, userId)],
        revalidate: 3600, // Cache for 1 hour
      }
    );

    const indoors = await getIndoorWithCache();
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
 * PATCH /api/indoors/[id]
 * Updates an existing indoor record.
 * Request body should include the fields to update (e.g., { name: string })
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId, error } = await getAuthContext();

    if (error) {
      return error;
    }

    const { id: indoorId } = await params;

    if (!indoorId) {
      return NextResponse.json(
        { error: "indoorId query parameter is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedIndoor = await updateIndoor(body);

    // Invalidate the cache for this user's indoors
    revalidateTag(createDynamicTag(CacheTags.indoorByUserId, userId));
    revalidateTag(createDynamicTag(CacheTags.indoorsByOrganizationId, orgId));
    revalidateTag(
      createDynamicTag(CacheTags.availableIndoorsByOrganizationId, orgId)
    );

    return NextResponse.json(updatedIndoor, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/indoors/[id]
 * Deletes an indoor record.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId, error } = await getAuthContext();

    if (error) {
      return error;
    }

    const { id: indoorId } = await params;

    if (!indoorId) {
      return NextResponse.json(
        { error: "indoorId query parameter is missing" },
        { status: 400 }
      );
    }

    const deletedIndoor = await deleteIndoor({ indoorId });

    // Invalidate the cache for this user's indoors
    revalidateTag(createDynamicTag(CacheTags.indoorsByUserId, userId));
    revalidateTag(createDynamicTag(CacheTags.indoorsByOrganizationId, orgId));
    revalidateTag(
      createDynamicTag(CacheTags.availableIndoorsByOrganizationId, orgId)
    );

    return NextResponse.json(deletedIndoor, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
