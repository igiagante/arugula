"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { createApiClient, HttpMethods } from "../server";
import { Indoor } from "@/lib/db/schema";

export type CreateIndoorDto = Omit<Indoor, "id" | "createdAt" | "updatedAt">;
export type UpdateIndoorDto = Partial<CreateIndoorDto>;

export async function fetchIndoors({ userId }: { userId: string }) {
  const getIndoors = await createApiClient();

  return (
    await unstable_cache(
      async () => {
        return getIndoors<Indoor[]>("/api/indoors", HttpMethods.GET, {
          userId,
        });
      },
      ["indoors"],
      {
        revalidate: 60,
        tags: ["indoors"],
      }
    )
  )();
}

export const createIndoor = async (data: CreateIndoorDto): Promise<Indoor> => {
  const createIndoor = await createApiClient();

  const result = await createIndoor<Indoor, CreateIndoorDto>(
    "/api/indoors",
    HttpMethods.POST,
    {},
    data
  );

  // Invalidate the cache after creating new indoor
  revalidateTag("indoors");

  return result;
};

export const updateIndoor = async (
  id: string,
  data: UpdateIndoorDto
): Promise<Indoor> => {
  const updateIndoor = await createApiClient();

  const result = await updateIndoor<Indoor, UpdateIndoorDto>(
    `/api/indoors/${id}`,
    HttpMethods.PATCH,
    {},
    data
  );

  // Invalidate the cache after updating indoor
  revalidateTag("indoors");

  return result;
};

export const deleteIndoor = async (id: string): Promise<void> => {
  const deleteIndoor = await createApiClient();

  await deleteIndoor(`/api/indoors/${id}`, HttpMethods.DELETE);

  // Invalidate the cache after deleting indoor
  revalidateTag("indoors");
};
