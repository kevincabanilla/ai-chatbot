import type { MessageItem } from "@/interfaces";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@/libs/animationVariants";
import MarkdownContent from "./MarkdownContent";
import { TypingDots } from "../common/TypingDots";
import ParagraphSkeletonLoader from "../common/ParagraphSkeletonLoader";
import { isSameDay } from "date-fns";
import { getDateLabel, getMessageDate } from "@/libs/utils";
import { MessageBubble } from "./conversation/MessageBubble";

export interface ConversationHistoryProps {
  currentConversationId: string | null;
  loadingId: string;
  showRetry?: boolean | null;
  errorMessage?: string | null;
  messages: MessageItem[];
  onRetry: () => void;
}

export const ConversationHistory = ({
  currentConversationId,
  loadingId,
  showRetry,
  errorMessage,
  messages,
  onRetry,
}: ConversationHistoryProps) => {
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
              <motion.div
                className="my-4 flex items-center gap-3 text-xs text-muted"
                variants={staggerItem}
              >
                <div className="h-px flex-1 border-t border-accent/25" />
                <span>{getDateLabel(date)}</span>
                <div className="h-px flex-1 border-t border-accent/25" />
              </motion.div>
            )}

            <MessageBubble
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
            </MessageBubble>
          </div>
        );
      })}

      {showRetry && errorMessage && (
        <MessageBubble messageRole="system" failed>
          <span className="text-sm md:text-base">{errorMessage}</span>
        </MessageBubble>
      )}
    </motion.div>
  );
};
