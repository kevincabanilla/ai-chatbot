import type { Transition, Variants } from "motion/react";

export const SIDEBAR_TRANSITION: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 40,
};

export const sidebarVariants: Variants = {
  expanded: {
    width: 256,
    minWidth: 256,
    transition: {
      ...SIDEBAR_TRANSITION,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  collapsed: {
    width: 72,
    minWidth: 72,
    transition: {
      ...SIDEBAR_TRANSITION,
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};
