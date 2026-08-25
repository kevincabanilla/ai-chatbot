export const TRANSITIONS = {
  default: { duration: 0.4, ease: "easeOut" as const },
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },
  quick: { duration: 0.25, ease: "easeInOut" as const },
};
