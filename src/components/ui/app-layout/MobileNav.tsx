import { motion } from "motion/react";
import type { NavProps } from "@/interfaces";
import { cn } from "@/libs/utils";
import { Nav } from "./Nav";

export const MobilepNav = ({ ...props }: NavProps) => {
  return (
    <motion.div
      className={cn(
        "h-dvh z-100 fixed inset-0",
        props.isCollapsed && "pointer-events-none",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: props.isCollapsed ? 0 : 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Mobile backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => {
          props.setIsCollapsed(true);
        }}
      />

      <Nav {...props} />
    </motion.div>
  );
};
