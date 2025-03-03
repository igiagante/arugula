import { deleteTask, getTaskById, updateTask } from "@/lib/db/queries/tasks";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { CacheTags, createDynamicTag } from "../../tags";

/**
 * GET /api/tasks/[id]
 * If taskId is provided, returns that task.
 * Otherwise, returns all tasks.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (taskId) {
      const taskRecord = await unstable_cache(
        async () => getTaskById({ taskId }),
        [createDynamicTag(CacheTags.getTaskById, taskId)],
        {
          revalidate: 3600, // Cache for 1 hour
          tags: [createDynamicTag(CacheTags.getTaskById, taskId)],
        }
      )();
      return NextResponse.json(taskRecord, { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tasks/[id]
 * Updates a task
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    if (!taskId) {
      return NextResponse.json(
        { error: "taskId query parameter is missing" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const updatedTask = await updateTask({ taskId, data });

    if (updatedTask) {
      revalidateTag(createDynamicTag(CacheTags.getTaskById, updatedTask.id));
      revalidateTag(
        createDynamicTag(CacheTags.tasksByGrowId, updatedTask.growId)
      );
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Deletes a task
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is missing" },
        { status: 400 }
      );
    }

    const deletedTask = await deleteTask({ taskId });

    if (deletedTask) {
      revalidateTag(
        createDynamicTag(CacheTags.tasksByGrowId, deletedTask.growId)
      );
    }

    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
