import { type HTMLAttributes } from "react";
import clsx from "clsx";

export const AppCard = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clsx(
        "bg-accent rounded-2xl backdrop-blur-lg",
        "border border-sky-300/20 hover:border-sky-300/40",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
