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

type DropdownPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

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
  placement?: DropdownPlacement;
}

export const AppDropdownMenu = ({
  trigger,
  children,
  className,
  contentClassName,
  closeOnContentClick = false,
  role = "dialog",
  ariaLabel,
  placement = "bottom-right",
}: AppDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    placement: "bottom" as "bottom" | "top",
    horizontalPlacement: "right" as "left" | "right",
    left: 0,
    maxHeight: 0,
  });
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

    const updatePosition = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();
      if (!containerRect || !contentRect) return;

      const gap = 8;
      const viewportPadding = 8;
      const spaceBelow = window.innerHeight - containerRect.bottom - gap;
      const spaceAbove = containerRect.top - gap;
      const fitsBelow = contentRect.height <= spaceBelow;
      const fitsAbove = contentRect.height <= spaceAbove;
      const requestedVerticalPlacement = placement.startsWith("top")
        ? "top"
        : "bottom";
      const verticalPlacement =
        requestedVerticalPlacement === "bottom"
          ? fitsBelow
            ? "bottom"
            : fitsAbove
              ? "top"
              : spaceBelow >= spaceAbove
                ? "bottom"
                : "top"
          : fitsAbove
            ? "top"
            : fitsBelow
              ? "bottom"
              : spaceAbove >= spaceBelow
                ? "top"
                : "bottom";
      const availableHeight =
        verticalPlacement === "bottom" ? spaceBelow : spaceAbove;
      const minLeft = viewportPadding;
      const maxViewportLeft = window.innerWidth - contentRect.width - viewportPadding;
      const requestedHorizontalPlacement = placement.includes("left")
        ? "left"
        : "right";
      const leftPosition = containerRect.left;
      const rightPosition = containerRect.right - contentRect.width;
      const leftFits =
        leftPosition >= minLeft && leftPosition <= maxViewportLeft;
      const rightFits =
        rightPosition >= minLeft && rightPosition <= maxViewportLeft;
      const horizontalPlacement =
        requestedHorizontalPlacement === "left"
          ? leftFits
            ? "left"
            : rightFits
              ? "right"
              : "left"
          : rightFits
            ? "right"
            : leftFits
              ? "left"
              : "right";
      const desiredLeft =
        horizontalPlacement === "left" ? leftPosition : rightPosition;
      const viewportLeft = Math.min(
        Math.max(desiredLeft, minLeft),
        Math.max(minLeft, maxViewportLeft),
      );

      setPosition({
        placement: verticalPlacement,
        horizontalPlacement,
        left: viewportLeft - containerRect.left,
        maxHeight: Math.max(0, availableHeight),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, children, placement]);

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
            initial={{ opacity: 0, scale: 0.96, y: position.placement === "bottom" ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: position.placement === "bottom" ? -4 : 4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{
              left: position.left,
              maxHeight: position.maxHeight || undefined,
              maxWidth: "calc(100vw - 16px)",
              transformOrigin: `${position.horizontalPlacement} ${position.placement === "bottom" ? "top" : "bottom"}`,
            }}
            className={cn(
              "absolute z-50 min-w-56 max-w-[calc(100vw-16px)] overflow-y-auto rounded-lg border border-accent/20 bg-bg-secondary p-3 shadow-xl",
              position.placement === "bottom"
                ? "top-full mt-2"
                : "bottom-full mb-2 ",
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