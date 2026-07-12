export type MessageSource = "User" | "AI";

export interface MessageItem {
  content: string;
  source: MessageSource;
  timestamp: number;
}
