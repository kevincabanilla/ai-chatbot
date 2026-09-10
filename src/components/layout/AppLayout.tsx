import { useState } from "react";
import { Outlet } from "react-router";
import { MEDIA_QUERIES, useMediaQuery } from "@/hooks";
import { TopToolbar, LeftSidebar } from "@/components/views";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { AppContext } from "@/contexts/AppContext";
import { DeleteConversationDialog } from "../ui/DeleteConversationDialog";
import { AboutDialog } from "../ui/AboutDialog";

export default function AppLayout() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.lg);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState("");

  const onDeleteConversation = (cid: string) => {
    setDeleteConversationId(cid);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex">
      <LeftSidebar
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        setIsCollapsed={setIsCollapsed}
        onSearchClicked={() => {
          setIsSearchOpen(true);
        }}
        onSettingsClicked={() => {
          setIsSettingsOpen(true);
        }}
        onDeleteConversation={onDeleteConversation}
        onAboutClicked={() => {
          setIsAboutOpen(true);
        }}
      />

      <SearchDialog
        open={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />

      <div className="min-w-0 flex-1">
        <TopToolbar
          isVisible={isMobile}
          onOpenDrawer={(shouldOpen) => {
            setIsCollapsed(!shouldOpen);
          }}
          onDeleteConversation={onDeleteConversation}
        />

        <AppContext.Provider
          value={{
            isMobile,
            openSettings: () => {
              setIsSettingsOpen(true);
            },
          }}
        >
          <Outlet />
        </AppContext.Provider>

        <SettingsDialog
          open={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
          }}
        />

        <AboutDialog
          open={isAboutOpen}
          onClose={() => {
            setIsAboutOpen(false);
          }}
        />

        <DeleteConversationDialog
          conversationId={deleteConversationId}
          open={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
          }}
        />
      </div>
    </div>
  );
}
