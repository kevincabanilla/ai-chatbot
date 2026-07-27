import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ChevronDown } from "lucide-react";

export const AppScrollDownButton = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const canScroll =
        document.documentElement.scrollHeight > window.innerHeight;

      setVisible(canScroll && scrollY.get() < 200);
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest < 200);
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const canScroll =
      document.documentElement.scrollHeight > window.innerHeight;

    setVisible(canScroll && latest < 200);
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
  );
};
