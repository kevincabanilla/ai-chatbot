jest.mock("axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    isAxiosError: (error: unknown) => Boolean(error && typeof error === "object" && "isAxiosError" in error),
  },
}));

import axios from "axios";
import { sendChat, streamChat } from "../../../src/api/chatApi";
import type { ChatRequest } from "../../../shared/types/chat";

const mockedPost = jest.mocked(axios.post);
const request: ChatRequest = { messages: [{ role: "user", content: "Hello" }] };

describe("chat API client", () => {
  it("returns the chat response data", async () => {
    const response = { message: { role: "assistant" as const, content: "Hi" } };
    mockedPost.mockResolvedValueOnce({ data: response } as never);

    await expect(sendChat(request)).resolves.toEqual(response);
    expect(mockedPost).toHaveBeenCalledWith("/api/chat", request);
  });

  it("uses server error text for Axios failures", async () => {
    const error = Object.assign(new Error("Request failed"), {
      isAxiosError: true,
      response: { data: { error: "Invalid model" } },
    });
    mockedPost.mockRejectedValueOnce(error);

    await expect(sendChat(request)).rejects.toMatchObject({
      message: "Invalid model",
      cause: error,
    });
  });

  it("preserves ordinary error messages and uses the fallback for unknown errors", async () => {
    mockedPost.mockRejectedValueOnce(new Error("offline"));
    mockedPost.mockRejectedValueOnce("failure");

    await expect(sendChat(request)).rejects.toThrow("offline");
    await expect(sendChat(request)).rejects.toThrow(
      "An error occurred while sending chat message",
    );
  });

  it("requests chat streaming through the fetch adapter", async () => {
    const stream = new ReadableStream<Uint8Array>();
    mockedPost.mockResolvedValueOnce({ data: stream } as never);

    await expect(streamChat(request)).resolves.toBe(stream);
    expect(mockedPost).toHaveBeenCalledWith("/api/chat-stream", request, {
      adapter: "fetch",
      responseType: "stream",
    });
  });
});
