import axios from "axios";
import { AI_MODELS } from "../ai/models.js";
import { type GroqResponse } from "../types/groq.js";
import type { ChatMessage } from "../../shared/types/chat.js";
import { handleGroqError } from "../handlers/groq.js";

const groqClient = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function generateGroqResponse(
  messages: ChatMessage[],
): Promise<ChatMessage> {
  try {
    const response = await groqClient.post<GroqResponse>("/chat/completions", {
      model: AI_MODELS.GROQ_CHAT,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.data.choices[0].message;
  } catch (err) {
    handleGroqError(err);
  }
}
