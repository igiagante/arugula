import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function PlantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Skeleton className="size-full" />
          <Skeleton className="absolute top-2 right-2 h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0 flex justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="size-8 rounded-full" />
      </CardFooter>
    </Card>
  );
}
