import { auth } from "@clerk/nextjs/server";

// Get auth data outside of the cached function
async function getAuthData() {
  const { getToken, userId } = await auth();
  const token = await getToken();
  return { token, userId };
}

/**
 * Creates an authenticated fetcher function.
 * IMPORTANT: This function must be called outside of unstable_cache as it uses
 * authentication data that should not be cached.
 */
export async function fetcherWithAuth() {
  const { token, userId } = await getAuthData();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return async (path: string) => {
    const response = await fetch(`${baseUrl}${path}?userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return response.json();
  };
}
