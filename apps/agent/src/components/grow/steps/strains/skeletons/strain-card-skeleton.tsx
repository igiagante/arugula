import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface StrainCardSkeletonProps {
  className?: string;
}

export function StrainCardSkeleton({ className }: StrainCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border-gray-200",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100/50 before:to-transparent",
        className
      )}
    >
      <CardHeader className="relative aspect-square p-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100" />

        {/* THC/CBD badges skeleton */}
        <div className="absolute left-3 bottom-3 z-20 flex gap-2">
          <span className="bg-gray-200 text-transparent rounded-full px-2 py-1 w-16 h-6" />
          <span className="bg-gray-200 text-transparent rounded-full px-2 py-1 w-16 h-6" />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Name and breeder skeleton */}
          <div>
            <div className="h-5 bg-gray-100 rounded w-3/4 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>

          {/* Ratio skeleton */}
          <div className="h-6 bg-gray-100 rounded-md w-full" />

          {/* Height and flowering time skeleton */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-full" />
          </div>

          {/* Yield skeleton */}
          <div className="h-4 bg-gray-100 rounded w-2/3" />

          {/* Terpenes skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-5 bg-gray-200 rounded-full" />
              ))}
            </div>
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
