import { motion } from "motion/react";
import { Bot } from "lucide-react";
import type { ChatRole } from "@shared/types";
import { cn, copyToClipboard } from "@/libs/utils";
import { staggerItem } from "@/libs/animationVariants";
import { AppCard } from "@/components/containers/AppCard";
import { useMediaQuery } from "@/hooks";
import { UserMessageActions } from "./UserMessageActions";

export interface MessageBubbleProps {
  id?: string;
  messageRole: ChatRole;
  content?: string;
  failed?: boolean;
  showRetry?: boolean | null;
  children: React.ReactNode;
  date?: Date | null;
  onRetry?: () => void;
  isUserActionsVisible?: boolean;
  onToggleUserActions?: () => void;
}

export const MessageBubble = ({
  id,
  messageRole,
  content = "",
  failed,
  showRetry,
  children,
  date = null,
  onRetry,
  isUserActionsVisible = false,
  onToggleUserActions,
}: MessageBubbleProps) => {
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const isFromUser = messageRole === "user";

  return (
    <motion.div
      variants={staggerItem}
      id={id}
      className={cn(
        "w-full my-2 flex",
        isFromUser ? "pl-6 flex-row-reverse" : "pr-6",
      )}
    >
      {!isFromUser && (
        <div className="hidden md:block pr-2.5">
          <div
            className={cn(
              "w-7 md:w-10.5",
              "h-7 md:h-10.5",
              "p-1 md:p-2",
              "flex justify-center items-center",
              "rounded-full border border-accent/60 ",
            )}
          >
            <Bot className="full-size" aria-hidden="true" />
          </div>
        </div>
      )}

      <motion.div
        className="flex flex-col gap-0.5 min-w-0 w-full max-w-full"
        initial="hide"
        animate={isTouchDevice && isUserActionsVisible ? "hover" : "hide"}
        whileHover="hover"
      >
        <div className={cn("flex", isFromUser && "flex-row-reverse")}>
          <AppCard
            className={cn(
              "min-h-9.5 md:min-h-10 min-w-0 max-w-full px-4 py-2",
              "max-w-lg lg:max-w-xl xl:max-w-3xl rounded-2xl",
              "whitespace-pre-wrap wrap-anywhere",
              "transition-colors",
              isFromUser ? "rounded-tr-none" : "rounded-tl-none",
              !failed && !showRetry
                ? isFromUser && "bg-accent/30"
                : "bg-rose-500/20",
            )}
            onPointerDown={(event) => {
              if (event.pointerType === "touch") onToggleUserActions?.();
            }}
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
          <UserMessageActions
            date={date}
            onCopy={() => void copyToClipboard(content)}
            isTouchDevice={isTouchDevice}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
