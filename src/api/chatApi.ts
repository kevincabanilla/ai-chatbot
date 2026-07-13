import { groq } from "./groq";
import type { ChatCompletionMessage, ChatCompletionResponse } from "@/models";

export async function chatCompletion(messages: ChatCompletionMessage[]) {
  const response = await groq
    .post("/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
    })
    .then((res) => res.data as ChatCompletionResponse);

  return response.choices.map(x => x.message);
}
