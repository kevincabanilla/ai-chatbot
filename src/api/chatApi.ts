import axios from "axios";
import type { ChatRequest, ChatResponse } from "@shared/types";

export async function sendChat(
  request: ChatRequest,
): Promise<ChatResponse | null> {
  const response = await axios.post<ChatResponse | null>("/api/chat", request);

  return response.data;
}
