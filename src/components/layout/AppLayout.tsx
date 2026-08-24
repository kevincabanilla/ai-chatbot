import { useState } from "react";
import { Outlet } from "react-router";
import { MEDIA_QUERIES, useMediaQuery } from "@/hooks";
import { TopToolbar, LeftNav } from "@/components/views";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { AppContext } from "@/contexts/AppContext";
import { DeleteConversationDialog } from "../ui/DeleteConversationDialog";

export default function AppLayout() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.lg);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState("");

  const onDeleteConversation = (cid: string) => {
    setDeleteConversationId(cid);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex">
      <LeftNav
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        setIsCollapsed={setIsCollapsed}
        onSearchClicked={() => {
          setIsSearchOpen(true);
        }}
        onSettingsClicked={() => {
          setIsSettingsOpen(true);
        }}
      />

      <SearchDialog
        open={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />

      <div className="flex-1">
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
