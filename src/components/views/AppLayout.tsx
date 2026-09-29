import { useState } from "react";
import { Outlet } from "react-router";
import clsx from "clsx";
import {
  MEDIA_QUERIES,
  useGetQueryParam,
  useMediaQuery,
  useStateManager,
} from "@/hooks";
import { Helper } from "@/libs/helper";
import { AppContext } from "@/contexts/AppContext";
import { TopToolbar } from "../ui/app-layout/TopToolbar";
import { LeftSidebar } from "../ui/app-layout/LeftSidebar";
import { SearchSidebar } from "../ui/app-layout/SearchSidebar";
import { SettingsDialog } from "../ui/SettingsDialog";
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

  const { getConversation } = useStateManager();
  const conversationId = useGetQueryParam("c");
  const conversation = getConversation(conversationId);

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
          setIsSearchOpen((isOpen) => !isOpen);
          if (isMobile) setIsCollapsed(true);
        }}
        onSettingsClicked={() => {
          setIsSettingsOpen(true);
        }}
        onDeleteConversation={onDeleteConversation}
        onAboutClicked={() => {
          setIsAboutOpen(true);
        }}
      />

      <div className={clsx("min-w-0 flex-1", isMobile && "pt-16")}>
        <TopToolbar
          className="h-16"
          visible={isMobile}
          conversation={conversation}
          onOpenDrawer={(shouldOpen) => {
            setIsCollapsed(!shouldOpen);
          }}
          onDeleteConversation={onDeleteConversation}
          onSearchClicked={() => {
            setIsSearchOpen((isOpen) => !isOpen);
          }}
        />

        <AppContext.Provider
          value={{
            isMobile,
            conversationId,
            conversation,
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

      <SearchSidebar
        open={isSearchOpen}
        currentConversationId={conversation?.id}
        onSelectItem={(cid) => {
          if (isMobile) setIsSearchOpen(false);
          if (cid !== conversationId) Helper.scrollToId(cid, "center");
        }}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
