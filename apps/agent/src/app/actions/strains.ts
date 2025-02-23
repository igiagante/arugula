import { createApiClient, HttpMethods } from "../server";
import { Strain } from "@/lib/db/schema";
import { unstable_cache } from "next/cache";

export type CreateStrainDto = Omit<Strain, "id" | "created_at" | "updated_at">;
export type UpdateStrainDto = Partial<CreateStrainDto>;

export async function fetchStrains(): Promise<Strain[]> {
  const apiClient = await createApiClient();

  return (
    await unstable_cache(
      async () => {
        return apiClient<Strain[]>("/api/strains", HttpMethods.GET);
      },
      ["strains"],
      {
        revalidate: 60,
        tags: ["strains"],
      }
    )
  )();
}

export async function fetchStrainById(strainId: string): Promise<Strain> {
  const apiClient = await createApiClient();
  return apiClient<Strain>(
    `/api/strains?strainId=${strainId}`,
    HttpMethods.GET
  );
}

export async function createStrain(data: CreateStrainDto): Promise<Strain> {
  const apiClient = await createApiClient();
  return apiClient<Strain, CreateStrainDto>(
    "/api/strains",
    HttpMethods.POST,
    undefined,
    data
  );
}

export async function updateStrain(
  strainId: string,
  data: UpdateStrainDto
): Promise<Strain> {
  const apiClient = await createApiClient();
  return apiClient<Strain, UpdateStrainDto>(
    `/api/strains?strainId=${strainId}`,
    HttpMethods.PATCH,
    undefined,
    data
  );
}

export async function deleteStrain(strainId: string): Promise<Strain> {
  const apiClient = await createApiClient();
  return apiClient<Strain>(
    `/api/strains?strainId=${strainId}`,
    HttpMethods.DELETE
  );
}

export async function getAllStrains(): Promise<Strain[]> {
  const apiClient = await createApiClient();
  return apiClient<Strain[]>("/api/strains", HttpMethods.GET);
}
