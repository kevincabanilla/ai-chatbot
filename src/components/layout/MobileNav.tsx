import { AnimatePresence, motion } from "motion/react";
import type { NavProps } from "@/interfaces";
import { cn } from "@/libs/utils";
import { Nav } from "./Nav";

export const MobilepNav = ({ ...props }: NavProps) => {
  return (
    <AnimatePresence>
      {!props.isCollapsed && (
        <motion.div
          className={cn("h-screen z-100 fixed inset-0")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Mobile backdrop */}
          <motion.div
            onClick={() => {
              props.setIsCollapsed(true);
            }}
            className={cn("absolute inset-0", "bg-black/40 backdrop-blur-md")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <Nav {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
