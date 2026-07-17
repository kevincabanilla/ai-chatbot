import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/libs/utils";
import { Bot, PanelLeft, Plus, Search, Settings, X } from "lucide-react";
import { AppNavButton } from "../buttons/AppNavButton";
import { AppIconButton } from "../buttons/AppIconButton";

export function LeftNav({
  isMobile,
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobile: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const isCollapsed = collapsed && !isMobileOpen;

  const onCloseMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <AnimatePresence>
      {(!isMobile || isMobileOpen) && (
        <motion.div
          className={cn(
            "h-screen z-100",
            isMobile ? "fixed inset-0" : "sticky top-0",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Mobile backdrop */}
          {isMobile && isMobileOpen && (
            <motion.div
              onClick={() => {
                setIsMobileOpen(false);
              }}
              className={cn("absolute inset-0", "bg-black/40 backdrop-blur-md")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}

          <motion.aside
            className={cn(
              "h-full flex flex-col bg-bg-primary border-r border-accent/20",
              isMobile ? "absolute inset-y-0 left-0" : "sticky top-0",
              isCollapsed ? "w-18 min-w-18" : "w-64 min-w-64",
            )}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 40,
            }}
          >
            {/* Logo */}
            <LeftNavHeader
              isCollapsed={isCollapsed}
              isMobileOpen={isMobileOpen}
              onUpdateCollapsed={() => {
                setCollapsed(!collapsed);
              }}
              onCloseMobile={onCloseMobile}
            />

            <LeftNavActions isCollapsed={isCollapsed} />

            {/* Footer */}
            <LeftNavFooter isCollapsed={isCollapsed} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const LeftNavHeader = ({
  isCollapsed,
  isMobileOpen,
  onUpdateCollapsed,
  onCloseMobile,
}: {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onUpdateCollapsed: () => void;
  onCloseMobile: () => void;
}) => {
  const [isCollapseBtnHovered, setIsCollapseBtnHovered] = useState(false);

  return (
    <div className="flex items-center border-b border-accent/20 p-3">
      <AppIconButton
        label="Minimize Nav"
        variant="ghost"
        icon={!isCollapsed || !isCollapseBtnHovered ? Bot : PanelLeft}
        onMouseEnter={() => {
          setIsCollapseBtnHovered(true);
        }}
        onMouseLeave={() => {
          setIsCollapseBtnHovered(false);
        }}
        onClick={() => {
          if (isCollapsed) onUpdateCollapsed();
        }}
      />

      {!isCollapsed && (
        <>
          <h1 className="grow text-xl font-bold tracking-tight ml-3">
            Chatbud
          </h1>

          <AppIconButton
            icon={isMobileOpen ? X : PanelLeft}
            label="Minimize Nav"
            variant="ghost"
            onClick={() => {
              if (isMobileOpen) onCloseMobile();
              else onUpdateCollapsed();
            }}
          />
        </>
      )}
    </div>
  );
};

const LeftNavActions = ({ isCollapsed }: { isCollapsed: boolean }) => {
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

const LeftNavFooter = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className="border-t border-accent/20 p-3">
      <AppNavButton collapsed={isCollapsed} icon={Settings}>
        <span>Settings</span>
      </AppNavButton>
    </div>
  );
};
