import type { ChatCompletionMessage } from "./chat-api";

export interface MessageItem extends ChatCompletionMessage {
  visible: boolean;
  timestamp: number;
}
