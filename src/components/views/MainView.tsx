import clsx from "clsx";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/utils";
import { useTypingAnimation } from "@/hooks";
import { PromptTextArea } from "../ui/PromptTextArea";
import { useState } from "react";
import { ConversationHistory } from "../ui/ConversationHistory";
import type { MessageItem } from "@/models";

export const MainView = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const hasStarted = messages.length > 0;

  return (
    <main>
      <div
        className={clsx(
          "relative min-h-screen p-6 flex justify-center",
          hasStarted ? "items-start" : "items-center",
        )}
      >
        <div className="w-full md:w-2xl">
          {hasStarted ? (
            <div className="h-full pb-14">
              <ConversationHistory messages={messages} />
            </div>
          ) : (
            <div className="text-center p-5">
              <h1 className="text-lg md:text-3xl">{greeting}</h1>
            </div>
          )}

          <div
            className={clsx(
              hasStarted
                ? "fixed inset-x-0 bottom-0 z-1 flex justify-center p-6"
                : "",
            )}
          >
            <PromptTextArea
              onSubmit={(v) => {
                setMessages([
                  ...messages,
                  {
                    content: v,
                    source: messages.length % 2 !== 0 ? "AI" : "User",
                    timestamp: Date.now(),
                  },
                ]);
              }}
            />
          </div>
          <div className="fixed inset-x-0 bottom-0 bg-bg-primary h-14 flex justify-center align-bottom" />
        </div>
      </div>
    </main>
  );
};
