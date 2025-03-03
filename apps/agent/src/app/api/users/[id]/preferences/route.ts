import { CacheTags, createDynamicTag } from "@/app/api/tags";
import {
  DistanceUnits,
  TemperatureUnits,
  VolumeUnits,
  WeightUnits,
} from "@/app/types/user/preferences";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/db/queries/user";
import { user } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/users/[id]/preferences
 * Returns a user's preferences
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params object before using its properties
  const { id } = await params;
  const { userId } = await auth();

  console.log("GET /api/users/[id]/preferences", userId, id);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Security check - users can only update their own preferences
  if (userId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    if (userId) {
      const userRecord = await unstable_cache(
        async () => getUserById({ id: userId }),
        [createDynamicTag(CacheTags.getUserById, userId)],
        {
          revalidate: 60, // Cache for 60 seconds
          tags: [createDynamicTag(CacheTags.getUserById, userId)],
        }
      )();

      // Return just the preferences or an empty object if not found
      return NextResponse.json(userRecord?.preferences || {}, { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/users/[id]/preferences error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]/preferences
 * Updates a user's preferences
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: currentUserId } = await auth();
  const { id } = await params;

  // Security check
  if (currentUserId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Get request body
    const requestData = await request.json().catch((e) => {
      console.error("JSON parsing error:", e);
      return null;
    });

    if (!requestData) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Transform flat structure to nested structure if needed
    const preferences = {
      measurements: {
        volume: requestData.volume || VolumeUnits.liters,
        temperature: requestData.temperature || TemperatureUnits.celsius,
        distance: requestData.distance || DistanceUnits.cm,
        weight: requestData.weight || WeightUnits.kg,
      },
      notifications: {
        emailAlerts:
          requestData.emailAlerts === true ||
          requestData.emailAlerts === "true",
        pushNotifications:
          requestData.pushNotifications === true ||
          requestData.pushNotifications === "true",
      },
      display: {
        showMetrics:
          requestData.showMetrics === true ||
          requestData.showMetrics === "true",
        darkMode:
          requestData.darkMode === true || requestData.darkMode === "true",
      },
    };

    await db.update(user).set({ preferences }).where(eq(user.id, id));

    revalidateTag(createDynamicTag(CacheTags.getUserById, id));

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      {
        error: "Failed to update preferences",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
