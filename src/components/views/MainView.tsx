import { useState } from "react";
import clsx from "clsx";
import useSWRMutation from "swr/mutation";
import type { ChatMessage, ChatResponse } from "@/shared/types";
import { sendChat } from "@/api/chatApi";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/libs/helper";
import { useStore, useTypingAnimation } from "@/hooks";
import type { Conversation, MessageItem } from "@/interfaces";
import { PromptTextArea } from "../ui/PromptTextArea";
import { ConversationHistory } from "../ui/ConversationHistory";
import Toast from "../alerts/Toast";

export const MainView = ({ isMobile }: { isMobile: boolean }) => {
  const { state, setState } = useStore();
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const messages = !state.currentConversationId
    ? []
    : state.conversationsById[state.currentConversationId].messages;

  const hasStarted = messages.length > 0;

  const appendMessage = (newMessage: MessageItem): void => {
    setState((prev) => {
      const currentId = prev.currentConversationId;
      const currentConversation = !currentId
        ? null
        : prev.conversationsById[currentId];

      if (!currentConversation) {
        const conversation: Conversation = {
          id: crypto.randomUUID(),
          title: newMessage.content,
          messages: [newMessage],
        };

        return {
          ...prev,
          conversationsById: {
            ...prev.conversationsById,
            [conversation.id]: conversation,
          },
          conversationOrder: [conversation.id, ...prev.conversationOrder],
          currentConversationId: conversation.id,
        };
      }

      return {
        ...prev,
        conversationsById: {
          ...prev.conversationsById,
          [currentConversation.id]: {
            ...currentConversation,
            messages: [...currentConversation.messages, newMessage],
          },
        },
      };
    });

    requestAnimationFrame(() => {
      Helper.scrollToId(newMessage.timestamp);
    });
  };

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
    setShowAlert(false);

    const newMessageItem: MessageItem = {
      content: message,
      role: "user",
      timestamp: Date.now(),
    };

    appendMessage(newMessageItem);

    try {
      const reply = await trigger(
        [...messages, newMessageItem].map((x) => ({
          content: x.content,
          role: x.role,
        })),
      );

      if (error != null) {
        console.error(error.message);
        return;
      }

      if (reply?.error) {
        setErrorMessage(reply.error);
        setShowAlert(true);
      }

      if (!reply?.message?.content) return;

      appendMessage({
        ...reply.message,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <div
        className={clsx(
          "relative min-h-screen px-3 flex justify-center",
          hasStarted ? "items-start" : "items-center",
        )}
      >
        <div className="w-full md:w-2xl">
          {hasStarted ? (
            <div className="h-full">
              <ConversationHistory isLoading={isLoading} messages={messages} />
            </div>
          ) : (
            <div className="text-center p-5">
              <Greeting key={state.currentConversationId} />
            </div>
          )}

          <div
            className={clsx(
              hasStarted ? "sticky bottom-0 z-1 flex justify-center pb-6" : "",
            )}
          >
            <PromptTextArea
              key={state.currentConversationId}
              isMobile={isMobile}
              disabled={isLoading}
              onSubmit={(v) => {
                void sendMessage(v);
              }}
            />
          </div>
          <div className="fixed inset-x-0 bottom-0 bg-bg-primary/90 backdrop-blur-xs h-14 flex justify-center align-bottom" />
        </div>
      </div>

      <Toast
        visible={showAlert}
        type="error"
        vertical="end"
        onClose={() => {
          setShowAlert(false);
        }}
      >
        {errorMessage}
      </Toast>
    </main>
  );
};

const Greeting = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));
  return <h1 className="text-lg md:text-3xl">{greeting}</h1>;
};
