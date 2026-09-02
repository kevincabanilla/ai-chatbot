import { useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";
import useSWRMutation from "swr/mutation";
import type { ChatRequest, ChatResponse } from "@shared/types";
import { sendChat } from "@/api/chatApi";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/libs/helper";
import {
  QUERY_PARAM,
  useAppContext,
  useGetQueryParam,
  useStateManager,
  useTypingAnimation,
} from "@/hooks";
import type { Conversation, MessageItem } from "@/interfaces";
import { PromptTextArea } from "../ui/PromptTextArea";
import { ConversationHistory } from "../ui/ConversationHistory";
import Toast from "../alerts/Toast";
import { AppScrollDownButton } from "../buttons/AppScrollDownButton";

export default function MainView() {
  const navigate = useNavigate();
  const currentConversationId = useGetQueryParam("c");
  const { isMobile, openSettings } = useAppContext();
  const { state, appendMessage, updateLastMessage } = useStateManager();

  const [showAlert, setShowAlert] = useState(false);
  const [loadingId, setLoadingId] = useState(""); // Used to identify conversations with pending response.
  const [errorMessage, setErrorMessage] = useState("");

  const currentConversation: Conversation | null = !currentConversationId
    ? null
    : state.conversationsById[currentConversationId];

  const messages = currentConversation?.messages ?? [];

  const hasStarted = messages.length > 0;

  const scrollToId = (id: string | number) => {
    requestAnimationFrame(() => {
      Helper.scrollToId(id);
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

  const sendMessage = async (message?: string) => {
    setShowAlert(false);

    // save current to prevent misplacing of new messages.
    let conversationId = currentConversationId ?? "";

    if (!currentConversation) {
      conversationId = crypto.randomUUID();
      await navigate({
        pathname: "/",
        search: `?${QUERY_PARAM.ChatId}=${conversationId}`,
      });
    }

    setLoadingId(conversationId);

    const newMessages = [...messages];

    if (!message) {
      // retry is clicked.
      // reset the last message failed flag to false.
      updateLastMessage(conversationId, (msg) => {
        scrollToId(msg.timestamp);
        return {
          ...msg,
          failed: false,
        };
      });
    } else {
      const newMessageItem: MessageItem = {
        conversationId: conversationId,
        content: message,
        role: "user",
        timestamp: Date.now(),
      };

      appendMessage(conversationId, newMessageItem, () => {
        scrollToId(newMessageItem.timestamp);
      });
      newMessages.push(newMessageItem);
    }

    try {
      const reply = await trigger({
        model: currentConversation?.model ?? state.settings.model ?? undefined,
        skill: currentConversation?.mode ?? state.settings.mode ?? undefined,
        messages: newMessages.map((x) => ({
          content: x.content,
          role: x.role,
        })),
      });

      if (error != null) {
        console.error(error.message);
        setErrorMessage("Something went wrong. Please try again later.");
        setShowAlert(true);
        return;
      }

      if (reply?.error) {
        // display error message
        setErrorMessage(reply.error);
        setShowAlert(true);

        // set the last message to failed
        // this will display Retry button to allow retry.
        updateLastMessage(conversationId, (msg) => {
          return {
            ...msg,
            failed: true,
          };
        });
      }

      if (!reply?.message?.content) return;

      const timestamp = Date.now();

      appendMessage(
        conversationId,
        {
          ...reply.message,
          conversationId: conversationId,
          timestamp,
        },
        () => {
          scrollToId(timestamp);
        },
      );
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
        <div className="grow flex flex-col justify-center w-full md:w-2xl xl:w-4xl">
          {hasStarted ? (
            <div className="grow">
              <ConversationHistory
                currentConversationId={currentConversationId}
                isLoading={isLoading}
                loadingId={loadingId}
                messages={messages}
                onRetry={() => {
                  void sendMessage();
                }}
              />
            </div>
          ) : (
            <div className="text-center p-5">
              <Greeting key={currentConversationId} />
            </div>
          )}

          <div
            className={clsx(
              hasStarted && "sticky bottom-0 z-1 flex flex-col justify-center",
            )}
          >
            <AppScrollDownButton
              key={`${currentConversationId}-scroll-down-btn`}
            />

            <PromptTextArea
              key={`${currentConversationId}-prompt-field`}
              isMobile={isMobile}
              disabled={isLoading}
              onSubmit={(v) => {
                void sendMessage(v);
              }}
            />

            <div
              className={clsx("px-6 py-1 text-sm flex gap-2 justify-center")}
            >
              <span className="text-white/60">
                {`${currentConversation?.mode ?? state.settings.mode} - ${currentConversation?.model ?? state.settings.model}`}
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
}

const Greeting = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));
  return <h1 className="text-lg md:text-3xl">{greeting}</h1>;
};
