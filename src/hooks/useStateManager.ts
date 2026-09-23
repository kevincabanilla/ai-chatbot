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
  updateMessage: (
    messageId: string,
    conversationId: string,
    updater: (msg: MessageItem) => MessageItem,
  ) => void;
  deleteMessage: (messageId: string, conversationId: string) => void;
  getConversation: (id?: string | null) => Conversation | null;
  updateConversation: (
    id: string,
    updater: (msg: Conversation) => Conversation,
  ) => void;
  deleteConversation: (id: string) => void;
  moveConversationToTop: (id: string) => void;
  branchOutToNewConversation: (
    conversationId: string,
    messageId: string,
  ) => string;
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
          title: "New Conversation",
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

  const updateMessage = (
    messageId: string,
    conversationId: string,
    updater: (msg: MessageItem) => MessageItem,
  ) => {
    setState((prev) => {
      const conversation = !conversationId
        ? null
        : prev.conversationsById[conversationId];

      if (!conversation || conversation.messages.length === 0) {
        return prev;
      }

      const messageIndex = conversation.messages.findIndex(
        (x) => x.messageId === messageId,
      );

      // Message not found
      if (messageIndex === -1) {
        return prev;
      }

      const messages = [...conversation.messages];
      const message = messages[messageIndex];

      messages[messageIndex] = {
        ...message,
        ...updater({ ...message }),
      };

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

  const deleteMessage = (messageId: string, conversationId: string) => {
    setState((prev) => {
      const conversation = !conversationId
        ? null
        : prev.conversationsById[conversationId];

      if (!conversation || conversation.messages.length === 0) {
        return prev;
      }

      const filteredMessages = conversation.messages.filter(
        (x) => x.messageId !== messageId,
      );

      return {
        ...prev,
        conversationsById: {
          ...prev.conversationsById,
          [conversationId]: {
            ...conversation,
            messages: [...filteredMessages],
          },
        },
      };
    });
  };

  const getConversation = (conversationId?: string | null) => {
    const conversation: Conversation | null = !conversationId
      ? null
      : state.conversationsById[conversationId];
    return conversation;
  };

  const updateConversation = (
    conversationId: string,
    updater: (msg: Conversation) => Conversation,
  ) => {
    setState((prev) => {
      const conversation = !conversationId
        ? null
        : prev.conversationsById[conversationId];

      if (!conversation) {
        return prev;
      }

      return {
        ...prev,
        conversationsById: {
          ...prev.conversationsById,
          [conversationId]: {
            ...conversation,
            ...updater({ ...conversation }),
          },
        },
      };
    });
  };

  const deleteConversation = (id: string) => {
    setState((prev) => {
      return {
        ...prev,
        conversationOrder: prev.conversationOrder.filter((cid) => cid != id),
        conversationsById: Object.fromEntries(
          Object.entries(prev.conversationsById).filter(([key]) => key !== id),
        ),
      };
    });
  };

  const moveConversationToTop = (id: string) => {
    const { conversationOrder } = state;
    if (conversationOrder.includes(id) && conversationOrder[0] !== id) {
      setState((prev) => {
        const newOrder = [
          id,
          ...prev.conversationOrder.filter((cid) => cid !== id),
        ];
        return {
          ...prev,
          conversationOrder: newOrder,
        };
      });
    }
  };

  const branchOutToNewConversation = (
    conversationId: string,
    messageId: string,
  ) => {
    const newConversationId = crypto.randomUUID();

    setState((prev) => {
      const selectedConversation = state.conversationsById[conversationId];

      const msgIdx = selectedConversation.messages.findIndex(
        (msg) => msg.messageId === messageId,
      );

      const messages = msgIdx === -1 ? [] : [...selectedConversation.messages];

      // remove the messages after the selected message id.
      if (messages.length > msgIdx) messages.splice(msgIdx + 1);

      const conversation: Conversation = {
        ...selectedConversation,
        id: newConversationId,
        title: `Branch · ${selectedConversation.title}`,
        messages,
        branchedOutFrom: {
          conversationId,
          messageId,
        },
        hasError: false,
        errorMessage: null,
      };

      return {
        ...prev,
        conversationsById: {
          ...prev.conversationsById,
          [conversation.id]: conversation,
        },
        conversationOrder: [conversation.id, ...prev.conversationOrder],
      };
    });

    return newConversationId;
  };

  return {
    state,
    setState,
    reset,
    isConverstationExists,
    appendMessage,
    updateMessage,
    deleteMessage,
    getConversation,
    updateConversation,
    deleteConversation,
    moveConversationToTop,
    branchOutToNewConversation,
  };
}
