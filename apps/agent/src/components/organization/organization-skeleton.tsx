import { Skeleton } from "@workspace/ui/components/skeleton";

export function OrganizationSkeleton() {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <Skeleton className="size-10 rounded-lg mr-3" />
          <div className="grow">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        <div className="space-y-2.5 mt-3">
          <div className="flex items-center">
            <Skeleton className="size-3.5 mr-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center">
            <Skeleton className="size-3.5 mr-2 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
