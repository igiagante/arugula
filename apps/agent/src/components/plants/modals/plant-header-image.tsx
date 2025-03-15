import { ImageWithFallback } from "@/components/grow/image-with-fallback";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import { getStageBadgeColor } from "../plant-utils";

interface PlantHeaderImageProps {
  imageUrl?: string | null;
  title: string;
  stage?: string;
  strain?: string;
  updatedAt?: Date;
  className?: string;
  onClose?: () => void;
}

export function PlantHeaderImage({
  imageUrl,
  title,
  stage,
  strain,
  updatedAt,
  className,
  onClose,
}: PlantHeaderImageProps) {
  return (
    <div className="relative">
      {onClose && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full bg-background/60 hover:bg-background/80"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      <div className={`relative h-40 sm:h-48 w-full ${className}`}>
        <ImageWithFallback
          imageUrl={imageUrl || ""}
          alt={title}
          className="brightness-[0.85] rounded-b-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {stage && (
              <Badge
                className={`${getStageBadgeColor(stage)} border border-white/20`}
              >
                {stage}
              </Badge>
            )}
            {strain && (
              <span className="text-xs sm:text-sm opacity-90">{strain}</span>
            )}
          </div>
          {updatedAt && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs sm:text-sm opacity-90">
                Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
