export type MessageRole = "user" | "system";

export interface ChatCompletionMessage {
  role: MessageRole;
  content: string;
}
