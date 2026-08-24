import { AnimatePresence, motion } from "motion/react";
import { Menu, Trash2 } from "lucide-react";
import clsx from "clsx";
import { AppIconButton } from "../buttons/AppIconButton";
import { useGetQueryParam, useStateManager } from "@/hooks";

export const TopToolbar = ({
  isVisible,
  onOpenDrawer,
  onDeleteConversation,
}: {
  isVisible: boolean;
  onOpenDrawer: (shouldOpen: boolean) => void;
  onDeleteConversation: (cid: string) => void;
}) => {
  const currentConversationId = useGetQueryParam("c");
  const { isConverstationExists } = useStateManager();

  return (
    <AnimatePresence>
      {/* Mobile header */}
      {isVisible && (
        <motion.header
          className={clsx(
            "sticky top-0 h-16 z-50 flex items-center",
            "border-b border-accent/20",
            "bg-primary/5 backdrop-blur-md px-4",
          )}
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 40,
          }}
        >
          <AppIconButton
            variant="plain"
            label="Menu"
            icon={Menu}
            onClick={() => {
              onOpenDrawer(true);
            }}
          />

          <h1 className="grow text-xl font-bold tracking-tight ml-3">
            {import.meta.env.VITE_APP_TITLE}
          </h1>

          <div className="grow" />

          {currentConversationId &&
            isConverstationExists(currentConversationId) && (
              <AppIconButton
                variant="plain"
                label="Delete Conversation"
                icon={Trash2}
                className="text-accent hover:text-rose-500"
                onClick={() => {
                  onDeleteConversation(currentConversationId);
                }}
              />
            )}
        </motion.header>
      )}
    </AnimatePresence>
  );
};
