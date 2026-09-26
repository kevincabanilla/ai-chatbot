import { useState, type ComponentProps } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ChevronDown, Menu, Trash2 } from "lucide-react";
import { AppIconButton } from "../buttons/AppIconButton";
import { useGetQueryParam, useStateManager } from "@/hooks";
import { cn } from "@/libs/utils";
import { AppNavButton } from "../buttons/AppNavButton";
import { AppDropdownMenu } from "../containers/AppDropdownMenu";

export interface TopToolbarProps extends ComponentProps<typeof motion.header> {
  isVisible: boolean;
  onOpenDrawer: (shouldOpen: boolean) => void;
  onDeleteConversation: (cid: string) => void;
}

export const TopToolbar = ({
  className,
  isVisible,
  onOpenDrawer,
  onDeleteConversation,
}: TopToolbarProps) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const currentConversationId = useGetQueryParam("c");
  const { getConversation, isConversationExists } = useStateManager();

  const conversation = getConversation(currentConversationId);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Ignore tiny movements near the top
    if (current < 30) {
      setHidden(false);
      return;
    }

    setHidden(current > previous); // Scrolling down when true
  });

  return (
    <AnimatePresence>
      {/* Mobile header */}
      {isVisible && !hidden && (
        <motion.header
          className={cn(
            "fixed inset-x-0 top-0 h-16 z-50 flex items-center",
            "border-b border-accent/20",
            "bg-primary/5 backdrop-blur-md px-2",
            className,
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

          <h1 className="grow font-bold tracking-tight ml-3 truncate">
            {conversation?.title ?? import.meta.env.VITE_APP_TITLE}
          </h1>

          <div className="grow" />

          {currentConversationId &&
            isConversationExists(currentConversationId) && (
              <AppDropdownMenu
                role="menu"
                ariaLabel="Conversation actions"
                closeOnContentClick
                placement="bottom-left"
                trigger={(open) => (
                  <AppIconButton
                    variant="plain"
                    label="Conversation actions"
                    className={cn("transition-transform", open && "rotate-180")}
                    icon={ChevronDown}
                  />
                )}
              >
                <AppNavButton
                  type="button"
                  role="menuitem"
                  icon={Trash2}
                  className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:ring-rose-400"
                  onClick={() => {
                    onDeleteConversation(currentConversationId);
                  }}
                >
                  <span>Delete conversation</span>
                </AppNavButton>
              </AppDropdownMenu>
            )}
        </motion.header>
      )}
    </AnimatePresence>
  );
};
