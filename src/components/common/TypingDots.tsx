import { motion } from "motion/react";

export const TypingDots = () => {
  return (
    <div className="flex gap-2 p-1.5 md:p-2">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="size-1.5 md:size-2 rounded-full bg-cyan-500"
          animate={{ y: [0, -3, 0], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot * 0.2,
          }}
        />
      ))}
    </div>
  );
};
