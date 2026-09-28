import type { ComponentProps } from "react";

export const MobileBackdrop = ({ ...props }: ComponentProps<"button">) => {
  return (
    <button
      type="button"
      className="absolute inset-0 size-full cursor-default bg-black/40 backdrop-blur-md"
      {...props}
    />
  );
};
