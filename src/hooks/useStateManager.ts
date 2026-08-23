import type { StoreContextType } from "@/contexts/StoreContext";
import { useStore } from "./useStore";

export interface StateManager extends StoreContextType {
  deleteConversation: (id: string) => void;
}

export function useStateManager(): StateManager {
  const { state, setState, reset } = useStore();

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

  return { state, setState, reset, deleteConversation };
}
