import { auth } from "@clerk/nextjs/server";

export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethods = (typeof HttpMethods)[keyof typeof HttpMethods];

/**
 * Creates an authenticated API client for making API requests.
 *
 * @param queryParams - Object containing query parameters to include in the URL
 * @returns A function that takes a path and returns a Promise with the response data
 *
 * @important This function must be called outside of unstable_cache as it uses
 * authentication data that should not be cached.
 *
 * @example
 * ```ts
 * const apiClient = await createApiClient({ userId: "123", filter: "active" });
 * const response = await apiClient("/api/endpoint", "POST", { data: "example" });
 * ```
 */
export const createApiClient = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return async <T, B = undefined>(
    url: string,
    method: HttpMethods = HttpMethods.GET,
    queryParams?: Record<string, string>,
    body?: B
  ) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const urlWithQuery = `${baseUrl}${url}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(urlWithQuery, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  };
};
