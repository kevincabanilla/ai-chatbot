import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/libs/utils";
import { SIDEBAR_TRANSITION, sidebarVariants } from "@/libs/animationVariants";
import type { NavProps } from "@/interfaces";
import { MobileBackdrop } from "@/components/common/MobileBackdrop";
import { Navigation } from "./Navigation";

export const LeftSidebar = ({ ...props }: NavProps) => {
  const { isMobile, isCollapsed, setIsCollapsed } = props;

  const content = (
    <SidebarContent isMobile={isMobile} isCollapsed={isCollapsed}>
      <Navigation {...props} />
    </SidebarContent>
  );

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
          setIsCollapsed(true);
        }}
      />

      {content}
    </motion.div>
  ) : (
    <div className="h-screen z-100 sticky top-0">{content}</div>
  );
};

const SidebarContent = ({
  isMobile,
  isCollapsed,
  children,
}: {
  isMobile: boolean;
  isCollapsed: boolean;
  children: ReactNode;
}) => {
  return (
    <motion.aside
      className={cn(
        "h-full max-h-full flex flex-col overflow-hidden bg-bg-primary border-r border-accent/20",
        isMobile ? "absolute inset-y-0 left-0" : "sticky top-0",
      )}
      initial={{ x: isMobile ? "-100%" : "0", width: isMobile ? 256 : 0 }}
      animate={
        isMobile
          ? { x: isCollapsed ? "-100%" : 0 }
          : isCollapsed
            ? "collapsed"
            : "expanded"
      }
      exit={{ x: "-100%" }} // Mobile only
      transition={SIDEBAR_TRANSITION}
      variants={sidebarVariants}
    >
      {children}
    </motion.aside>
  );
};
