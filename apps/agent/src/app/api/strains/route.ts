import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createStrain, getAllStrains } from "@/lib/db/queries/strains";
import { unstable_cache, revalidateTag } from "next/cache";
import { CacheTags } from "../tags";

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

    const strains = await unstable_cache(
      async () => getAllStrains(),
      [CacheTags.strains],
      {
        revalidate: 60, // Cache for 1 minute
        tags: [CacheTags.strains],
      }
    )();

    return NextResponse.json(strains, { status: 200 });
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

    revalidateTag(CacheTags.strains);

    return NextResponse.json(newStrain, { status: 201 });
  } catch (error) {
    console.error("POST /api/strains error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
