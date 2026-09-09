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

const StreamingSkeleton = () => {
  const lines = ["w-full", "w-[85%]"];

  return (
    <motion.div
      aria-label="Streaming response"
      initial={{ opacity: 0.55 }}
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="mt-2 flex w-full flex-col gap-2.5"
    >
      {lines.map((width, index) => (
        <div
          key={`${width}-${index}`}
          className={clsx(
            "relative h-3.5 overflow-hidden rounded-full border border-white/10 bg-linear-to-r from-slate-700/70 via-slate-600/90 to-slate-700/70",
            width,
          )}
        >
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/18 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        </div>
      ))}
    </motion.div>
  );
};

export const ConversationHistory = ({
  currentConversationId,
  loadingId,
  isLoading,
  isStreaming,
  messages,
  onRetry,
}: {
  currentConversationId: string | null;
  loadingId: string;
  isLoading: boolean;
  isStreaming: boolean;
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
                <MarkdownContent content={item.content} />
                {isStreaming && isLastMessage && <StreamingSkeleton />}
              </>
            )}
          </ChatItem>
        );
      })}

      {isLoading && (!loadingId || currentConversationId === loadingId) && (
        <ChatItem messageRole="system">
          <TypingDots />
        </ChatItem>
      )}
    </motion.div>
  );
};
