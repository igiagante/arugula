import { getCleanImageUrl } from "@/lib/utils/url-utils";
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
  alt,
  className,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  // Move useMemo to the top with other hooks
  const cleanImageUrl = useMemo(() => {
    if (!imageUrl || imageUrl.startsWith("blob:")) return imageUrl;
    return getCleanImageUrl({
      imageUrl,
      fallbackUrl: "/images/placeholder.jpg",
      useApiEndpoint: error,
    });
  }, [imageUrl, error]);

  // Now handle the different render cases
  if (!imageUrl || error) {
    return (
      <MockImage
        _src="/images/placeholder.jpg"
        alt={alt || "Grow image"}
        fill
        className={`object-cover rounded-md ${className}`}
      />
    );
  }

  if (imageUrl.startsWith("blob:")) {
    return (
      <div className="relative size-full">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={`object-cover rounded-md ${className}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div className="relative size-full">
      <Image
        src={cleanImageUrl || ""}
        alt={alt || "Grow image"}
        fill
        priority={true}
        className={`object-cover rounded-md ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setError(true)}
      />
    </div>
  );
}
