import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGrowsByUserId } from "@/lib/db/queries/grows";

/**
 * GET /api/grows
 * Returns all grow records for the authenticated user.
 */
export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const grows = await getGrowsByUserId({ userId });
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
