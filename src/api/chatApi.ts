import axios from "axios";
import type { ChatRequest, ChatResponse } from "@shared/types";

function getErrorMessage(err: unknown, defaultMessage: string) {
  return axios.isAxiosError(err)
    ? ((err.response?.data as { error?: string }).error ?? defaultMessage)
    : err instanceof Error
      ? err.message
      : defaultMessage;
}

export async function sendChat(
  request: ChatRequest,
): Promise<ChatResponse | null> {
  try {
    const response = await axios.post<ChatResponse | null>(
      "/api/chat",
      request,
    );

    return response.data;
  } catch (err) {
    throw new Error(
      getErrorMessage(err, "An error occurred while sending chat message"),
      { cause: err },
    );
  }
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
