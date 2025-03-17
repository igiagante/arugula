import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define a type for the auth context
export type AuthContext = {
  userId: string;
  orgId: string;
  error: null;
};

export type AuthError = {
  userId?: string;
  orgId?: string;
  error: NextResponse;
};

/**
 * Gets the authenticated user context with proper error handling
 * @returns AuthContext if successful, AuthError if authentication fails
 */
export async function getAuthContext(): Promise<AuthContext | AuthError> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      userId: undefined,
      orgId: undefined,
    };
  }

  if (!orgId) {
    return {
      error: NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      ),
      userId,
      orgId: undefined,
    };
  }

  return { userId, orgId, error: null };
}
