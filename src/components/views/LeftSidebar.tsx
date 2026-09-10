import type { NavProps } from "@/interfaces";
import { MobilepNav } from "../layout/MobileNav";
import { DesktopNav } from "../layout/DesktopNav";

export const LeftSidebar = ({ ...props }: NavProps) => {
  return props.isMobile ? <MobilepNav {...props} /> : <DesktopNav {...props} />;
};
