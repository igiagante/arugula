import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPlantsByGrowId } from "@/lib/db/queries/plants";

/**
 * GET /api/plants?growId=...
 * Returns all plants for the specified grow.
 * Requires growId query parameter.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const growId = searchParams.get("growId");

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (growId) {
      const plants = await getPlantsByGrowId({ growId });
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
