import { createContext } from "react";
import type { Conversation } from "@/interfaces";

export interface AppContextType {
  isMobile: boolean;
  conversationId: string | null;
  conversation: Conversation | null;
  openSettings: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
