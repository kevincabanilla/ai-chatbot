import type { ChatRole } from "@/shared/types";

export interface MessageItem {
  role: ChatRole;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: MessageItem[];
}
