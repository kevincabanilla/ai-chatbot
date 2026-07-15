import { Bot, PanelLeft, Plus, Search, Settings } from "lucide-react";
import { AppNavButton } from "../buttons/AppNavButton";
import { AppIconButton } from "../buttons/AppIconButton";
import { useState } from "react";
import { cn } from "@/libs/utils";

export function LeftNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [isCollapseBtnHovered, setIsCollapseBtnHovered] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-1 flex flex-col h-screen border-r border-accent/20 transition-all duration-300",
        collapsed ? "w-18 min-w-18" : "w-64 min-w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center border-b border-accent/20 p-3">
        <AppIconButton
          label="Minimize Nav"
          variant="ghost"
          icon={!collapsed || !isCollapseBtnHovered ? Bot : PanelLeft}
          onMouseEnter={() => {
            setIsCollapseBtnHovered(true);
          }}
          onMouseLeave={() => {
            setIsCollapseBtnHovered(false);
          }}
          onClick={() => {
            if (collapsed) setCollapsed(!collapsed);
          }}
        />

        {!collapsed && (
          <>
            <h1 className="grow text-xl font-bold tracking-tight ml-3">
              Chatbud
            </h1>

            <AppIconButton
              icon={PanelLeft}
              label="Minimize Nav"
              variant="ghost"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <AppNavButton collapsed={collapsed} icon={Plus}>
          <span>New Chat</span>
        </AppNavButton>

        <AppNavButton collapsed={collapsed} icon={Search}>
          <span>Search Chat</span>
        </AppNavButton>

        {!collapsed && (
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

      {/* Footer */}
      <div className="border-t border-accent/20 p-3">
        <AppNavButton collapsed={collapsed} icon={Settings}>
          <span>Settings</span>
        </AppNavButton>
      </div>
    </aside>
  );
}
