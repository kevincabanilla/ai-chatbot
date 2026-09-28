import { useState } from "react";
import { Outlet } from "react-router";
import {
  MEDIA_QUERIES,
  useGetQueryParam,
  useMediaQuery,
  useStateManager,
} from "@/hooks";
import { TopToolbar, LeftSidebar } from "@/components/views";
import { SearchSidebar } from "./SearchSidebar";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { AppContext } from "@/contexts/AppContext";
import { DeleteConversationDialog } from "../ui/DeleteConversationDialog";
import { AboutDialog } from "../ui/AboutDialog";
import clsx from "clsx";
import { Helper } from "@/libs/helper";

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
          if (isMobile) {
            setIsSearchOpen(false);
            setIsCollapsed(true);
          }
          if (cid !== conversationId) Helper.scrollToId(cid, "center");
        }}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
