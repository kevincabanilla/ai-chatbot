import { useMemo } from "react";
import { getMatchPreview, getMessageDate } from "@/libs/utils";
import { useStore } from "./useStore";
import type { Conversation, MessageItem } from "@/interfaces";

export type SearchInType = "all" | "current";

export interface SearchConversationFilters {
  currentConversationId?: string | null;
  searchIn?: SearchInType;
}

export interface SearchConversationResult {
  conversation: Conversation;
  message: MessageItem;
  preview: {
    before: string;
    match: string;
    after: string;
  };
  date: Date | null;
}

export function useSearchConversations(
  searchQuery: string,
  filters: SearchConversationFilters,
) {
  const { state } = useStore();

  const { currentConversationId, searchIn = "all" } = filters;

  const results = useMemo<SearchConversationResult[]>(() => {
    if (!searchQuery) return [];

    const source =
      searchIn === "current" && currentConversationId
        ? [
            state.conversationOrder.find(
              (id) => id === currentConversationId,
            ) ?? "",
          ]
        : state.conversationOrder;

    return source.flatMap((conversationId) => {
      const conversation = state.conversationsById[conversationId];

      return conversation.messages.flatMap((message) => {
        if (!message.messageId) return [];
        const preview = getMatchPreview(message.content, searchQuery);
        return preview
          ? [
              {
                conversation,
                message,
                preview,
                date: getMessageDate(message),
              },
            ]
          : [];
      });
    });
  }, [
    currentConversationId,
    searchIn,
    searchQuery,
    state.conversationOrder,
    state.conversationsById,
  ]);

  return results;
}
