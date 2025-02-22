import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import {
  createIndoor,
  deleteIndoor,
  getIndoorsByUserId,
  updateIndoor,
} from "@/lib/db/queries/indoors";

/**
 * GET /api/indoors?userId=...
 * Returns all indoor records created by the specified user.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");

  if (!requestedUserId) {
    return NextResponse.json(
      { error: "UserId query parameter is missing" },
      { status: 404 }
    );
  }

  const { userId } = await auth();

  if (userId !== requestedUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const indoors = await getIndoorsByUserId({ userId: requestedUserId });
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
      location,
      dimensions,
      lighting,
      ventilation,
      recommendedConditions,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newIndoor = await createIndoor({
      userId,
      name,
      location,
      dimensions,
      lighting,
      ventilation,
      recommendedConditions,
    });

    return NextResponse.json(newIndoor, { status: 201 });
  } catch (error) {
    console.error("POST /api/indoors error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/indoors?indoorId=...
 * Updates an existing indoor record.
 * Request body should include the fields to update (e.g., { name: string })
 */
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const indoorId = searchParams.get("indoorId");

    if (!indoorId) {
      return NextResponse.json(
        { error: "indoorId query parameter is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      location,
      dimensions,
      lighting,
      ventilation,
      recommendedConditions,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedIndoor = await updateIndoor({
      indoorId,
      name,
      location,
      dimensions,
      lighting,
      ventilation,
      recommendedConditions,
      userId,
    });
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
 * DELETE /api/indoors?indoorId=...
 * Deletes an indoor record.
 */
export async function DELETE(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const indoorId = searchParams.get("indoorId");

    if (!indoorId) {
      return NextResponse.json(
        { error: "indoorId query parameter is missing" },
        { status: 400 }
      );
    }

    const deletedIndoor = await deleteIndoor({ indoorId, userId: user.id });

    return NextResponse.json(deletedIndoor, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/indoors error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
