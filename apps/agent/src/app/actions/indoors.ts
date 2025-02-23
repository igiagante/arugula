import { unstable_cache } from "next/cache";
import { createApiClient, HttpMethods } from "../server";
import { Indoor } from "@/lib/db/schema";

export type CreateIndoorDto = Omit<Indoor, "id" | "createdAt" | "updatedAt">;
export type UpdateIndoorDto = Partial<CreateIndoorDto>;

export const fetchIndoors = async ({
  userId,
}: {
  userId: string;
}): Promise<any> => {
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
};

export const createIndoor = async (data: CreateIndoorDto): Promise<Indoor> => {
  const createIndoor = await createApiClient();

  return createIndoor<Indoor, CreateIndoorDto>(
    "/api/indoors",
    HttpMethods.POST,
    {},
    data
  );
};

export const updateIndoor = async (
  id: string,
  data: UpdateIndoorDto
): Promise<Indoor> => {
  const updateIndoor = await createApiClient();

  return updateIndoor<Indoor, UpdateIndoorDto>(
    `/api/indoors/${id}`,
    HttpMethods.PATCH,
    {},
    data
  );
};

export const deleteIndoor = async (id: string): Promise<void> => {
  const deleteIndoor = await createApiClient();

  return deleteIndoor(`/api/indoors/${id}`, HttpMethods.DELETE);
};
