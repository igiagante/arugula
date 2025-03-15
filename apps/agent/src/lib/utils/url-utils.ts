// First, create a new utility file for URL-related functions

export function isValidUrl(urlString: string): boolean {
  try {
    if (urlString.startsWith("/")) return true; // Allow relative paths
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function getS3ImageKey(url: string): string | null {
  if (!url.includes("arugula-store.s3")) return null;
  return url.split("/").pop()?.split("?")[0] || null;
}

export function getCleanImageUrl(params: {
  imageUrl: string | null;
  fallbackUrl: string;
  useApiEndpoint?: boolean;
}): string {
  const { imageUrl, fallbackUrl, useApiEndpoint = false } = params;

  if (!imageUrl) return fallbackUrl;

  try {
    // For S3 URLs
    if (imageUrl.includes("arugula-store.s3")) {
      if (useApiEndpoint) {
        const key = getS3ImageKey(imageUrl);
        return key ? `/api/images/${key}` : fallbackUrl;
      }
      return imageUrl; // Use direct S3 URL if not using API endpoint
    }

    // For API or relative paths
    if (imageUrl.startsWith("/api/") || !imageUrl.startsWith("http")) {
      return isValidUrl(imageUrl) ? imageUrl : fallbackUrl;
    }

    // For other URLs
    return isValidUrl(imageUrl) ? imageUrl : fallbackUrl;
  } catch (error) {
    console.error("Invalid image URL:", imageUrl, error);
    return fallbackUrl;
  }
}
