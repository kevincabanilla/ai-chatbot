import { useEffect, useMemo, useState } from "react";
import {
  loadState,
  resetState,
  saveState,
  StoreContext,
  type Store,
  type StoreContextType,
} from "@/contexts/StoreContext";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<Store>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<StoreContextType>(
    () => ({
      state,

      setState: (updater) => {
        setState((prev) => {
          if (typeof updater === "function") {
            return updater(prev);
          }

          return {
            ...prev,
            ...updater,
          };
        });
      },

      reset: () => {
        setState(resetState());
      },
    }),
    [state],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
