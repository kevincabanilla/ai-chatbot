import axios from "axios";
import {
  type GroqGetModelsResponse,
  type GroqChatCompletionResponse,
} from "../types/groq.js";
import type { ChatMessage, ChatRequest } from "../../shared/types/chat.js";
import type { AiModel } from "../../shared/types/model.js";
import { handleGroqError } from "../handlers/groq.js";
import { type AISkill } from "../../shared/ai/skills.js";
import aiSkills from "../data/skills.json";

const {
  VITE_DEFAULT_AI_MODEL,
  GROQ_API_KEY,
  GROQ_MAX_TOKENS,
  GROQ_CHAT_TEMPERATURE,
} = process.env;

const groqClient = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function generateGroqResponse(
  request: ChatRequest,
): Promise<ChatMessage> {
  const skill = (
    !request.skill || !Object.keys(aiSkills).some((key) => key == request.skill)
      ? "GENERAL"
      : request.skill
  ) as AISkill;

  const messages = [
    {
      role: "system",
      content: JSON.stringify(aiSkills[skill]),
    } as ChatMessage,
    ...request.messages,
  ];

  try {
    const response = await groqClient.post<GroqChatCompletionResponse>(
      "/chat/completions",
      {
        model: request.model ?? VITE_DEFAULT_AI_MODEL ?? "groq/compound",
        temperature: Number(GROQ_CHAT_TEMPERATURE) || 1,
        max_tokens: Number(GROQ_MAX_TOKENS) || 2048,
        messages,
      },
    );

    return response.data.choices[0].message;
  } catch (err) {
    handleGroqError(err);
  }
}

export async function getGroqModels(): Promise<AiModel[]> {
  try {
    const response = await groqClient.get<GroqGetModelsResponse>("/models");

    const models: AiModel[] = response.data.data
      .filter((x) => x.active)
      .map((x) => ({
        id: x.id,
        ownedBy: x.owned_by,
        created: x.created,
      }));

    return models;
  } catch (err) {
    handleGroqError(err);
  }
}
