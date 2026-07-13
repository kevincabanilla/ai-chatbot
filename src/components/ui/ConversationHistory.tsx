import { useEffect } from "react";
import clsx from "clsx";
import type { MessageItem, MessageRole } from "@/models";
import { AppCard } from "../containers/AppCard";
import { Bot } from "lucide-react";

const ChatItem = ({
  messageRole,
  children,
}: {
  messageRole: MessageRole;
  children: React.ReactNode;
}) => {
  const isFromUser = messageRole === "user";

  return (
    <div className={clsx("w-full flex", isFromUser ? "flex-row-reverse" : "")}>
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
          "px-4 py-2 mb-6",
          "max-w-lg rounded-2xl",
          "whitespace-pre-wrap",
          "wrap-anywhere"
        )}
      >
        <p>{children}</p>
      </AppCard>
    </div>
  );
};

export const ConversationHistory = ({
  messages,
}: {
  messages: MessageItem[];
}) => {
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="full-size">
      {messages
        .filter((x) => x.visible)
        .map((item) => (
          <ChatItem key={item.timestamp} messageRole={item.role}>
            {item.content}
          </ChatItem>
        ))}
    </div>
  );
};
