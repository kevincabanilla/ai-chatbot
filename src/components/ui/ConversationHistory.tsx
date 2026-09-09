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
            "min-w-0 max-w-full px-4 py-2",
            "max-w-lg lg:max-w-xl xl:max-w-3xl rounded-2xl",
            "whitespace-pre-wrap",
            "wrap-anywhere",
            isFromUser ? "rounded-tr-none" : "rounded-tl-none",
            isFromUser && (!failed ? "bg-accent/30" : "bg-rose-500/20"),
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
  messages,
  onRetry,
}: {
  currentConversationId: string | null;
  loadingId: string;
  isLoading: boolean;
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
        const isLastMessage = i === messages.length - 1;
        const isConversationLoading = currentConversationId === loadingId;

        return (
          <ChatItem
            key={item.timestamp}
            id={item.timestamp.toString()}
            messageRole={item.role}
            failed={item.failed && isLastMessage}
            onRetry={onRetry}
          >
            {item.role === "user" ? (
              <p className="text-sm md:text-base">{item.content}</p>
            ) : (
              <>
                {item.content && <MarkdownContent content={item.content} />}

                {isLastMessage &&
                  isConversationLoading &&
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
    </motion.div>
  );
};
