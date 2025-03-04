"use client";

import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { ChatHeader } from "@/components/chat-header";
import type { Vote } from "@/lib/db/schemas";
import { fetcher, generateUUID } from "@/lib/utils";

import { useArtifactSelector } from "@/hooks/use-artifact";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Artifact } from "./artifact";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import type { VisibilityType } from "./visibility-selector";

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
  className,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  className?: string;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate("/api/history");
    },
    onError: (_error) => {
      toast.error("An error occured, please try again!");
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 min-[1480px]:hidden"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all",
          "min-[1480px]:bg-transparent min-[1480px]:backdrop-blur-none min-[1480px]:relative min-[1480px]:inset-auto min-[1480px]:w-[480px]",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          "min-[1480px]:opacity-100 min-[1480px]:pointer-events-auto",
          className
        )}
      >
        <div
          className={`
          fixed right-0 h-dvh w-full bg-background shadow-lg transition-transform duration-300
          min-[1480px]:relative min-[1480px]:right-auto min-[1480px]:shadow-none min-[1480px]:w-[480px]
          ${isOpen ? "translate-x-0" : "translate-x-full"} min-[1480px]:translate-x-0
        `}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 min-[1480px]:hidden z-[60] top-16 border size-8"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </Button>

          <div className="flex flex-col h-dvh bg-background">
            <ChatHeader
              chatId={id}
              selectedModelId={selectedChatModel}
              selectedVisibilityType={selectedVisibilityType}
              isReadonly={isReadonly}
            />

            <Messages
              chatId={id}
              isLoading={isLoading}
              votes={votes}
              messages={messages}
              setMessages={setMessages}
              reload={reload}
              isReadonly={isReadonly}
              isArtifactVisible={isArtifactVisible}
            />

            <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full">
              {!isReadonly && (
                <MultimodalInput
                  chatId={id}
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  stop={stop}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  messages={messages}
                  setMessages={setMessages}
                  append={append}
                />
              )}
            </form>
          </div>
        </div>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
