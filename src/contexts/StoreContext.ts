import type { MessageItem } from "@/components";
import { createContext } from "react";

const STORAGE_KEY = "app-store";

export interface Store {
  messages: MessageItem[];
}

export interface StoreContextType {
  state: Store;
  setState: (updates: Partial<Store>) => void;
  reset: () => void;
}

const defaultState: Store = {
  messages: [],
};

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
