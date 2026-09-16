import { motion } from "motion/react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { CopyButton } from "@/components/buttons/CopyButton";

export interface UserMessageActionsProps {
  date?: Date | null;
  onCopy: () => void;
}

export const UserMessageActions = ({
  date = null,
  onCopy,
}: UserMessageActionsProps) => {
  return (
    <motion.div
      className={cn("flex items-center justify-end")}
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
          className={cn(
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
