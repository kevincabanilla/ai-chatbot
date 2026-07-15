import { type ComponentPropsWithRef } from "react";
import { cn } from "@/libs/utils";
import type { LucideIcon } from "lucide-react";

export interface AppNavButtonProps extends ComponentPropsWithRef<"button"> {
  collapsed?: boolean;
  icon?: LucideIcon;
}

export const AppNavButton = ({
  collapsed,
  icon: Icon,
  className,
  children,
  ...props
}: AppNavButtonProps) => {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-xs md:text-sm transition-colors hover:bg-white/5 hover:text-accent",
        collapsed && !Icon ? "hidden" : "",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="shrink-0 p-0.5" />}
      <div
        className={`truncate transition-all duration-300 ${
          !collapsed ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </button>
  );
};
