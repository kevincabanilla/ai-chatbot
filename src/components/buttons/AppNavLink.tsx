import { type ComponentPropsWithRef } from "react";
import { type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/libs/utils";

export interface AppNavLinkProps extends ComponentPropsWithRef<typeof Link> {
  collapsed?: boolean;
  icon?: LucideIcon;
}

export const AppNavLink = ({
  collapsed,
  icon: Icon,
  className,
  children,
  ...props
}: AppNavLinkProps) => {
  return (
    <Link
      className={cn(
        "w-full flex items-center gap-3",
        "rounded-lg px-3 py-2",
        "text-sm transition-colors",
        "hover:bg-white/5 hover:text-accent",
        collapsed && !Icon && "hidden",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="shrink-0 p-0.5" />}
      <div
        className={cn(
          "truncate transition-all duration-300",
          !collapsed ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </Link>
  );
};
