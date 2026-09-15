import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";

interface HoverMarqueeProps extends ComponentProps<"div"> {
  speed?: number; // px/s
  children: React.ReactNode;
}

export const HoverMarquee = ({
  className,
  speed = 40,
  children,
  ...props
}: HoverMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current || !textRef.current) return;

      const overflow =
        textRef.current.scrollWidth - containerRef.current.clientWidth;

      setDistance(Math.max(0, overflow));
    };

    update();

    const resize = new ResizeObserver(update);

    if (containerRef.current != null) resize.observe(containerRef.current);
    if (textRef.current != null) resize.observe(textRef.current);

    return () => {
      resize.disconnect();
    };
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative overflow-hidden",
        "mask-[linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]",
        className,
      )}
      {...props}
    >
      <motion.span
        ref={textRef}
        className="inline-block whitespace-nowrap"
        whileHover={distance > 0 ? { x: -distance } : undefined}
        transition={{
          duration: distance / speed,
          ease: "linear",
        }}
      >
        {children}
      </motion.span>
    </div>
  );
};
