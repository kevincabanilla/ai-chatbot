import { useState } from "react";
import clsx from "clsx";
import useSWRMutation from "swr/mutation";
import type { ChatMessage, ChatResponse } from "@/shared/types";
import { sendChat } from "@/api/chatApi";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/utils";
import { useTypingAnimation } from "@/hooks";
import { PromptTextArea } from "../ui/PromptTextArea";
import {
  ConversationHistory,
  type MessageItem,
} from "../ui/ConversationHistory";

export const MainView = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));

  const [messages, setMessages] = useState<MessageItem[]>([]);

  const hasStarted = messages.length > 0;

  const {
    trigger,
    isMutating: isLoading,
    error,
  } = useSWRMutation<
    ChatResponse | null, // Response type
    Error, // Error type
    string, // SWR key type
    ChatMessage[] // Argument passed to trigger()
  >("chat", (_, { arg }) => sendChat(arg));

  const sendMessage = async (message: string) => {
    const updatedMessages: MessageItem[] = [
      ...messages,
      {
        content: message,
        role: "user",
        timestamp: Date.now(),
      },
    ];

    setMessages(updatedMessages);

    const reply = await trigger(
      updatedMessages.map((x) => ({ content: x.content, role: x.role })),
    );

    if (error != null) {
      console.error(error.message);
      return;
    }

    if (!reply?.message?.content) return;

    updatedMessages.push({
      ...reply.message,
      timestamp: Date.now(),
    });

    setMessages([...updatedMessages]);
  };

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
              <ConversationHistory isLoading={isLoading} messages={messages} />
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
              disabled={isLoading}
              onSubmit={(v) => {
                void sendMessage(v);
              }}
            />
          </div>
          <div className="fixed inset-x-0 bottom-0 bg-bg-primary h-14 flex justify-center align-bottom" />
        </div>
      </div>
    </main>
  );
};
