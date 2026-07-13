export const AI_MODELS = {
  GROQ_CHAT: "llama-3.3-70b-versatile",
} as const;

export type AIModel = (typeof AI_MODELS)[keyof typeof AI_MODELS];
