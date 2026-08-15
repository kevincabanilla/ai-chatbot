import { createContext } from "react";

export interface AppContextType {
  isMobile: boolean;
  openSettings: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
