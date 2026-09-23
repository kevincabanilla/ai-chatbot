import { motion } from "motion/react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { CopyButton } from "@/components/buttons/CopyButton";

export interface UserMessageActionsProps {
  date?: Date | null;
  isTouchDevice?: boolean;
  onCopy: () => void;
}

export const UserMessageActions = ({
  date = null,
  isTouchDevice = false,
  onCopy,
}: UserMessageActionsProps) => {
  return (
    <motion.div
      className={cn("flex items-center justify-end")}
      initial={false}
      variants={{
        hide: {
          opacity: 0,
          y: -5,
          height: 0,
          pointerEvents: "none",
        },
        hover: {
          opacity: 1,
          y: 0,
          height: "auto",
          pointerEvents: "auto",
          transition: {
            duration: 0.2,
            delay: isTouchDevice ? 0 : 0.6,
            ease: "easeOut",
          },
        },
      }}
    >
      <CopyButton onCopyToClipboard={onCopy} />

      {date && (
        <time
          dateTime={date.toISOString()}
          className={cn("px-1 text-xs text-muted")}
        >
          {format(date, "p")}
        </time>
      )}
    </motion.div>
  );
};
