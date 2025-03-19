import { cookies } from "next/headers";

import { DataStreamHandler } from "@/components/artifact/data-stream-handler";
import { Chat } from "@/components/chat/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";

export default async function ChatContainer({
  className,
}: {
  className?: string;
}) {
  const id = generateUUID();

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
          isExpanded={false}
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
        isExpanded={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
