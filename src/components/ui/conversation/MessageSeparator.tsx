import type { ComponentProps, ReactNode } from "react";
import { motion } from "motion/react";
import { staggerItem } from "@/libs/animationVariants";

export interface MessageSeparatorProps extends ComponentProps<
  typeof motion.div
> {
  children: ReactNode;
}

export const MessageSeparator = ({ children }: MessageSeparatorProps) => {
  return (
    <motion.div
      className="my-4 flex items-center gap-3 text-xs text-muted"
      variants={staggerItem}
    >
      <div className="h-px flex-1 border-t border-accent/25" />
      {children}
      <div className="h-px flex-1 border-t border-accent/25" />
    </motion.div>
  );
};
