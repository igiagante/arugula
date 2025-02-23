import { unstable_cache } from "next/cache";
import { createApiClient, HttpMethods } from "../server";
import { Plant } from "@/lib/db/schema";

export type CreatePlantDto = Omit<Plant, "id" | "createdAt" | "updatedAt">;
export type UpdatePlantDto = Partial<CreatePlantDto>;

export async function fetchPlants(growId: string): Promise<Plant[]> {
  const apiClient = await createApiClient();

  return (
    await unstable_cache(
      async () => {
        return apiClient<Plant[]>(
          `/api/plants?growId=${growId}`,
          HttpMethods.GET
        );
      },
      ["plants"],
      {
        revalidate: 60,
        tags: ["plants"],
      }
    )
  )();
}

export async function createPlant(data: CreatePlantDto): Promise<Plant> {
  const apiClient = await createApiClient();
  return apiClient<Plant, CreatePlantDto>(
    `/api/plants`,
    HttpMethods.POST,
    undefined,
    data
  );
}

export async function updatePlant(
  plantId: string,
  data: UpdatePlantDto
): Promise<Plant> {
  const apiClient = await createApiClient();
  return apiClient<Plant, UpdatePlantDto>(
    `/api/plants?plantId=${plantId}`,
    HttpMethods.PATCH,
    undefined,
    data
  );
}

export async function deletePlant(plantId: string): Promise<Plant> {
  const apiClient = await createApiClient();
  return apiClient<Plant>(`/api/plants?plantId=${plantId}`, HttpMethods.DELETE);
}

export async function fetchPlantWithStrain(plantId: string) {
  const response = await fetch(`/api/plants/${plantId}?include=strain`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch plant with strain");
  return response.json();
}
