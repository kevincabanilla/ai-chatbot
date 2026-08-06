import { useState } from "react";
import clsx from "clsx";
import useSWRMutation from "swr/mutation";
import type { ChatRequest, ChatResponse } from "@shared/types";
import { sendChat } from "@/api/chatApi";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/libs/helper";
import { useStore, useTypingAnimation } from "@/hooks";
import type { Conversation, MessageItem } from "@/interfaces";
import { PromptTextArea } from "../ui/PromptTextArea";
import { ConversationHistory } from "../ui/ConversationHistory";
import Toast from "../alerts/Toast";
import { AppScrollDownButton } from "../buttons/AppScrollDownButton";

export const MainView = ({
  isMobile,
  openSettings,
}: {
  isMobile: boolean;
  openSettings: () => void;
}) => {
  const { state, setState } = useStore();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingId, setLoadingId] = useState(""); // Used to identify conversations with pending response.
  const [errorMessage, setErrorMessage] = useState("");

  const currentConversation: Conversation | null = !state.currentConversationId
    ? null
    : state.conversationsById[state.currentConversationId];

  const messages = currentConversation?.messages ?? [];

  const hasStarted = messages.length > 0;

  const appendMessage = (
    conversationId: string,
    newMessage: MessageItem,
  ): void => {
    setState((prev) => {
      const currentId = conversationId;
      const currentConversation = !currentId
        ? null
        : prev.conversationsById[currentId];

      // new conversation
      if (!currentConversation) {
        const conversation: Conversation = {
          id: conversationId,
          title: newMessage.content,
          messages: [newMessage],
          model: state.settings.model,
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

      // update existing.
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
    ChatRequest // Argument passed to trigger()
  >("chat", (_, { arg }) => sendChat(arg));

  const sendMessage = async (message: string) => {
    setShowAlert(false);

    // save current to prevent misplacing of new messages.
    const conversationId = state.currentConversationId ?? crypto.randomUUID();

    setLoadingId(conversationId);

    const newMessageItem: MessageItem = {
      content: message,
      role: "user",
      timestamp: Date.now(),
    };

    appendMessage(conversationId, newMessageItem);

    try {
      const reply = await trigger({
        model: currentConversation?.model ?? state.settings.model ?? undefined,
        skill: state.settings.mode ?? undefined,
        messages: [...messages, newMessageItem].map((x) => ({
          content: x.content,
          role: x.role,
        })),
      });

      if (error != null) {
        console.error(error.message);
        return;
      }

      if (reply?.error) {
        setErrorMessage(reply.error);
        setShowAlert(true);
      }

      if (!reply?.message?.content) return;

      appendMessage(conversationId, {
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
          "relative min-h-screen px-3 flex flex-col items-center",
          hasStarted ? "justify-start" : "justify-center",
        )}
      >
        <div className="grow flex flex-col justify-center w-full md:w-2xl">
          {hasStarted ? (
            <div className="grow">
              <ConversationHistory
                isLoading={isLoading}
                loadingId={loadingId}
                messages={messages}
              />
            </div>
          ) : (
            <div className="text-center p-5">
              <Greeting key={state.currentConversationId} />
            </div>
          )}

          <div
            className={clsx(
              hasStarted && "sticky bottom-0 z-1 flex flex-col justify-center",
            )}
          >
            <div
              key={`${state.currentConversationId}-scroll-down-btn`}
              className="absolute inset-x-0 bottom-24 z-5 flex justify-center"
            >
              <AppScrollDownButton />
            </div>

            <PromptTextArea
              key={`${state.currentConversationId}-prompt-field`}
              isMobile={isMobile}
              disabled={isLoading}
              onSubmit={(v) => {
                void sendMessage(v);
              }}
            />

            <div
              className={clsx(
                "px-6 py-1 text-sm flex gap-2",
                hasStarted && "justify-center",
              )}
            >
              <span className="text-white/60">
                {currentConversation?.model ?? state.settings.model}
              </span>
              {!hasStarted && (
                <button
                  className="cursor-pointer hover:text-accent"
                  onClick={openSettings}
                >
                  Change
                </button>
              )}
            </div>
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
