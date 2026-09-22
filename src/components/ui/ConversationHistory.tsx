import { useState } from "react";
import { motion } from "motion/react";
import { isSameDay } from "date-fns";
import { Link } from "react-router";
import type { Conversation, MessageItem } from "@/interfaces";
import { staggerContainer } from "@/libs/animationVariants";
import { getDateLabel, getMessageDate } from "@/libs/utils";
import { QUERY_PARAM, useStore } from "@/hooks";
import MarkdownContent from "./MarkdownContent";
import { TypingDots } from "../common/TypingDots";
import ParagraphSkeletonLoader from "../common/ParagraphSkeletonLoader";
import { MessageBubble } from "./conversation/MessageBubble";
import { MessageSeparator } from "./conversation/MessageSeparator";

export interface ConversationHistoryProps {
  conversation: Conversation | null;
  loadingId: string;
  messages: MessageItem[];
  onRetry: () => void;
  onTryAgain: (messageId: string) => void;
  onBranchOut: (messageId: string) => void;
}

export const ConversationHistory = ({
  conversation,
  loadingId,
  messages,
  onRetry,
  onTryAgain,
  onBranchOut,
}: ConversationHistoryProps) => {
  const [activeUserActionsId, setActiveUserActionsId] = useState<string | null>(
    null,
  );

  const { state } = useStore();

  const {
    branchedOutFrom,
    hasError: showRetry,
    errorMessage,
  } = conversation ?? {};

  const branchedFromConversation = !branchedOutFrom
    ? undefined
    : state.conversationsById[branchedOutFrom.conversationId];

  return (
    <motion.div
      key={conversation?.id}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="full-size"
    >
      {messages.map((item, i) => {
        const isFromUser = item.role === "user";
        const isLastMessage = i === messages.length - 1;
        const showLoaders = isLastMessage && conversation?.id === loadingId;
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
              <MessageSeparator>
                <span>{getDateLabel(date)}</span>
              </MessageSeparator>
            )}

            <MessageBubble
              id={item.messageId}
              messageRole={item.role}
              showRetry={isLastMessage && showRetry}
              onRetry={onRetry}
              date={date}
              content={item.content}
              isUserActionsVisible={activeUserActionsId === item.messageId}
              onToggleUserActions={() => {
                if (!item.messageId) return;
                setActiveUserActionsId(
                  activeUserActionsId === item.messageId
                    ? null
                    : item.messageId,
                );
              }}
            >
              {isFromUser ? (
                <p className="text-sm md:text-base">{item.content}</p>
              ) : (
                <>
                  {item.content && (
                    <MarkdownContent
                      content={item.content}
                      onTryAgain={() => {
                        onTryAgain(item.messageId);
                      }}
                      onBranchOut={() => {
                        onBranchOut(item.messageId);
                      }}
                    />
                  )}

                  {showLoaders &&
                    (!item.content ? (
                      <TypingDots />
                    ) : (
                      <ParagraphSkeletonLoader />
                    ))}
                </>
              )}
            </MessageBubble>

            {item.messageId === branchedOutFrom?.messageId && (
              <MessageSeparator>
                <span className="">
                  Branched from&nbsp;
                  {branchedFromConversation ? (
                    <Link
                      className="font-medium underline"
                      to={`/?${QUERY_PARAM.ChatId}=${branchedOutFrom.conversationId}`}
                    >
                      {branchedFromConversation.title}
                    </Link>
                  ) : (
                    <span>a deleted conversation</span>
                  )}
                </span>
              </MessageSeparator>
            )}
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
