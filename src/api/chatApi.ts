import axios from "axios";
import type { ChatMessage, ChatResponse } from "@/shared/types";

export async function sendChat(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await axios.post<ChatResponse>("/api/chat", {
    messages,
  });

  return response.data;
}
