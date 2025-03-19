"use client";

import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { ChatHeader } from "@/components/chat/chat-header";
import type { Vote } from "@/lib/db/schemas";
import { fetcher, generateUUID } from "@/lib/utils";

import { useArtifactSelector } from "@/hooks/use-artifact";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@workspace/ui/components/button";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Artifact } from "../artifact/artifact";
import { Messages } from "../messages/messages";
import { MultimodalInput } from "../multimodal-input";
import type { VisibilityType } from "../visibility-selector";

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
  className,
  isExpanded,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  className?: string;
  isExpanded: boolean;
}) {
  const { open: isSidebarOpen } = useSidebar();
  const { mutate } = useSWRConfig();

  const [windowWidth, setWindowWidth] = useState(0);
  const isMobile = useIsMobile();

  // Track window width for responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    if (typeof window !== "undefined") {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Calculate chat width based on screen size
  const getChatWidth = () => {
    // For mobile screens
    if (windowWidth < 768) {
      return "100%";
    }

    // For very large screens (>2000px)
    if (windowWidth > 2000) {
      return isExpanded ? "600px" : "400px";
    }

    // For large screens (1440px-2000px)
    if (windowWidth >= 1440) {
      // Scale width based on screen size
      const baseWidth = !isSidebarOpen ? 450 : 350;
      const extraWidth = Math.floor((windowWidth - 1440) / 100) * 10;
      return `${baseWidth + extraWidth}px`;
    }

    // For medium screens (1024px-1439px)
    return isExpanded ? "350px" : "300px";
  };

  const content = (
    <div
      className={cn(
        "border-l border-border h-full flex flex-col transition-all duration-300 ease-in-out",
        // Only hide by default on mobile, but show when isOpen is true
        isOpen ? "flex" : "hidden lg:flex",
        isMobile ? "bg-[#dbd2c7]" : ""
      )}
      style={{ width: getChatWidth() }}
    >
      {/* Close button - only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-16 border size-8 lg:hidden"
        onClick={() => setIsOpen(false)}
      >
        <X size={20} />
      </Button>

      {/* Chat content */}
      <div className="flex flex-col h-full bg-background">
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

        {!isReadonly && (
          <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full">
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
          </form>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!isMobile ? (
        content
      ) : (
        <div
          className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 ${
            isOpen && isMobile ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {content}
        </div>
      )}
      {isMobile && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-20 rounded-full shadow-lg z-[10000] size-10"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle size={24} />
        </Button>
      )}

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
