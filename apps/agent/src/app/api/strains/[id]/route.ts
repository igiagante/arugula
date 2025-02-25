import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";
import {
  updateStrain,
  deleteStrain,
  getStrainById,
} from "@/lib/db/queries/strains";
import { CacheTags, createDynamicTag } from "../../tags";

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
      const getCachedStrain = unstable_cache(
        async () => getStrainById({ strainId }),
        [`strain-${strainId}`],
        {
          revalidate: 3600, // Cache for 1 hour
          tags: [createDynamicTag(CacheTags.strain, strainId)],
        }
      );

      const strainRecord = await getCachedStrain();
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

    revalidateTag(CacheTags.strains);
    revalidateTag(createDynamicTag(CacheTags.strain, strainId));

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

    revalidateTag(CacheTags.strains);

    return NextResponse.json(deletedStrain, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/strains error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
