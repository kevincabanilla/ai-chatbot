import clsx from "clsx";
import { motion } from "motion/react";

export const ParagraphSkeletonLoader = () => {
  const lines = ["w-full", "w-[85%]"];

  return (
    <motion.div
      aria-label="Streaming response"
      initial={{ opacity: 0.55 }}
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="mt-2 flex w-full flex-col gap-2.5"
    >
      {lines.map((width, index) => (
        <div
          key={`${width}-${index}`}
          className={clsx(
            "relative h-3.5 overflow-hidden rounded-full border border-white/10",
            "bg-linear-to-r from-slate-700/70 via-slate-600/90 to-slate-700/70",
            width,
          )}
        >
          <motion.div
            className={clsx(
              "absolute inset-0",
              "bg-linear-to-r from-transparent via-white/18 to-transparent",
            )}
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default ParagraphSkeletonLoader;
