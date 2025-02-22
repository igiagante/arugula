import { unstable_cache } from "next/cache";
import { fetcherWithAuth } from "../server";

export const fetchIndoors = async (): Promise<any> => {
  const fetcher = await fetcherWithAuth();

  return (
    await unstable_cache(
      async () => {
        return fetcher("/api/indoors");
      },
      ["indoors"],
      {
        revalidate: 60,
        tags: ["indoors"],
      }
    )
  )();
};
