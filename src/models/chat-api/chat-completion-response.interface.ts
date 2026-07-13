import type { ChatCompletionMessage } from "./chat-completion-message.interface";

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      index: number;
      message: ChatCompletionMessage;
      logprobs: object | null;
      finish_reason: string;
    },
  ];
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
