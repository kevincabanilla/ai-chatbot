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
import { format, isSameDay } from "date-fns";
import { copyToClipboard, getDateLabel, getMessageDate } from "@/libs/utils";
import { CopyButton } from "../buttons/CopyButton";

const ChatItem = ({
  id,
  messageRole,
  content = "",
  failed,
  showRetry,
  children,
  date = null,
  onRetry,
}: {
  id?: string;
  messageRole: ChatRole;
  content?: string;
  failed?: boolean;
  showRetry?: boolean | null;
  children: React.ReactNode;
  date?: Date | null;
  onRetry?: () => void;
}) => {
  const isFromUser = messageRole === "user";

  return (
    <motion.div
      variants={isFromUser ? staggerItemRight : staggerItemLeft}
      id={id}
      className={clsx(
        "w-full my-2 flex",
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

      <motion.div
        className="flex flex-col gap-0.5 min-w-0 w-full max-w-full"
        initial="hide"
        whileHover="hover"
      >
        <div className={clsx("flex", isFromUser && "flex-row-reverse")}>
          <AppCard
            className={clsx(
              "min-h-9.5 md:min-h-10 min-w-0 max-w-full px-4 py-2",
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

          {showRetry && (
            <button
              className="mx-2 cursor-pointer text-sm italic text-rose-500/80  hover:text-rose-500"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </div>

        {isFromUser && (
          <UserActions
            date={date}
            onCopy={() => void copyToClipboard(content)}
          />
        )}
      </motion.div>
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
        const date = getMessageDate(item);
        const previousDate = i > 0 ? getMessageDate(messages[i - 1]) : null;
        const showDateSeparator =
          date && (!previousDate || !isSameDay(date, previousDate));

        return (
          <div
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            key={item.messageId || item.dateCreated || item.timestamp} // to be removed
            className="w-full"
          >
            {showDateSeparator && (
              <div className="my-4 flex items-center gap-3 text-xs text-muted">
                <div className="h-px flex-1 border-t border-accent/25" />
                <span>{getDateLabel(date)}</span>
                <div className="h-px flex-1 border-t border-accent/25" />
              </div>
            )}

            <ChatItem
              id={item.messageId}
              messageRole={item.role}
              showRetry={isLastMessage && showRetry}
              onRetry={onRetry}
              date={date}
              content={item.content}
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
          </div>
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

const UserActions = ({
  date = null,
  onCopy,
}: {
  date?: Date | null;
  onCopy: () => void;
}) => {
  return (
    <motion.div
      className={clsx("flex items-center justify-end")}
      variants={{
        hide: {
          opacity: 0,
          y: -5,
        },
        hover: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.2,
            delay: 0.5,
            ease: "easeOut",
          },
        },
      }}
    >
      <CopyButton onCopyToClipboard={onCopy} />

      {date && (
        <time
          dateTime={date.toISOString()}
          className={clsx(
            // "invisible group-hover:visible",
            "px-1 text-xs text-muted",
          )}
        >
          {format(date, "p")}
        </time>
      )}
    </motion.div>
  );
};
