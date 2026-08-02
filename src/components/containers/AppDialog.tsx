import { type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";

const dialogVariants = cva(
  "relative w-full rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface DialogProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof dialogVariants> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOutside?: boolean;
}

export const AppDialog = ({
  open,
  onClose,
  children,
  className,
  size,
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
          className="fixed inset-0 z-1000 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className={cn(dialogVariants({ size }), className)}
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
