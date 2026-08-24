import type { StoreContextType } from "@/contexts/StoreContext";
import { useStore } from "./useStore";

export interface StateManager extends StoreContextType {
  isConverstationExists: (id: string) => boolean;
  deleteConversation: (id: string) => void;
}

export function useStateManager(): StateManager {
  const { state, setState, reset } = useStore();

  const isConverstationExists = (id: string) =>
    state.conversationOrder.some((cid) => cid == id);

  const deleteConversation = (id: string) => {
    setState((prev) => {
      // const { [id]: _, ...conversationsById } = prev.conversationsById;
      return {
        ...prev,
        conversationOrder: prev.conversationOrder.filter((cid) => cid != id),
        conversationsById: Object.fromEntries(
          Object.entries(prev.conversationsById).filter(([key]) => key !== id),
        ),
      };
    });
  };

  return { state, setState, reset, deleteConversation, isConverstationExists };
}
