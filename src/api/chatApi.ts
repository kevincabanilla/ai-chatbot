import axios from "axios";
import type { ChatMessage, ChatResponse } from "@shared/types";

export async function sendChat(
  messages: ChatMessage[],
): Promise<ChatResponse | null> {
  const response = await axios.post<ChatResponse | null>("/api/chat", {
    messages,
  });

  return response.data;
}
