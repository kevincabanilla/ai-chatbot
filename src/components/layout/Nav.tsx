import { useState } from "react";
import { Link } from "react-router";
import { motion, type Transition } from "motion/react";
import { Bot, PanelLeft, Plus, Search, Settings, X } from "lucide-react";
import { cn } from "@/libs/utils";
import type { NavProps } from "@/interfaces";
import { AppNavButton } from "../buttons/AppNavButton";
import { AppIconButton } from "../buttons/AppIconButton";
import { SIDEBAR_TRANSITION, sidebarVariants } from "@/libs/animationVariants";
import { useStore } from "@/hooks";
import { Helper } from "@/libs/helper";
import { QUERY_PARAM, useGetQueryParam } from "@/hooks/useGetQueryParam";
import { AppNavLink } from "../buttons/AppNavLink";

export function Nav({
  isMobile,
  isCollapsed,
  setIsCollapsed,
  onSearchClicked,
  onSettingsClicked,
}: NavProps) {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      className={cn(
        "h-full flex flex-col overflow-y-auto bg-bg-primary border-r border-accent/20",
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
        onToggle={toggleSidebar}
      />

      <NavActions
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        onSearchClicked={onSearchClicked}
      />

      {/* Footer */}
      <NavFooter
        isCollapsed={isCollapsed}
        onSettingsClicked={onSettingsClicked}
      />
    </motion.aside>
  );
}

const NavHeader = ({
  isMobile,
  isCollapsed,
  onToggle,
}: {
  isMobile: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}) => {
  const [isCollapseBtnHovered, setIsCollapseBtnHovered] = useState(false);

  const headerTransition: Transition = {
    duration: 0.1,
    ease: "easeOut",
  };

  const HeaderIcon = !isCollapsed || !isCollapseBtnHovered ? Bot : PanelLeft;
  const HeaderIconClassName = cn(
    "flex items-center justify-center",
    "rounded-xl px-3 py-2 text-sm cursor-pointer",
    "transition-colors hover:bg-white/3",
  );

  return (
    <div className="flex items-center border-b border-accent/20 px-3 py-2">
      {isCollapsed ? (
        <button
          className={HeaderIconClassName}
          onMouseEnter={() => {
            setIsCollapseBtnHovered(true);
          }}
          onMouseLeave={() => {
            setIsCollapseBtnHovered(false);
          }}
          onClick={() => {
            onToggle();
            setIsCollapseBtnHovered(false);
          }}
        >
          <HeaderIcon className="shrink-0 p-0.5" />
        </button>
      ) : (
        <Link to={"/"} className={HeaderIconClassName}>
          <Bot className="shrink-0 p-0.5" />
        </Link>
      )}

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
        <h1 className="grow px-0.5 text-xl font-bold tracking-tight truncate">
          <a href={window.location.origin}>{import.meta.env.VITE_APP_TITLE}</a>
        </h1>

        <AppIconButton
          icon={isMobile ? X : PanelLeft}
          label="Toggle Sidebar"
          variant="ghost"
          onClick={onToggle}
        />
      </motion.div>
    </div>
  );
};

const NavActions = ({
  isMobile,
  isCollapsed,
  onToggle,
  onSearchClicked,
}: {
  isMobile: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onSearchClicked: () => void;
}) => {
  const currentConversationId = useGetQueryParam("c");
  const { state, setState } = useStore();

  const onNavigate = () => {
    if (isMobile) onToggle();
    Helper.scrollToTop();
  };

  return (
    <nav className="flex-1 p-3">
      <AppNavLink
        to={`/`}
        collapsed={isCollapsed}
        icon={Plus}
        onClick={() => {
          setState((prev) => ({
            ...prev,
            currentConversationId: null,
          }));
          onNavigate();
        }}
      >
        <span>New Chat</span>
      </AppNavLink>

      <AppNavButton
        collapsed={isCollapsed}
        icon={Search}
        onClick={onSearchClicked}
      >
        <span>Search Chat</span>
      </AppNavButton>

      {!isCollapsed && state.conversationOrder.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="p-2">
            <span className="text-xs font-medium">Recents</span>
          </div>

          <ul className="space-y-2">
            {state.conversationOrder.map((x) => {
              const isActive = x === currentConversationId;
              return (
                <li key={x}>
                  <AppNavLink
                    to={`/?${QUERY_PARAM.ChatId}=${x}`}
                    className={cn("group", isActive && "text-accent")}
                    onClick={() => {
                      if (isActive) return;

                      setState((prev) => ({
                        ...prev,
                        currentConversationId: x,
                      }));
                      onNavigate();
                    }}
                  >
                    <span>{state.conversationsById[x].title}</span>
                  </AppNavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

const NavFooter = ({
  isCollapsed,
  onSettingsClicked,
}: {
  isCollapsed: boolean;
  onSettingsClicked: () => void;
}) => {
  return (
    <div className="border-t border-accent/20 p-3">
      <AppNavButton
        collapsed={isCollapsed}
        icon={Settings}
        onClick={onSettingsClicked}
      >
        <span>Settings</span>
      </AppNavButton>
    </div>
  );
};
