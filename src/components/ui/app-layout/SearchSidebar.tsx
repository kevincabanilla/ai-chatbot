import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/libs/utils";
import {
  MEDIA_QUERIES,
  useDebounceValue,
  useMediaQuery,
  useSearchConversations,
  type SearchInType,
} from "@/hooks";
import { MobileBackdrop } from "@/components/common/MobileBackdrop";
import { SearchComponent } from "./SearchComponent";

export interface SearchSidebarProps {
  open: boolean;
  currentConversationId?: string | null;
  onSelectItem: (conversationId: string) => void;
  onClose: () => void;
}

export const SearchSidebar = ({
  open,
  currentConversationId,
  onSelectItem,
  onClose,
}: SearchSidebarProps) => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.xl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIn, setSearchIn] = useState<SearchInType>("all");
  const searchTerm = useDebounceValue(searchQuery.trim(), 300);

  const results = useSearchConversations(searchTerm, {
    currentConversationId,
    searchIn,
  });

  useEffect(() => {
    const resetSearchIn = () => {
      setSearchIn("all");
    };

    if (!currentConversationId && searchIn === "current") resetSearchIn();
  }, [currentConversationId, searchIn]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isMobile) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (isMobile) document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile, open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "z-200",
            isMobile
              ? "fixed inset-0"
              : "sticky top-0 h-dvh shrink-0 overflow-hidden",
          )}
          initial={isMobile ? { opacity: 0 } : { width: 0 }}
          animate={isMobile ? { opacity: 1 } : { width: 600 }}
          exit={isMobile ? { opacity: 0 } : { width: 0 }}
          style={isMobile ? { width: "auto" } : undefined}
        >
          {isMobile && (
            <MobileBackdrop
              aria-label="Close search sidebar"
              onClick={onClose}
            />
          )}
          <motion.aside
            role="search"
            aria-modal={isMobile}
            aria-label="Search messages"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={cn(
              "absolute inset-y-0 right-0 flex flex-col w-full max-w-lg bg-bg-primary border-l border-accent/20",
              isMobile && "shadow-2xl shadow-black/30",
            )}
          >
            <SearchComponent
              searchQuery={searchQuery}
              searchTerm={searchTerm}
              searchIn={searchIn}
              currentConversationId={currentConversationId}
              results={results}
              onSetSearchQuery={setSearchQuery}
              onSetSearchIn={setSearchIn}
              onSelectItem={onSelectItem}
              onClose={onClose}
            />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
