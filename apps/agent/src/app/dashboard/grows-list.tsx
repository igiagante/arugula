"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { GrowView } from "@/lib/db/queries/types/grow";
import { GrowCard, GrowCardSkeleton } from "@/components/grow/grow-card";
import { apiRequest } from "../api/client";
import { toast } from "sonner";

const growsData = [
  {
    id: 1,
    name: "Spring 2026 Cycle",
    stage: "Flowering",
    environment: {
      light: "600W LED",
      temp: "75°F",
      humidity: "45%",
    },
    strains: [
      {
        name: "Blue Dream",
        count: 3,
        type: "Hybrid • 70/30",
        thc: "18-24%",
        cbd: "0.1-0.2%",
      },
      {
        name: "Wedding Cake",
        count: 2,
        type: "Indica • 80/20",
        thc: "22-25%",
        cbd: "0.1%",
      },
    ],
    progress: 65,
    lastUpdated: "2h ago",
    image:
      "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    name: "Winter Autoflower Run",
    stage: "Vegetative",
    environment: {
      light: "400W LED",
      temp: "72°F",
      humidity: "60%",
    },
    strains: [
      {
        name: "Northern Lights Auto",
        count: 2,
        type: "Indica • 90/10",
        thc: "16-21%",
        cbd: "0.1%",
      },
      {
        name: "Critical Mass CBD",
        count: 1,
        type: "Hybrid • 50/50",
        thc: "5-8%",
        cbd: "8-12%",
      },
    ],
    progress: 30,
    lastUpdated: "4h ago",
    image:
      "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    name: "Fall 2025 Harvest",
    stage: "Completed",
    environment: {
      light: "600W LED",
      temp: "73°F",
      humidity: "50%",
    },
    strains: [
      {
        name: "Girl Scout Cookies",
        count: 2,
        type: "Hybrid • 60/40",
        thc: "19-23%",
        cbd: "0.2%",
      },
      {
        name: "Purple Punch",
        count: 2,
        type: "Indica • 85/15",
        thc: "20-24%",
        cbd: "0.1%",
      },
    ],
    progress: 100,
    lastUpdated: "2d ago",
    yield: "16 oz",
    image:
      "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600",
  },
];

export function GrowsList() {
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
      {[...(data ?? []), ...growsData].map((grow) => (
        <GrowCard
          key={grow.id}
          {...grow}
          lastUpdated={grow.lastUpdated.toLocaleString()}
          image={
            grow.image ??
            "https://kzmldmf02xim38b47rcg.lite.vusercontent.net/placeholder.svg?height=400&width=600"
          }
        />
      ))}
    </div>
  );
}
