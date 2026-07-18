import { AnimatePresence, motion } from "motion/react";
import { Menu } from "lucide-react";
import clsx from "clsx";
import { AppIconButton } from "../buttons/AppIconButton";

export const TopToolbar = ({
  isVisible,
  onOpenDrawer,
}: {
  isVisible: boolean;
  onOpenDrawer: (shouldOpen: boolean) => void;
}) => {
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
        </motion.header>
      )}
    </AnimatePresence>
  );
};
