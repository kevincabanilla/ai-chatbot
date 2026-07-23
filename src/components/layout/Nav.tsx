import { useState } from "react";
import { motion, type Transition } from "motion/react";
import { Bot, PanelLeft, Plus, Search, Settings, X } from "lucide-react";
import { cn } from "@/libs/utils";
import type { NavProps } from "@/interfaces";
import { AppNavButton } from "../buttons/AppNavButton";
import { AppIconButton } from "../buttons/AppIconButton";
import { SIDEBAR_TRANSITION, sidebarVariants } from "@/libs/animationVariants";
import { useStore } from "@/hooks";

export function Nav({ isMobile, isCollapsed, setIsCollapsed }: NavProps) {
  return (
    <motion.aside
      className={cn(
        "h-full flex flex-col bg-bg-primary border-r border-accent/20",
        isMobile ? "absolute inset-y-0 left-0" : "sticky top-0",
        // isCollapsed ? "w-18 min-w-18" : "w-64 min-w-64",
      )}
      initial={{ x: isMobile ? "-100%" : "0", width: isMobile ? 256 : 0 }}
      animate={isMobile ? { x: 0 } : isCollapsed ? "collapsed" : "expanded"}
      exit={{ x: "-100%" }} // Mobile only
      transition={SIDEBAR_TRANSITION}
      variants={sidebarVariants}
    >
      {/* Logo */}
      <NavHeader
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <NavActions isCollapsed={isCollapsed} />

      {/* Footer */}
      <NavFooter isCollapsed={isCollapsed} />
    </motion.aside>
  );
}

const NavHeader = ({ isMobile, isCollapsed, setIsCollapsed }: NavProps) => {
  const [isCollapseBtnHovered, setIsCollapseBtnHovered] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const headerTransition: Transition = {
    duration: 0.1,
    ease: "easeOut",
  };

  const HeaderIcon = !isCollapsed || !isCollapseBtnHovered ? Bot : PanelLeft;

  return (
    <div className="flex items-center border-b border-accent/20 px-3 py-2">
      <button
        className={cn(
          "flex items-center justify-center",
          "rounded-xl px-3 py-2 text-sm cursor-pointer",
          "transition-colors hover:bg-white/3",
        )}
        onMouseEnter={() => {
          setIsCollapseBtnHovered(true);
        }}
        onMouseLeave={() => {
          setIsCollapseBtnHovered(false);
        }}
        onClick={() => {
          if (isCollapsed) toggleSidebar();
        }}
      >
        <HeaderIcon className="shrink-0 p-0.5" />
      </button>

      <motion.div
        className={cn(isCollapsed ? "hidden" : "grow flex items-center")}
        variants={{
          expanded: {
            opacity: 1,
            transition: headerTransition,
          },
          collapsed: {
            opacity: 0,
            transition: headerTransition,
          },
        }}
      >
        <h1 className="grow text-xl font-bold tracking-tight truncate">
          {import.meta.env.VITE_APP_TITLE}
        </h1>

        <AppIconButton
          icon={isMobile ? X : PanelLeft}
          label="Toggle Sidebar"
          variant="ghost"
          onClick={toggleSidebar}
        />
      </motion.div>
    </div>
  );
};

const NavActions = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { state, setState } = useStore();

  return (
    <nav className="flex-1 p-3">
      <AppNavButton
        collapsed={isCollapsed}
        icon={Plus}
        onClick={() => {
          setState((prev) => ({
            ...prev,
            currentConversationId: null,
          }));
        }}
      >
        <span>New Chat</span>
      </AppNavButton>

      <AppNavButton collapsed={isCollapsed} icon={Search}>
        <span>Search Chat</span>
      </AppNavButton>

      {!isCollapsed && (
        <div className="flex flex-col gap-1">
          <div className="p-2">
            <span className="text-xs font-medium">Recents</span>
          </div>
          <ul className="space-y-2">
            <li>
              <AppNavButton className="group">
                <span>Some previous chat</span>
              </AppNavButton>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

const NavFooter = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className="border-t border-accent/20 p-3">
      <AppNavButton collapsed={isCollapsed} icon={Settings}>
        <span>Settings</span>
      </AppNavButton>
    </div>
  );
};
