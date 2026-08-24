import type { StoreContextType } from "@/contexts/StoreContext";
import { useStore } from "./useStore";
import type { Conversation, MessageItem } from "@/interfaces";

export interface StateManager extends StoreContextType {
  isConverstationExists: (id: string) => boolean;
  appendMessage: (
    conversationId: string,
    newMessage: MessageItem,
    callback?: () => void,
  ) => void;
  updateLastMessage: (
    conversationId: string,
    updater: (msg: MessageItem) => MessageItem,
  ) => void;
  deleteConversation: (id: string) => void;
}

export function useStateManager(): StateManager {
  const { state, setState, reset } = useStore();

  const isConverstationExists = (id: string) =>
    state.conversationOrder.some((cid) => cid == id);

  const appendMessage = (
    conversationId: string,
    newMessage: MessageItem,
    callback?: () => void,
  ): void => {
    setState((prev) => {
      const currentId = conversationId;
      const currentConversation = !currentId
        ? null
        : prev.conversationsById[currentId];

      // new conversation
      if (!currentConversation) {
        const conversation: Conversation = {
          id: conversationId,
          title: newMessage.content,
          messages: [newMessage],
          mode: state.settings.mode,
          model: state.settings.model,
        };

        return {
          ...prev,
          conversationsById: {
            ...prev.conversationsById,
            [conversation.id]: conversation,
          },
          conversationOrder: [conversation.id, ...prev.conversationOrder],
        };
      }

      // update existing.
      return {
        ...prev,
        conversationsById: {
          ...prev.conversationsById,
          [currentConversation.id]: {
            ...currentConversation,
            messages: [...currentConversation.messages, newMessage],
          },
        },
      };
    });

    callback?.();
    if (import.meta.env.DEV) console.log("message added: ", newMessage);
  };

  const updateLastMessage = (
    conversationId: string,
    updater: (msg: MessageItem) => MessageItem,
  ) => {
    setState((prev) => {
      const conversation: Conversation = prev.conversationsById[conversationId];

      if (/* !conversation || */ conversation.messages.length === 0) {
        return prev;
      }

      const messages = [...conversation.messages];
      const lastIndex = messages.length - 1;

      messages[lastIndex] = updater(messages[lastIndex]);

      if (import.meta.env.DEV)
        console.log("message updated: ", messages[lastIndex]);

      return {
        ...prev,
        conversationsById: {
          ...prev.conversationsById,
          [conversationId]: {
            ...conversation,
            messages,
          },
        },
      };
    });
  };

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

  return {
    state,
    setState,
    reset,
    isConverstationExists,
    appendMessage,
    updateLastMessage,
    deleteConversation,
  };
}
