import type { ChatCompletionMessage } from "./chat-completion-message.interface";

export interface ChatCompletionRequest {
  model: string;
  messages: ChatCompletionMessage[];
  temperature: number | null;
}
