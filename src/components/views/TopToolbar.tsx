import { useEffect, useRef, useState, type ComponentProps } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const currentConversationId = useGetQueryParam("c");
  const { getConversation, isConverstationExists } = useStateManager();

  const conversation = getConversation(currentConversationId);

  useEffect(() => {
    if (!menuOpen) return;

    // close when clicked outside the menu
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Ignore tiny movements near the top
    if (current < 30) {
      setHidden(false);
      return;
    }

    setHidden(current > previous); // Scrolling down when true
    if (hidden && menuOpen) setMenuOpen(false);
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
            isConverstationExists(currentConversationId) && (
              <div ref={menuRef} className="relative">
                <AppIconButton
                  variant="plain"
                  label="Conversation actions"
                  className={cn(
                    "transition-transform",
                    menuOpen && "rotate-180",
                  )}
                  icon={ChevronDown}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => {
                    setMenuOpen((open) => !open);
                  }}
                />

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      role="menu"
                      aria-label="Conversation actions"
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      className={cn(
                        "absolute right-0 top-full z-50 mt-2 min-w-48 origin-top-right p-2",
                        "rounded-lg border border-accent/20 bg-bg-secondary shadow-xl",
                      )}
                    >
                      <AppNavButton
                        type="button"
                        role="menuitem"
                        icon={Trash2}
                        className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:ring-rose-400"
                        onClick={() => {
                          setMenuOpen(false);
                          onDeleteConversation(currentConversationId);
                        }}
                      >
                        <span>Delete conversation</span>
                      </AppNavButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
        </motion.header>
      )}
    </AnimatePresence>
  );
};
