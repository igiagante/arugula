import Image from "next/image";
import { useMemo, useState } from "react";
import { MockImage } from "./mocks/mock-image";

export function GrowImage({
  imageUrl,
  alt,
}: {
  imageUrl: string;
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);

  // Clean and validate the URL
  const cleanImageUrl = useMemo(() => {
    try {
      if (!imageUrl) return "";
      if (imageUrl.startsWith("http")) {
        const url = new URL(imageUrl);
        return url.toString();
      }
      return imageUrl;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return "";
    }
  }, [imageUrl]);

  if (!cleanImageUrl || imageError) {
    return (
      <MockImage
        _src="/api/placeholder/400/320"
        alt={alt || "Grow image"}
        fill
        className="object-cover rounded-md"
      />
    );
  }

  return (
    <div className="relative size-full">
      <Image
        src={cleanImageUrl}
        alt={alt || "Grow image"}
        fill
        className="object-cover rounded-md"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
