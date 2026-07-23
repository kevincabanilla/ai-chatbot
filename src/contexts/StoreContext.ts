import { createContext } from "react";
import type { Conversation } from "@/interfaces";

const STORAGE_KEY = "app-store";

export interface Store {
  conversationsById: Record<string, Conversation>;
  conversationOrder: string[];
  currentConversationId: string | null;
}

const defaultState: Store = {
  conversationsById: {},
  conversationOrder: [],
  currentConversationId: null,
};

export interface StoreContextType {
  state: Store;
  setState: (updater: Partial<Store> | ((prev: Store) => Store)) => void;
  reset: () => void;
}

export const loadState = (): Store => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultState;

    return {
      ...defaultState,
      ...JSON.parse(saved),
    } as Store;
  } catch {
    return defaultState;
  }
};

export const saveState = (state: Store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const resetState = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultState };
};

export const StoreContext = createContext<StoreContextType | null>(null);
