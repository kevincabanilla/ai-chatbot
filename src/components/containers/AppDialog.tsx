import { type HTMLAttributes, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/libs/utils";

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  closeOnOutside?: boolean;
}

export const AppDialog = ({
  open,
  onClose,
  children,
  className,
  closeOnOutside = true,
}: DialogProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-1000 flex items-center justify-center p-6 bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0, pointerEvents: "auto" }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
        >
          {/* Click outside handler */}
          <div
            className="absolute inset-0"
            onClick={() => {
              if (closeOnOutside) onClose();
            }}
          />

          {/* Dialog */}
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className={cn(
              "relative w-full rounded-2xl border border-white/10 bg-zinc-900 shadow-lg shadow-black/20",
              className,
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
