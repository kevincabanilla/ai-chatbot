import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { animate } from "motion/react";
import { clsx } from "clsx";

type MaskState = "none" | "left" | "right" | "both";

interface HoverMarqueeProps extends ComponentProps<"div"> {
  speed?: number; // px/s
  children: React.ReactNode;
}

export const HoverMarquee = ({
  className,
  speed = 40,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: HoverMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);
  const [maskState, setMaskState] = useState<MaskState>("none");

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current || !textRef.current) return;

      const overflow =
        textRef.current.scrollWidth - containerRef.current.clientWidth;

      setDistance(Math.max(0, overflow));
      setMaskState(distance > 0 ? "right" : "none");
    };

    update();

    const resize = new ResizeObserver(update);

    if (containerRef.current != null) resize.observe(containerRef.current);
    if (textRef.current != null) resize.observe(textRef.current);

    return () => {
      resize.disconnect();
    };
  }, [children, distance]);

  const handleHoverStart = () => {
    if (distance <= 0) return;

    // Once the text starts moving, both sides can have hidden text.
    setMaskState("both");

    animate(
      textRef.current,
      { x: -distance },
      {
        duration: distance / speed,
        ease: "linear",
        onComplete: () => {
          // We've reached the end, so only the left side is clipped.
          setMaskState("left");
        },
      },
    );
  };

  const handleHoverEnd = () => {
    animate(
      textRef.current,
      { x: 0 },
      {
        duration: 0.05,
        onComplete: () => {
          // Back at the beginning, only the right side has hidden text.
          setMaskState(distance > 0 ? "right" : "none");
        },
      },
    );
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative overflow-hidden",
        {
          "mask-none": maskState === "none",

          // Right edge fades
          "mask-[linear-gradient(to_right,transparent,black_0%,black_93%,transparent)]":
            maskState === "right",

          // Left edge fades
          "mask-[linear-gradient(to_right,transparent,black_7%,black_100%)]":
            maskState === "left",

          // Both edges fade
          "mask-[linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]":
            maskState === "both",
        },
        className,
      )}
      {...props}
      onMouseEnter={(e) => {
        handleHoverStart();
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        handleHoverEnd();
        onMouseLeave?.(e);
      }}
    >
      <span ref={textRef} className="inline-block whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};
