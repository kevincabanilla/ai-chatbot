import type { NavProps } from "@/interfaces";
import { MobilepNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

export const LeftSidebar = ({ ...props }: NavProps) => {
  return props.isMobile ? <MobilepNav {...props} /> : <DesktopNav {...props} />;
};
