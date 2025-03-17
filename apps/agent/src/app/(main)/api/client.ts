export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethods = (typeof HttpMethods)[keyof typeof HttpMethods];

/**
 * Creates an API client for making API requests from the browser.
 *
 * @param queryParams - Object containing query parameters to include in the URL
 * @returns A function that takes a path and returns a Promise with the response data
 *
 * @example
 * ```ts
 * const apiClient = createApiClient();
 * const response = await apiClient("/api/endpoint", "POST", { data: "example" });
 * ```
 */
export const apiRequest = async <T, B = undefined>(
  url: string,
  {
    method = HttpMethods.GET,
    body,
    queryParams,
  }: {
    method?: HttpMethods;
    body?: B;
    queryParams?: Record<string, string>;
  } = {}
) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const urlWithQuery = `${url}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(urlWithQuery, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // This ensures cookies are sent with the request
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
