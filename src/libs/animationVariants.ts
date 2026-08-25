import { TRANSITIONS } from "@/constants/animations";
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

// ===== Container / Stagger =====
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -20, y: -20 },
  visible: { opacity: 1, x: 0, y: 0, transition: TRANSITIONS.spring },
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 20, y: -20 },
  visible: { opacity: 1, x: 0, y: 0, transition: TRANSITIONS.spring },
};
