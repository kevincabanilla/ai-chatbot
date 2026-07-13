import axios from "axios";
import type { ChatMessage } from "@/shared/types";

export async function sendChat(messages: ChatMessage[]): Promise<ChatMessage> {
  const response = await axios.post<ChatMessage>("/api/chat", {
    messages,
  });

  return response.data;
}
