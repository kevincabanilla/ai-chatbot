export type ChatRole = "user" | "system" | "developer" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  reasoning?: string | null;
}

export interface ChatRequest {
  model?: string;
  skill?: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message?: ChatMessage;
  error?: string;
  status?: number;
}
