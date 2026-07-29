import type { ChatMessage } from "../../shared/types/chat.js";

export interface GroqChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    logprobs: object | null;
    finish_reason: string;
  }[];
  usage: {
    queue_time: number;
    prompt_tokens: number;
    prompt_time: number;
    completion_tokens: number;
    completion_time: number;
    total_tokens: number;
    total_time: number;
  };
  system_fingerprint: string;
  x_groq: { id: string };
}

export interface GroqErrorResponse {
  error: {
    message: string; //"Invalid API Key";
    type: string; //"invalid_request_error";
    code: string;
  };
}

export interface GroqGetModelsResponse {
  object: string;
  data: {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    active: boolean;
    context_window: number;
  }[];
}
