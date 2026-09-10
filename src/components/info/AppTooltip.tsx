import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  type TouchEvent,
} from "react";
import { cn } from "@/libs/utils";

export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export interface AppTooltipProps {
  title: ReactNode;
  children: ReactElement<TooltipChildProps>;
  placement?: TooltipPlacement;
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
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

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  "top-start": "bottom-full left-0 mb-2",
  "top-end": "bottom-full right-0 mb-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
  "right-start": "left-full top-0 ml-2",
  "right-end": "left-full bottom-0 ml-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  "bottom-start": "top-full left-0 mt-2",
  "bottom-end": "top-full right-0 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  "left-start": "right-full top-0 mr-2",
  "left-end": "right-full bottom-0 mr-2",
};

const arrowStyles: Record<TooltipPlacement, string> = {
  top: "-bottom-1 left-1/2 -translate-x-1/2 border-r border-b",
  "top-start": "-bottom-1 left-3 border-r border-b",
  "top-end": "-bottom-1 right-3 border-r border-b",
  right: "-left-1 top-1/2 -translate-y-1/2 border-b border-l",
  "right-start": "-left-1 top-3 border-b border-l",
  "right-end": "-left-1 bottom-3 border-b border-l",
  bottom: "-top-1 left-1/2 -translate-x-1/2 border-t border-l",
  "bottom-start": "-top-1 left-3 border-t border-l",
  "bottom-end": "-top-1 right-3 border-t border-l",
  left: "-right-1 top-1/2 -translate-y-1/2 border-t border-r",
  "left-start": "-right-1 top-3 border-t border-r",
  "left-end": "-right-1 bottom-3 border-t border-r",
};

export const AppTooltip = ({
  title,
  children,
  placement = "top",
  arrow = false,
  enterDelay = 100,
  leaveDelay = 0,
  open: controlledOpen,
  defaultOpen = false,
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
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const setTooltipOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    if (nextOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const showTooltip = () => {
    clearTimeout(closeTimer.current);
    if (open || openTimer.current) return;
    openTimer.current = setTimeout(() => {
      openTimer.current = undefined;
      setTooltipOpen(true);
    }, enterDelay);
  };

  const hideTooltip = () => {
    clearTimeout(openTimer.current);
    openTimer.current = undefined;
    if (!open) return;
    closeTimer.current = setTimeout(() => {
      closeTimer.current = undefined;
      setTooltipOpen(false);
    }, leaveDelay);
  };

  useEffect(() => clearTimers, []);

  if (!isValidElement(children)) {
    throw new Error(
      "AppTooltip expects a single valid React element as children.",
    );
  }

  // cloneElement keeps aria-describedby on the actual focusable child.
  // eslint-disable-next-line react-hooks/refs
  const child = cloneElement(children, {
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
  });

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={disableHoverListener ? undefined : showTooltip}
      onMouseLeave={disableHoverListener ? undefined : hideTooltip}
      onTouchStart={disableTouchListener ? undefined : showTooltip}
    >
      {child}
      {open && title != null && (
        <TooltipBubble
          id={tooltipId}
          placement={placement}
          arrow={arrow}
          className={className}
        >
          {title}
        </TooltipBubble>
      )}
    </span>
  );
};

interface TooltipBubbleProps {
  id: string;
  placement: TooltipPlacement;
  arrow: boolean;
  className?: string;
  children: ReactNode;
}

const TooltipBubble = ({
  id,
  placement,
  arrow,
  className,
  children,
}: TooltipBubbleProps) => {
  const bubble = (
    <span
      id={id}
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-1000 w-max max-w-xs rounded-md border border-white/10 bg-bg-secondary px-2.5 py-1.5 text-xs text-foreground shadow-lg",
        placementStyles[placement],
        className,
      )}
    >
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute h-2 w-2 rotate-45 border-white/10 bg-bg-secondary",
            arrowStyles[placement],
          )}
        />
      )}
    </span>
  );

  return bubble;
};
