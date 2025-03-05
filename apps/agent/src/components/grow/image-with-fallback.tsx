import Image from "next/image";
import { useMemo, useState } from "react";
import { MockImage } from "./mocks/mock-image";

interface ImageWithFallbackProps {
  imageUrl: string | null;
  fallbackUrl?: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({
  imageUrl,
  fallbackUrl = "/placeholder.jpg",
  alt,
  className,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const cleanImageUrl = useMemo(() => {
    if (!imageUrl) return fallbackUrl;

    try {
      // Validate URL format
      const isValidUrl = (urlString: string) => {
        try {
          if (urlString.startsWith("/")) return true; // Allow relative paths
          new URL(urlString);
          return true;
        } catch {
          return false;
        }
      };

      // If it's an S3 URL that failed (contains the S3 bucket name),
      // use our API endpoint instead
      if (error && imageUrl.includes("arugula-store.s3")) {
        const key = imageUrl.split("/").pop()?.split("?")[0];
        return key ? `/api/images/${key}` : fallbackUrl;
      }

      // For new requests, if it's already a relative path or API URL, use as is
      if (imageUrl.startsWith("/api/") || !imageUrl.startsWith("http")) {
        return isValidUrl(imageUrl) ? imageUrl : fallbackUrl;
      }

      // For S3 URLs, convert to API endpoint immediately
      if (imageUrl.includes("arugula-store.s3")) {
        const key = imageUrl.split("/").pop()?.split("?")[0];
        return key ? `/api/images/${key}` : fallbackUrl;
      }

      // For other URLs (e.g., external images), validate before using
      return isValidUrl(imageUrl) ? imageUrl : fallbackUrl;
    } catch (error) {
      console.error("Invalid image URL:", imageUrl, error);
      return fallbackUrl;
    }
  }, [imageUrl, error, fallbackUrl]);

  if (!cleanImageUrl || error) {
    return (
      <MockImage
        _src="/api/placeholder/400/320"
        alt={alt || "Grow image"}
        fill
        className={`object-cover rounded-md rounded-b-none ${className}`}
      />
    );
  }

  return (
    <div className="relative size-full">
      <Image
        src={cleanImageUrl}
        alt={alt || "Grow image"}
        fill
        className={`object-cover rounded-md rounded-b-none ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setError(true)}
      />
    </div>
  );
}
