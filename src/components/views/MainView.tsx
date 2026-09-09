import { useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";
import type { ChatMessage } from "@shared/types";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/libs/helper";
import {
  QUERY_PARAM,
  useAppContext,
  useChat,
  useChatStream,
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

  const { sendChatMessage, isMutating: isChatLoading } = useChat();
  const { streamMessage, isMutating: isStreaming } = useChatStream();
  const streamResponse = state.settings.streamResponse ?? false;
  const isLoading = streamResponse ? isStreaming : isChatLoading;

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
      const timestamp = Date.now() + 1;

      appendMessage(
        conversationId,
        {
          role: "assistant",
          content: "",
          conversationId: conversationId,
          timestamp,
        },
        () => {
          scrollToId(timestamp);
        },
      );

      const chatRequest = {
        model: currentConversation?.model ?? state.settings.model ?? undefined,
        skill: currentConversation?.mode ?? state.settings.mode ?? undefined,
        messages: newMessages.map((x) => ({
          content: x.content,
          role: x.role,
        })),
      };

      const updateContent = (newContent: ChatMessage) => {
        updateLastMessage(conversationId, (msg) => ({
          ...msg,
          ...newContent,
          // timestamp: Date.now(), future update
          content: msg.content + newContent.content,
        }));
        scrollToId(timestamp);
      };

      if (streamResponse) {
        await streamMessage(chatRequest, updateContent);
      } else {
        await sendChatMessage(chatRequest, updateContent);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again later.");
      setShowAlert(true);
      updateLastMessage(conversationId, (msg) => ({
        ...msg,
        failed: true,
      }));
    } finally {
      setLoadingId("");
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
        <div className="min-w-0 grow flex flex-col justify-center w-full md:w-2xl xl:w-4xl">
          {hasStarted ? (
            <div className="grow">
              <ConversationHistory
                currentConversationId={currentConversationId}
                loadingId={loadingId}
                isLoading={isLoading}
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
