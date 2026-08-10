import clsx from "clsx";
import { Bot } from "lucide-react";
import type { ChatRole } from "@shared/types";
import { AppCard } from "../containers/AppCard";
import type { MessageItem } from "@/interfaces";
import { useStore } from "@/hooks";

const ChatItem = ({
  id,
  messageRole,
  failed,
  children,
  onRetry,
}: {
  id?: string;
  messageRole: ChatRole;
  failed?: boolean | null;
  children: React.ReactNode;
  onRetry?: () => void;
}) => {
  const isFromUser = messageRole === "user";

  return (
    <div
      id={id}
      className={clsx(
        "w-full my-3 flex",
        isFromUser ? "pl-6 flex-row-reverse" : "pr-6",
      )}
    >
      {!isFromUser && (
        <div className="pr-2.5">
          <div
            className={clsx(
              "w-7 md:w-10.5",
              "h-7 md:h-10.5",
              "p-1 md:p-2",
              "flex justify-center items-center",
              "rounded-full border border-accent/60 ",
            )}
          >
            <Bot className="full-size" />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {isFromUser && failed && (
          <button
            className="cursor-pointer text-sm italic text-rose-500/80  hover:text-rose-500"
            onClick={onRetry}
          >
            Retry
          </button>
        )}

        <AppCard
          className={clsx(
            "px-4 py-2",
            "max-w-lg rounded-2xl",
            "whitespace-pre-wrap",
            "wrap-anywhere",
            isFromUser ? "rounded-tr-none" : "rounded-tl-none",
            isFromUser && (!failed ? "bg-accent/30" : "bg-rose-500/20"),
          )}
        >
          {children}
        </AppCard>
      </div>
    </div>
  );
};

const TypingDots = () => {
  return (
    <div className="flex gap-2 p-2.5">
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className="size-2 rounded-full bg-cyan-500 animate-bounce"
          style={{
            animationDelay: `${dot * 200}ms`,
            animationDuration: "700ms",
          }}
        />
      ))}
    </div>
  );
};

export const ConversationHistory = ({
  isLoading,
  loadingId,
  messages,
  onRetry,
}: {
  isLoading: boolean;
  loadingId: string;
  messages: MessageItem[];
  onRetry: () => void;
}) => {
  const { state } = useStore();

  return (
    <div className="full-size">
      {messages.map((item, i) => (
        <ChatItem
          key={item.timestamp}
          id={item.timestamp.toString()}
          messageRole={item.role}
          failed={item.failed && i == messages.length - 1}
          onRetry={onRetry}
        >
          <p className="text-sm md:text-base">{item.content}</p>
        </ChatItem>
      ))}

      {isLoading &&
        (!loadingId || state.currentConversationId === loadingId) && (
          <ChatItem messageRole="system">
            <TypingDots />
          </ChatItem>
        )}
    </div>
  );
};
