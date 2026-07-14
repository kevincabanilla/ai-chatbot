import { type HTMLAttributes } from "react";
import { cn } from "@/libs/utils";

export const AppCard = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "bg-bg-secondary",
        "border border-sky-300/20 hover:border-sky-300/40",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
