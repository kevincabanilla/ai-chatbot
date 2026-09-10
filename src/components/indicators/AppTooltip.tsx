import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  type TouchEvent,
  useCallback,
} from "react";
import { cn } from "@/libs/utils";
import { AnimatePresence, motion } from "motion/react";

const OFFSET_INITIAL = 5;
const OFFSET_FINAL = 0;

const INITIAL_VARIANT = {
  scale: 0.95,
  opacity: 0,
} as const;

const ANIMATE_VARIANT = {
  scale: 1,
  opacity: 1,
} as const;

const motionVariants = {
  top: {
    initial: { ...INITIAL_VARIANT, y: OFFSET_INITIAL },
    animate: { ...ANIMATE_VARIANT, y: OFFSET_FINAL },
    exit: { ...INITIAL_VARIANT, y: OFFSET_INITIAL },
  },
  bottom: {
    initial: { ...INITIAL_VARIANT, y: -OFFSET_INITIAL },
    animate: { ...ANIMATE_VARIANT, y: OFFSET_FINAL },
    exit: { ...INITIAL_VARIANT, y: -OFFSET_INITIAL },
  },
  left: {
    initial: { ...INITIAL_VARIANT, x: OFFSET_INITIAL },
    animate: { ...ANIMATE_VARIANT, x: OFFSET_FINAL },
    exit: { ...INITIAL_VARIANT, x: OFFSET_INITIAL },
  },
  right: {
    initial: { ...INITIAL_VARIANT, x: -OFFSET_INITIAL },
    animate: { ...ANIMATE_VARIANT, x: OFFSET_FINAL },
    exit: { ...INITIAL_VARIANT, x: -OFFSET_INITIAL },
  },
} as const;

export type TooltipPlacement =
  | "top"
  // | "top-start"
  // | "top-end"
  | "right"
  // | "right-start"
  // | "right-end"
  | "bottom"
  // | "bottom-start"
  // | "bottom-end"
  | "left";
// | "left-start"
// | "left-end";

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  // "top-start": "bottom-full left-0 mb-2",
  // "top-end": "bottom-full right-0 mb-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  // "right-start": "left-full top-0 ml-2",
  // "right-end": "left-full bottom-0 ml-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  // "bottom-start": "top-full left-0 mt-2",
  // "bottom-end": "top-full right-0 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  // "left-start": "right-full top-0 mr-2",
  // "left-end": "right-full bottom-0 mr-2",
};

const arrowStyles: Record<TooltipPlacement, string> = {
  top: "-bottom-1 left-1/2 -translate-x-1/2 border-r border-b",
  // "top-start": "-bottom-1 left-3 border-r border-b",
  // "top-end": "-bottom-1 right-3 border-r border-b",
  right: "-left-1 top-1/2 -translate-y-1/2 border-b border-l",
  // "right-start": "-left-1 top-3 border-b border-l",
  // "right-end": "-left-1 bottom-3 border-b border-l",
  bottom: "-top-1 left-1/2 -translate-x-1/2 border-t border-l",
  // "bottom-start": "-top-1 left-3 border-t border-l",
  // "bottom-end": "-top-1 right-3 border-t border-l",
  left: "-right-1 top-1/2 -translate-y-1/2 border-t border-r",
  // "left-start": "-right-1 top-3 border-t border-r",
  // "left-end": "-right-1 bottom-3 border-t border-r",
};

export interface AppTooltipProps {
  title: ReactNode;
  children: ReactElement<TooltipChildProps>;
  placement?: TooltipPlacement;
  arrow?: boolean;
  enterDelay?: number;
  exitDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  disableHoverListener?: boolean;
  disableFocusListener?: boolean;
  disableTouchListener?: boolean;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

interface TooltipChildProps {
  "aria-describedby"?: string;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
}

export const AppTooltip = ({
  title,
  children,
  placement = "top",
  arrow = false,
  enterDelay = 100,
  exitDelay = 0,
  open: controlledOpen,
  defaultOpen = false,
  disabled = false,
  disableHoverListener = false,
  disableFocusListener = false,
  disableTouchListener = false,
  className,
  onOpen,
  onClose,
}: AppTooltipProps) => {
  const tooltipId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  const setTooltipOpen = useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (nextOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [controlledOpen, onClose, onOpen],
  );

  const showTooltip = useCallback(() => {
    setTooltipOpen(true);
  }, [setTooltipOpen]);

  const hideTooltip = useCallback(() => {
    setTooltipOpen(false);
  }, [setTooltipOpen]);

  if (!isValidElement(children)) {
    throw new Error(
      "AppTooltip expects a single valid React element as children.",
    );
  }

  return disabled ? (
    <>{children}</>
  ) : (
    <div
      className="relative inline-flex"
      onMouseEnter={disableHoverListener ? undefined : showTooltip}
      onMouseLeave={disableHoverListener ? undefined : hideTooltip}
      onTouchStart={disableTouchListener ? undefined : showTooltip}
    >
      {cloneElement(children, {
        "aria-describedby": open ? tooltipId : undefined,
        onMouseEnter: (event: MouseEvent) => {
          children.props.onMouseEnter?.(event);
          if (!disableHoverListener) showTooltip();
        },
        onMouseLeave: (event: MouseEvent) => {
          children.props.onMouseLeave?.(event);
          if (!disableHoverListener) hideTooltip();
        },
        onFocus: (event: FocusEvent) => {
          children.props.onFocus?.(event);
          if (!disableFocusListener) showTooltip();
        },
        onBlur: (event: FocusEvent) => {
          children.props.onBlur?.(event);
          if (!disableFocusListener) hideTooltip();
        },
        onKeyDown: (event: KeyboardEvent) => {
          children.props.onKeyDown?.(event);
          if (event.key === "Escape") hideTooltip();
        },
        onTouchStart: (event: TouchEvent) => {
          children.props.onTouchStart?.(event);
          if (!disableTouchListener) {
            if (open) hideTooltip();
            else showTooltip();
          }
        },
      })}

      <AnimatePresence>
        {open && title != null && (
          <TooltipBubble
            id={tooltipId}
            placement={placement}
            arrow={arrow}
            enterDelay={enterDelay}
            exitDelay={exitDelay}
            className={className}
          >
            {title}
          </TooltipBubble>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TooltipBubbleProps {
  id: string;
  placement: TooltipPlacement;
  arrow: boolean;
  enterDelay: number;
  exitDelay: number;
  className?: string;
  children: ReactNode;
}

const TooltipBubble = ({
  id,
  placement,
  arrow,
  enterDelay,
  exitDelay,
  className,
  children,
}: TooltipBubbleProps) => {
  const COMMON_CLASS = "absolute z-2000 bg-bg-secondary border-white/10";
  const motionState = motionVariants[placement];

  return (
    <motion.div
      id={id}
      role="tooltip"
      initial={motionState.initial}
      animate={{
        ...motionState.animate,
        transition: {
          duration: 0.1,
          ease: "easeOut",
          delay: enterDelay / 1000,
        },
      }}
      exit={{
        ...motionState.exit,
        transition: {
          duration: 0.1,
          ease: "easeIn",
          delay: exitDelay / 1000,
        },
      }}
      className={cn(
        COMMON_CLASS,
        "pointer-events-none w-max max-w-xs rounded-md border",
        "px-2.5 py-1.5 text-xs text-foreground shadow-lg",
        placementStyles[placement],
        className,
      )}
    >
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            COMMON_CLASS,
            "size-2 rotate-45",
            arrowStyles[placement],
          )}
        />
      )}
    </motion.div>
  );
};
