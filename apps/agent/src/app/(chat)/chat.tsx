import { cookies } from "next/headers";

import { Chat } from "@/components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { fetchGrowsByIndoorId } from "../actions/grows";
import { fetchPlants } from "../actions/plants";
import { fetchIndoors } from "../actions/indoors";
import { fetchStrainById } from "../actions/strains";
import { fetchTasksByGrow } from "../actions/tasks";
import { fetchProducts } from "../actions/products";

export default async function ChatContainer({
  className,
}: {
  className?: string;
}) {
  const id = generateUUID();

  const indoorData = await fetchIndoors({
    userId: "user_2tMsS1D6OD8KYB9GQxWHo6as1IX",
  });
  console.log("Indoor data:", indoorData);

  // const growData = await fetchGrowsByIndoorId(indoorData[0].id);
  // console.log("Grow data:", growData);

  // const grow = growData[0];
  // if (grow) {
  //   const plantData = await fetchPlants(grow.id);
  //   console.log("Plant data:", plantData);

  //   // Get the first plant and fetch its strain
  //   const plant = plantData[0];
  //   const strainId = plant?.strainId;
  //   if (plant && strainId) {
  //     const strainData = await fetchStrainById(strainId);
  //     console.log("Plant strainId:", strainId);
  //     console.log("Strain data:", strainData);
  //   }

  //   const taskData = await fetchTasksByGrow(grow.id);
  //   console.log("Task data:", JSON.stringify(taskData, null, 2));
  // }

  // const productData = await fetchProducts();
  // console.log("Product data:", productData);

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
          className={className}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
        className={className}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
