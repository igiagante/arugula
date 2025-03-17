"use client";

import { useQuery } from "@tanstack/react-query";

import { CacheTags } from "@/app/(main)/api/tags";
import { GrowCard } from "@/components/grow/grow-card";
import { GrowCardSkeleton } from "@/components/skeletons/grow-card-skeleton";
import type { GrowView } from "@/lib/db/queries/types/grow";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { apiRequest } from "../../app/(main)/api/client";

export function GrowList() {
  const { open: isSidebarOpen } = useSidebar();
  const { data, isLoading, error } = useQuery({
    queryKey: [CacheTags.grows],
    queryFn: async () => {
      return await apiRequest<GrowView[]>("/api/grows");
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {new Array(6).fill(null).map((_, index) => (
          <GrowCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    toast.error("Error loading grows", {
      description: error.message,
    });
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 ",
        isSidebarOpen
          ? "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
          : "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4"
      )}
    >
      {data?.map((grow) => {
        const { id, lastUpdated, images, strains, ...rest } = grow;
        const {
          plants: {},
        } = grow;
        return (
          <GrowCard
            key={id}
            id={id}
            strains={strains.map((strain) => ({
              ...strain,
              count: strain.plants,
            }))}
            {...rest}
            lastUpdated={lastUpdated.toLocaleString()}
            images={images || []}
          />
        );
      })}
    </div>
  );
}
