import type { ChatRole } from "@shared/types";

export interface MessageItem {
  conversationId: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  failed?: boolean | null;
}

export interface Conversation {
  id: string;
  title: string;
  messages: MessageItem[];
  mode?: string | null;
  model?: string | null;
}
