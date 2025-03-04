"use client";

import { Plant } from "@/components/plants/list-view-plants";
import { useEffect, useState } from "react";

// Mock data for plants
const mockPlants: Plant[] = [
  {
    id: "plant1",
    customName: "Girl Scout Cookies #1",
    stage: "flowering",
    strain: "Girl Scout Cookies",
    potSize: "7.5L",
    imageUrl: "",
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: "plant2",
    customName: "Northern Lights #2",
    stage: "veg",
    strain: "Northern Lights",
    potSize: "5L",
    imageUrl: "",
    createdAt: "2023-05-01T14:45:00Z",
  },
  {
    id: "plant3",
    customName: "Blue Dream #1",
    stage: "seedling",
    strain: "Blue Dream",
    potSize: "1L",
    createdAt: "2023-05-20T09:15:00Z",
  },
  {
    id: "plant4",
    customName: "OG Kush #3",
    stage: "harvested",
    strain: "OG Kush",
    potSize: "10L",
    imageUrl: "",
    createdAt: "2023-03-10T11:20:00Z",
  },
  {
    id: "plant5",
    customName: "White Widow #2",
    stage: "curing",
    strain: "White Widow",
    potSize: "7.5L",
    createdAt: "2023-02-28T16:30:00Z",
  },
  {
    id: "plant6",
    customName: "Durban Poison #1",
    stage: "veg",
    strain: "Durban Poison",
    potSize: "3L",
    imageUrl: "",
    createdAt: "2023-05-05T13:10:00Z",
  },
  {
    id: "plant7",
    customName: "Sour Diesel #4",
    stage: "flowering",
    strain: "Sour Diesel",
    potSize: "7.5L",
    createdAt: "2023-04-02T10:00:00Z",
  },
  {
    id: "plant8",
    customName: "Purple Haze #1",
    stage: "archived",
    strain: "Purple Haze",
    potSize: "5L",
    imageUrl: "",
    createdAt: "2023-01-15T09:45:00Z",
  },
];

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchPlants = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/plants')
        // const data = await response.json()

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPlants(mockPlants);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return { plants, isLoading, error };
}
