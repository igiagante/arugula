import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createIndoor, getIndoorsByUserId } from "@/lib/db/queries/indoors";
import { unstable_cache, revalidateTag } from "next/cache";
import { createDynamicTag, CacheTags } from "../tags";
import { createLamp } from "@/lib/db/queries/lamps";

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

    const {
      name,
      dimensions,
      notes,
      images,
      temperature,
      humidity,
      co2,
      lamp,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newIndoor = await createIndoor({
      name,
      dimensions,
      notes,
      images,
      temperature,
      humidity,
      co2,
      createdBy: userId,
    });

    if (!newIndoor) {
      return NextResponse.json(
        { error: "Failed to create indoor" },
        { status: 500 }
      );
    }

    await createLamp({
      ...lamp,
      indoorId: newIndoor.id,
    });

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
