import { createIndoor, getIndoorsByUserId } from "@/lib/db/queries/indoors";
import { createLamp } from "@/lib/db/queries/lamps";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../tags";

/**
 * GET /api/indoors
 * Returns all indoor records for the authenticated user.
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const indoor = await unstable_cache(
      async () => getIndoorsByUserId({ userId }),
      [createDynamicTag(CacheTags.indoorsByUserId, userId)],
      {
        revalidate: 3600, // Cache for 1 hour
        tags: [createDynamicTag(CacheTags.indoorsByUserId, userId)],
      }
    )();

    if (!indoor) {
      return NextResponse.json(
        { error: "Indoor record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(indoor, { status: 200 });
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
 * Request body should include: { name: string, ... }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json(newIndoor, { status: 201 });
  } catch (error) {
    console.error("POST /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
