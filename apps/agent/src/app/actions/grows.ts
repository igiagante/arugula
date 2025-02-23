import { unstable_cache } from "next/cache";
import { createApiClient, HttpMethods } from "../server"; // adjust path accordingly
import { Grow } from "@/lib/db/schema";

export type CreateGrowDto = {
  indoorId: string;
  name: string;
  stage: string;
  startDate: Date;
  substrateComposition?: Record<string, number>;
  potSize?: number;
  growingMethod?: string;
};

export type UpdateGrowDto = Partial<CreateGrowDto>;

export async function fetchGrowsByIndoorId(indoorId: string): Promise<Grow[]> {
  const apiClient = await createApiClient();

  return (
    await unstable_cache(
      async () => {
        return apiClient<Grow[]>(
          `/api/grows?indoorId=${indoorId}`,
          HttpMethods.GET
        );
      },
      ["grows"],
      {
        revalidate: 60,
        tags: ["grows"],
      }
    )
  )();
}

export async function fetchGrows(): Promise<Grow[]> {
  const apiClient = await createApiClient();

  return (
    await unstable_cache(
      async () => {
        return apiClient<Grow[]>(`/api/grows`, HttpMethods.GET);
      },
      ["grows"],
      {
        revalidate: 60,
        tags: ["grows"],
      }
    )
  )();
}

export async function createGrow(data: CreateGrowDto): Promise<Grow> {
  const apiClient = await createApiClient();
  return apiClient<Grow, CreateGrowDto>(
    `/api/grows`,
    HttpMethods.POST,
    undefined,
    data
  );
}

export async function updateGrow(
  growId: string,
  data: UpdateGrowDto
): Promise<Grow> {
  const apiClient = await createApiClient();
  return apiClient<Grow, UpdateGrowDto>(
    `/api/grows?growId=${growId}`,
    HttpMethods.PATCH,
    undefined,
    data
  );
}

export async function deleteGrow(growId: string): Promise<Grow> {
  const apiClient = await createApiClient();
  return apiClient<Grow>(`/api/grows?growId=${growId}`, HttpMethods.DELETE);
}
