"use client";
import { apiRequest } from "@/app/api/client";
import { CacheTags, createDynamicTag } from "@/app/api/tags";
import { GrowView } from "@/lib/db/queries/types/grow";
import { Grow } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { UpdateGrowForm } from "./update-grow-form";

interface EditGrowContentProps {
  growId: string;
}

export function EditGrowContent({ growId }: EditGrowContentProps) {
  const { data: grow, isLoading } = useQuery({
    queryKey: [createDynamicTag(CacheTags.growById, growId)],
    queryFn: async () => {
      return await apiRequest<
        GrowView &
          Pick<
            Grow,
            | "startDate"
            | "endDate"
            | "growingMethod"
            | "substrateComposition"
            | "potSize"
            | "indoorId"
          >
      >(`/api/grows/${growId}`);
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-3xl p-4 md:py-10 md:px-0">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!grow) {
    return <div>Grow not found</div>;
  }

  return <UpdateGrowForm grow={grow} />;
}
