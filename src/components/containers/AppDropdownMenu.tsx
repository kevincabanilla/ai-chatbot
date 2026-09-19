import {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/libs/utils";

interface TriggerProps {
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu" | "dialog";
  onClick?: (event: React.MouseEvent) => void;
}

export interface AppDropdownMenuProps {
  trigger:
    | ReactElement<TriggerProps>
    | ((open: boolean) => ReactElement<TriggerProps>);
  children: ReactNode | ((close: () => void) => ReactNode);
  className?: string;
  contentClassName?: string;
  closeOnContentClick?: boolean;
  role?: "menu" | "dialog";
  ariaLabel?: string;
}

export const AppDropdownMenu = ({
  trigger,
  children,
  className,
  contentClassName,
  closeOnContentClick = false,
  role = "dialog",
  ariaLabel,
}: AppDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !contentRef.current) return;

    const triggerRect = containerRef.current?.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    if (!triggerRect) return;

    const gap = 8;
    const hasRoomBelow =
      triggerRect.bottom + gap + contentRect.height <= window.innerHeight;
    setPlacement(hasRoomBelow ? "bottom" : "top");
  }, [open, children]);

  const triggerElement = typeof trigger === "function" ? trigger(open) : trigger;
  if (!isValidElement(triggerElement)) return null;

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {cloneElement(triggerElement, {
        "aria-expanded": open,
        "aria-haspopup": role,
        onClick: (event) => {
          triggerElement.props.onClick?.(event);
          if (!event.defaultPrevented) setOpen((current) => !current);
        },
      })}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            role={role}
            aria-label={ariaLabel}
            initial={{ opacity: 0, scale: 0.96, y: placement === "bottom" ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: placement === "bottom" ? -4 : 4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={cn(
              "absolute right-0 z-50 min-w-56 origin-top-right rounded-lg border border-accent/20 bg-bg-secondary p-3 shadow-xl",
              placement === "bottom"
                ? "top-full mt-2"
                : "bottom-full mb-2 origin-bottom-right",
              contentClassName,
            )}
            onClick={() => {
              if (closeOnContentClick) setOpen(false);
            }}
          >
            {typeof children === "function"
              ? children(() => {
                  setOpen(false);
                })
              : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};