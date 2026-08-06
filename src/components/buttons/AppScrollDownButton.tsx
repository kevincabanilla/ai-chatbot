import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/libs/utils";

const SCROLL_THRESHOLD = 200;

export const AppScrollDownButton = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  const getWindowHeightOffset = () =>
    window.innerHeight + window.innerHeight * 0.4;

  useEffect(() => {
    const update = () => {
      const canScroll =
        document.documentElement.scrollHeight > getWindowHeightOffset();

      setVisible(canScroll && scrollY.get() < SCROLL_THRESHOLD);
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest < SCROLL_THRESHOLD);
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const canScroll =
      document.documentElement.scrollHeight > getWindowHeightOffset();

    setVisible(canScroll && latest < SCROLL_THRESHOLD);
  });

  const onScrollDown = () => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-24 z-5 flex justify-center",
        !visible && "pointer-events-none",
      )}
    >
      <AnimatePresence>
        {visible && (
          <motion.button
            className="p-3 rounded-full bg-bg-secondary border border-accent/20 cursor-pointer"
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: [0, 8, 0],
            }}
            exit={{ opacity: 0, y: 16 }}
            transition={{
              opacity: { duration: 0.4 },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            onClick={onScrollDown}
          >
            <ChevronDown size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
