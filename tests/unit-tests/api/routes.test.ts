/** @jest-environment node */

jest.mock("../../../server/services/groq.js", () => ({
  generateGroqResponse: jest.fn(),
  streamGroqResponse: jest.fn(),
  generateTitle: jest.fn(),
  getGroqModels: jest.fn(),
}));

import { POST as postChat } from "../../../api/chat";
import { POST as postChatStream } from "../../../api/chat-stream";
import { POST as postTitle } from "../../../api/generate-title";
import { GET as getModels } from "../../../api/models";
import { GET as healthcheck } from "../../../api/healthcheck";
import {
  generateGroqResponse,
  generateTitle,
  getGroqModels,
  streamGroqResponse,
} from "../../../server/services/groq.js";
import { GroqError } from "../../../server/handlers/groq.js";
import type { ChatMessage } from "../../../shared/types/chat";

const mockedGenerateResponse = jest.mocked(generateGroqResponse);
const mockedStreamResponse = jest.mocked(streamGroqResponse);
const mockedGenerateTitle = jest.mocked(generateTitle);
const mockedGetModels = jest.mocked(getGroqModels);
const userMessage: ChatMessage = { role: "user", content: "Hello" };

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("chat routes", () => {
  it("returns the generated assistant message", async () => {
    const reply = { role: "assistant" as const, content: "Hi there" };
    mockedGenerateResponse.mockResolvedValueOnce(reply);

    const response = await postChat(jsonRequest({ messages: [userMessage] }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: reply });
    expect(mockedGenerateResponse).toHaveBeenCalledWith({ messages: [userMessage] });
  });

  it("rejects malformed JSON and invalid message lists without calling Groq", async () => {
    const malformed = new Request("http://localhost/api/chat", {
      method: "POST",
      body: "{",
    });
    const badJsonResponse = await postChat(malformed);
    const invalidMessagesResponse = await postChat(jsonRequest({ messages: [] }));

    expect(badJsonResponse.status).toBe(400);
    await expect(badJsonResponse.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(invalidMessagesResponse.status).toBe(400);
    await expect(invalidMessagesResponse.json()).resolves.toEqual({ error: "Messages cannot be empty" });
    expect(mockedGenerateResponse).not.toHaveBeenCalled();
  });

  it("maps known service failures to 400 and unknown failures to 500", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockedGenerateResponse.mockRejectedValueOnce(new GroqError("Invalid model"));
    mockedGenerateResponse.mockRejectedValueOnce(new Error("unexpected"));

    const knownError = await postChat(jsonRequest({ messages: [userMessage] }));
    const unknownError = await postChat(jsonRequest({ messages: [userMessage] }));

    expect(knownError.status).toBe(400);
    await expect(knownError.json()).resolves.toEqual({ error: "Invalid model" });
    expect(unknownError.status).toBe(500);
    await expect(unknownError.json()).resolves.toEqual({ error: "Internal server error" });
    errorSpy.mockRestore();
  });

  it("returns the title and validates required title input", async () => {
    mockedGenerateTitle.mockResolvedValueOnce("A useful title");

    const response = await postTitle(jsonRequest({ message: "Summarize this chat" }));
    const invalid = await postTitle(jsonRequest({ message: "" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ title: "A useful title" });
    expect(invalid.status).toBe(400);
    await expect(invalid.json()).resolves.toEqual({ error: "Message is required." });
  });

  it("streams response bytes with event-stream headers", async () => {
    const bytes = new TextEncoder().encode("data: hello\n\n");
    mockedStreamResponse.mockResolvedValueOnce(
      new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }),
    );

    const response = await postChatStream(jsonRequest({ messages: [userMessage] }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream; charset=utf-8");
    expect(response.headers.get("Cache-Control")).toBe("no-cache, no-transform");
    await expect(response.text()).resolves.toBe("data: hello\n\n");
  });

  it("returns active models from the models route", async () => {
    mockedGetModels.mockResolvedValueOnce([{ id: "model-1", ownedBy: "vendor", created: 1 }]);

    const response = await getModels();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      models: [{ id: "model-1", ownedBy: "vendor", created: 1 }],
    });
  });

  it("reports API health based on the Groq key", async () => {
    const previousKey = process.env.GROQ_API_KEY;
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

    delete process.env.GROQ_API_KEY;
    const failed = healthcheck();
    process.env.GROQ_API_KEY = "test-key";
    const success = healthcheck();

    await expect(failed.json()).resolves.toBe("Failed - Missing Groq API Key.");
    await expect(success.json()).resolves.toBe("Chat API is running.");
    if (previousKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = previousKey;
    logSpy.mockRestore();
  });
});
