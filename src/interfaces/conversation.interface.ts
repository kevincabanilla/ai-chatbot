import type { ChatRole } from "@shared/types";

export interface MessageItem {
  messageId: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  /** @deprecated Use the `hasError` flag in conversation level instead. */
  failed?: boolean | null;
}

export interface Conversation {
  id: string;
  title: string;
  messages: MessageItem[];
  mode?: string | null;
  model?: string | null;
  hasUnread?: boolean | null;
  hasError?: boolean | null;
  errorMessage?: string | null;
}
