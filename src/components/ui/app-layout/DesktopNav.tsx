import type { NavProps } from "@/interfaces";
import { Nav } from "./Nav";

export const DesktopNav = ({ ...props }: NavProps) => {
  return (
    <div className="h-screen z-100 sticky top-0">
      <Nav {...props} />
    </div>
  );
};
