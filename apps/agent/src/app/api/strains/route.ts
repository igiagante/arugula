import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAllStrains } from "@/lib/db/queries/strains";

/**
 * GET /api/strains
 * Retrieves all strains.
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const strains = await getAllStrains();
    return NextResponse.json(strains, { status: 200 });
  } catch (error) {
    console.error("GET /api/strains error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
