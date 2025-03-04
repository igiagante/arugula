import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function GrowCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="relative p-0">
        <div className="relative h-48">
          <Skeleton className="absolute inset-0" />
          <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-50 p-3">
          {[0, 1].map((index) => (
            <div key={index}>
              {index > 0 && <div className="my-3 h-px bg-border" />}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-8" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  );
}
