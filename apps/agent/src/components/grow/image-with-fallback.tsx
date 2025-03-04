import Image from "next/image";
import { useMemo, useState } from "react";
import { MockImage } from "./mocks/mock-image";

export function ImageWithFallback({
  imageUrl,
  alt,
  className,
}: {
  imageUrl: string;
  alt: string;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  // Clean and validate the URL
  const cleanImageUrl = useMemo(() => {
    if (!imageUrl) return null;

    try {
      // Handle absolute URLs
      if (imageUrl.startsWith("http")) {
        return new URL(imageUrl).toString();
      }
      // Add API base URL for relative paths
      return `/api/images/${imageUrl}`; // Adjust this path to match your image API endpoint
    } catch (error) {
      console.error("Invalid image URL:", imageUrl, error);
      return null;
    }
  }, [imageUrl]);

  if (!cleanImageUrl || imageError) {
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
        onError={() => setImageError(true)}
      />
    </div>
  );
}
