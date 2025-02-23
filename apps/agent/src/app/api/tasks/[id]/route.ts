// app/(tasks)/api/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "@/lib/db/queries/tasks";

/**
 * GET /api/tasks/[id]
 * If taskId is provided, returns that task.
 * Otherwise, returns all tasks.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (taskId) {
      const taskRecord = await getTaskById({ taskId });
      return NextResponse.json(taskRecord, { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/strains error:", error);
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
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
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
        { error: "Task ID is missing" },
        { status: 400 }
      );
    }

    const deleted = await deleteTask({ taskId });
    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
