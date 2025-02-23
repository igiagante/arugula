import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createStrain,
  updateStrain,
  deleteStrain,
  getStrainById,
  getAllStrains,
} from "@/lib/db/queries/strains";

/**
 * GET /api/strains/[id]
 * If strainId is provided, returns that strain.
 * Otherwise, returns all strains.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: strainId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (strainId) {
      const strainRecord = await getStrainById({ strainId });
      return NextResponse.json(strainRecord, { status: 200 });
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
 * POST /api/strains
 * Creates a new strain.
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newStrain = await createStrain(data);
    return NextResponse.json(newStrain, { status: 201 });
  } catch (error) {
    console.error("POST /api/strains error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/strains/[id]
 * Updates an existing strain.
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

    const { id: strainId } = await params;

    if (!strainId) {
      return NextResponse.json(
        { error: "strainId query parameter is missing" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const updatedStrain = await updateStrain({ strainId, data });
    return NextResponse.json(updatedStrain, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/strains error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/strains/[id]
 * Deletes a strain.
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

    const { id: strainId } = await params;

    if (!strainId) {
      return NextResponse.json(
        { error: "Strain ID is missing" },
        { status: 400 }
      );
    }

    const deletedStrain = await deleteStrain({ strainId });
    return NextResponse.json(deletedStrain, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/strains error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
