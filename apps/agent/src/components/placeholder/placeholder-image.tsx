import { cn } from "@workspace/ui/lib/utils";

interface PlaceholderImageProps {
  className?: string;
}

export function PlaceholderImage({ className }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative size-full flex items-center justify-center",
        "bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30",
        "rounded-md overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute inset-0 size-full text-muted-foreground/10"
        fill="currentColor"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <pattern
          id="plant-pattern"
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
          patternTransform="rotate(45)"
        >
          <path d="M0 10h20v1H0z" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#plant-pattern)" />
      </svg>
      <svg
        className="size-16 text-muted-foreground/40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M12 2L8 6h8l-4-4z" />
        <path d="M12 22V10" />
        <path d="M12 6c4 0 8-2 8-4" />
        <path d="M12 6c-4 0-8-2-8-4" />
        <path d="M12 10c4 0 8-2 8-4" />
        <path d="M12 10c-4 0-8-2-8-4" />
      </svg>
    </div>
  );
}
