import { useEffect } from "react";
import clsx from "clsx";
import { Bot } from "lucide-react";
import type { ChatRole } from "@/shared/types";
import { AppCard } from "../containers/AppCard";
import { Helper } from "@/utils";

export interface MessageItem {
  role: ChatRole;
  content: string;
  timestamp: number;
}

const ChatItem = ({
  id,
  messageRole,
  children,
}: {
  id?: string;
  messageRole: ChatRole;
  children: React.ReactNode;
}) => {
  const isFromUser = messageRole === "user";

  return (
    <div
      id={id}
      className={clsx("w-full my-3 flex", isFromUser ? "flex-row-reverse" : "")}
    >
      {!isFromUser && (
        <div className="pr-3">
          <div
            className={clsx(
              "h-10.5 w-10.5 p-2",
              "flex justify-center items-center",
              "rounded-full border border-accent/60 ",
            )}
          >
            <Bot className="full-size" />
          </div>
        </div>
      )}
      <AppCard
        className={clsx(
          "px-4 py-2",
          "max-w-lg rounded-2xl",
          "whitespace-pre-wrap",
          "wrap-anywhere",
        )}
      >
        <p>{children}</p>
      </AppCard>
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
  messages,
}: {
  isLoading: boolean;
  messages: MessageItem[];
}) => {
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (!lastMessage) return;
    Helper.scrollToId(lastMessage.timestamp);
  }, [messages]);

  return (
    <div className="full-size">
      {messages.map((item) => (
        <ChatItem
          key={item.timestamp}
          id={item.timestamp.toString()}
          messageRole={item.role}
        >
          {item.content}
        </ChatItem>
      ))}

      {isLoading && (
        <ChatItem messageRole="system">
          <TypingDots />
        </ChatItem>
      )}
    </div>
  );
};
