import { StrainCardSkeleton } from "./strain-card-skeleton";

interface StrainGallerySkeletonProps {
  count?: number;
  className?: string;
}

export function StrainGallerySkeleton({
  count = 6,
  className,
}: StrainGallerySkeletonProps) {
  return (
    <div
      className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 ${className || ""}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <StrainCardSkeleton key={index} />
      ))}
    </div>
  );
}
