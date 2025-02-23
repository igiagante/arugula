import { getTasksByGrowId } from "@/lib/db/queries/tasks";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/tasks
 * Retrieves all tasks for a given grow.
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const growId = searchParams.get("growId");

    if (!growId) {
      return NextResponse.json(
        { error: "Missing growId parameter" },
        { status: 400 }
      );
    }

    const tasks = await getTasksByGrowId({ growId });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET /api/strains error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
