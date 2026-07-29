export type ChatRole = "user" | "system" | "developer" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message?: ChatMessage;
  error?: string;
  status?: number;
}
