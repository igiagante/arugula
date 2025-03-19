"use client";

import { Button } from "@workspace/ui/components/button";
import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { memo } from "react";

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "What are the best practices",
      label: "for vegetative stage?",
      action:
        "What are the best practices for cannabis plants in vegetative stage?",
      subtitle: "Cannabis plants in vegetative stage",
    },
    {
      title: "How to identify",
      label: "nutrient deficiencies",
      action:
        "How to identify common nutrient deficiencies in cannabis plants?",
      subtitle: "Cannabis plants nutrient deficiencies",
    },
    {
      title: "Tips for optimal",
      label: "humidity and temperature",
      action:
        "What are the optimal humidity and temperature levels for growing cannabis?",
      subtitle: "Cannabis plants growth conditions",
    },
    {
      title: "When should I",
      label: "switch to flowering?",
      action:
        "When is the best time to switch cannabis plants from veg to flowering stage?",
      subtitle: "Cannabis plants flowering stage",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start text-left w-full"
            onClick={async () => {
              window.history.replaceState({}, "", `/chat/${chatId}`);

              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
          >
            <div className="flex flex-col w-full">
              <span className="font-medium mb-1 w-full overflow-hidden text-ellipsis whitespace-normal">
                {suggestedAction.title}{" "}
                <span className="font-normal">{suggestedAction.label}</span>
              </span>
              <span className="text-muted-foreground text-sm w-full overflow-hidden whitespace-normal break-words">
                {suggestedAction.subtitle}
              </span>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
