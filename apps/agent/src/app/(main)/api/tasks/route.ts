import { createTask, getTasksByGrowId } from "@/lib/db/queries/tasks";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../tags";

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

    const tasks = await unstable_cache(
      async () => getTasksByGrowId({ growId }),
      [createDynamicTag(CacheTags.tasksByGrowId, growId)],
      {
        revalidate: 3600, // Cache for 1 hour
        tags: [createDynamicTag(CacheTags.tasksByGrowId, growId)],
      }
    )();

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Creates a new task
 * Required fields:
 * - taskTypeId: string
 * - growId: string
 * Optional fields:
 * - notes: string
 * - details: object
 * - images: string[]
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();

    // Validate required fields
    if (!data.taskTypeId || !data.growId) {
      return NextResponse.json(
        { error: "Missing required fields: taskTypeId and growId" },
        { status: 400 }
      );
    }

    const newTask = await createTask({ ...data, userId });

    revalidateTag(createDynamicTag(CacheTags.tasksByGrowId, data.growId));

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
