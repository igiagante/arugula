"use client";

import { useQuery } from "@tanstack/react-query";

import { GrowCard, GrowCardSkeleton } from "@/components/grow/grow-card";
import type { GrowView } from "@/lib/db/queries/types/grow";
import { toast } from "sonner";
import { apiRequest } from "../../app/api/client";

export function GrowList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["grows"],
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
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((grow) => {
        const { id, lastUpdated, images, strains, ...rest } = grow;
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
