import { createContext } from "react";
import type { ApplicationSettings, Conversation } from "@/interfaces";

const STORAGE_KEY = "app-store";

export interface Store {
  conversationsById: Record<string, Conversation>;
  conversationOrder: string[];
  settings: ApplicationSettings;
}

export const DEFAULT_SETTINGS: ApplicationSettings = {
  initialized: false,
  mode: "GENERAL",
  model: import.meta.env.VITE_DEFAULT_AI_MODEL || null,
  streamResponse: false,
};

const DEFAULT_STATE: Store = {
  conversationsById: {},
  conversationOrder: [],
  settings: { ...DEFAULT_SETTINGS },
};

export interface StoreContextType {
  state: Store;
  isReady: boolean;
  setState: (updater: Partial<Store> | ((prev: Store) => Store)) => void;
  reset: () => void;
}

export const loadState = (): Store => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return { ...DEFAULT_STATE };

    return {
      ...DEFAULT_STATE,
      ...JSON.parse(saved),
    } as Store;
  } catch {
    return { ...DEFAULT_STATE };
  }
};

export const saveState = (state: Store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const resetState = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_STATE };
};

export const StoreContext = createContext<StoreContextType | null>(null);
