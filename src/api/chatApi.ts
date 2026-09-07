import axios from "axios";
import type { ChatRequest, ChatResponse } from "@shared/types";

export async function sendChat(
  request: ChatRequest,
): Promise<ChatResponse | null> {
  const response = await axios.post<ChatResponse | null>("/api/chat", request);

  return response.data;
}

export async function streamChat(
  request: ChatRequest,
): Promise<ReadableStream<Uint8Array>> {
  const response = await axios.post<ReadableStream<Uint8Array>>(
    "/api/chat-stream",
    request,
    {
      adapter: "fetch",
      responseType: "stream",
    },
  );

  return response.data;
}
