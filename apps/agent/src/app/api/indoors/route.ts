import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getIndoorsByUserId } from "@/lib/db/queries/indoors";

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
    const indoor = await getIndoorsByUserId({ userId });
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
