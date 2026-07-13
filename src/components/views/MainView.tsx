import clsx from "clsx";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/utils";
import { useTypingAnimation } from "@/hooks";
import { PromptTextArea } from "../ui/PromptTextArea";
import { useState } from "react";
import { ConversationHistory } from "../ui/ConversationHistory";
import type { ChatCompletionMessage, MessageItem } from "@/models";
import useSWRMutation from "swr/mutation";
import { chatCompletion } from "@/api/chatApi";

const currentTimestamp = Date.now();

export const MainView = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      role: "system",
      content: "You are a helpful assistant.",
      timestamp: currentTimestamp,
      visible: false,
    },
  ]);

  const hasStarted = messages.length > 1;

  const {
    trigger,
    isMutating: isLoading,
    error,
  } = useSWRMutation<
    ChatCompletionMessage[], // Response type
    Error, // Error type
    string, // SWR key type
    ChatCompletionMessage[] // Argument passed to trigger()
  >("chat", (_, { arg }) => chatCompletion(arg));

  async function sendMessage(message: string) {
    const updatedMessages: MessageItem[] = [
      ...messages,
      {
        visible: true,
        content: message,
        role: "user",
        timestamp: Date.now(),
      },
    ];

    setMessages(updatedMessages);

    const replies = await trigger(
      updatedMessages.map((x) => ({
        content: x.content,
        role: x.role,
      })),
    );

    if (replies.length === 0) return;

    const reply = replies[0];

    setMessages([
      ...updatedMessages,
      {
        ...reply,
        visible: true,
        timestamp: Date.now(),
      },
    ]);

    if (error != null) {
      console.log(error.message);
    }
  }

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
