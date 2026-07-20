import { useState } from "react";
import { motion } from "motion/react";
import { Bot, PanelLeft, Plus, Search, Settings, X } from "lucide-react";
import { cn } from "@/libs/utils";
import type { NavProps } from "@/interfaces";
import { AppNavButton } from "../buttons/AppNavButton";
import { AppIconButton } from "../buttons/AppIconButton";

export function Nav({ isMobile, isCollapsed, setIsCollapsed }: NavProps) {
  return (
    <motion.aside
      className={cn(
        "h-full flex flex-col bg-bg-primary border-r border-accent/20",
        isMobile ? "absolute inset-y-0 left-0" : "sticky top-0",
        // isCollapsed ? "w-18 min-w-18" : "w-64 min-w-64",
      )}
      initial={{ x: isMobile ? "-100%" : "0", width: isMobile ? 256 : 0 }}
      animate={
        isMobile
          ? { x: 0 }
          : {
              width: isCollapsed ? 72 : 256,
              minWidth: isCollapsed ? 72 : 256,
            }
      }
      exit={{ x: "-100%" }} // Mobile only
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 40,
      }}
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

  return (
    <div className="flex items-center border-b border-accent/20 p-3">
      <AppIconButton
        label="Toggle Sidebar"
        variant="ghost"
        icon={!isCollapsed || !isCollapseBtnHovered ? Bot : PanelLeft}
        onMouseEnter={() => {
          setIsCollapseBtnHovered(true);
        }}
        onMouseLeave={() => {
          setIsCollapseBtnHovered(false);
        }}
        onClick={() => {
          if (isCollapsed) toggleSidebar();
        }}
      />

      {!isCollapsed && (
        <>
          <h1 className="grow text-xl font-bold tracking-tight ml-3">
            {import.meta.env.VITE_APP_TITLE}
          </h1>

          <AppIconButton
            icon={isMobile ? X : PanelLeft}
            label="Toggle Sidebar"
            variant="ghost"
            onClick={toggleSidebar}
          />
        </>
      )}
    </div>
  );
};

const NavActions = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <nav className="flex-1 p-3">
      <AppNavButton collapsed={isCollapsed} icon={Plus}>
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
