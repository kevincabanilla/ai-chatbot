import { motion } from "motion/react";
import { cn } from "@/libs/utils";
import type { NavProps } from "@/interfaces";
import { MobileBackdrop } from "@/components/common/MobileBackdrop";
import { Navigation } from "./Navigation";

export const LeftSidebar = ({ ...props }: NavProps) => {
  return props.isMobile ? (
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

      <MobileBackdrop
        aria-label="Collapse navigation sidebar"
        onClick={() => {
          props.setIsCollapsed(true);
        }}
      />

      <Navigation {...props} />
    </motion.div>
  ) : (
    <div className="h-screen z-100 sticky top-0">
      <Navigation {...props} />
    </div>
  );
};
