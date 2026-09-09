import clsx from "clsx";
import { Bot } from "lucide-react";
import type { ChatRole } from "@shared/types";
import { AppCard } from "../containers/AppCard";
import type { MessageItem } from "@/interfaces";
import { motion } from "motion/react";
import {
  staggerContainer,
  staggerItemLeft,
  staggerItemRight,
} from "@/libs/animationVariants";
import MarkdownContent from "./MarkdownContent";
import { TypingDots } from "../common/TypingDots";
import ParagraphSkeletonLoader from "../common/ParagraphSkeletonLoader";

const ChatItem = ({
  id,
  messageRole,
  failed,
  showRetry,
  children,
  onRetry,
}: {
  id?: string;
  messageRole: ChatRole;
  failed?: boolean;
  showRetry?: boolean | null;
  children: React.ReactNode;
  onRetry?: () => void;
}) => {
  const isFromUser = messageRole === "user";

  return (
    <motion.div
      variants={isFromUser ? staggerItemRight : staggerItemLeft}
      id={id}
      className={clsx(
        "w-full my-3 flex",
        isFromUser ? "pl-6 flex-row-reverse" : "pr-6",
      )}
    >
      {!isFromUser && (
        <div className="hidden md:block pr-2.5">
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

      <div className="flex min-w-0 max-w-full gap-2">
        {isFromUser && showRetry && (
          <button
            className="cursor-pointer text-sm italic text-rose-500/80  hover:text-rose-500"
            onClick={onRetry}
          >
            Retry
          </button>
        )}

        <AppCard
          className={clsx(
            "min-w-0 max-w-full px-4 py-2",
            "max-w-lg lg:max-w-xl xl:max-w-3xl rounded-2xl",
            "whitespace-pre-wrap wrap-anywhere",
            "transition-colors",
            isFromUser ? "rounded-tr-none" : "rounded-tl-none",
            !failed && !showRetry
              ? isFromUser && "bg-accent/30"
              : "bg-rose-500/20",
          )}
        >
          {children}
        </AppCard>
      </div>
    </motion.div>
  );
};

export const ConversationHistory = ({
  currentConversationId,
  loadingId,
  showRetry,
  errorMessage,
  messages,
  onRetry,
}: {
  currentConversationId: string | null;
  loadingId: string;
  showRetry?: boolean | null;
  errorMessage?: string | null;
  messages: MessageItem[];
  onRetry: () => void;
}) => {
  return (
    <motion.div
      key={currentConversationId}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="full-size"
    >
      {messages.map((item, i) => {
        const isFromUser = item.role === "user";
        const isLastMessage = i === messages.length - 1;
        const showLoaders = isLastMessage && currentConversationId == loadingId;

        return (
          <ChatItem
            key={item.messageId || item.timestamp}
            id={item.messageId}
            messageRole={item.role}
            showRetry={isLastMessage && isFromUser && showRetry}
            onRetry={onRetry}
          >
            {isFromUser ? (
              <p className="text-sm md:text-base">{item.content}</p>
            ) : (
              <>
                {item.content && <MarkdownContent content={item.content} />}

                {showLoaders &&
                  (!item.content ? (
                    <TypingDots />
                  ) : (
                    <ParagraphSkeletonLoader />
                  ))}
              </>
            )}
          </ChatItem>
        );
      })}

      {showRetry && errorMessage && (
        <ChatItem messageRole="system" failed>
          <span className="text-sm md:text-base">{errorMessage}</span>
        </ChatItem>
      )}
    </motion.div>
  );
};
