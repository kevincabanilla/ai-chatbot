jest.mock("axios", () => {
  const client = { get: jest.fn(), post: jest.fn() };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => client),
      isAxiosError: jest.fn(),
    },
    __client: client,
  };
});

import { generateGroqResponse, generateTitle, getGroqModels, streamGroqResponse } from "../../../server/services/groq";
import type { ChatMessage } from "../../../shared/types/chat";

const client = (jest.requireMock("axios") as { __client: { get: jest.Mock; post: jest.Mock } }).__client;
const userMessage: ChatMessage = { role: "user", content: "Help me" };

describe("Groq service", () => {
  it("adds the selected skill instructions and preserves request messages", async () => {
    const reply = { role: "assistant" as const, content: "Done" };
    client.post.mockResolvedValueOnce({ data: { choices: [{ message: reply }] } });

    await expect(
      generateGroqResponse({ model: "test-model", skill: "CODING", messages: [userMessage] }),
    ).resolves.toEqual(reply);

    const [path, payload] = client.post.mock.calls[0];
    expect(path).toBe("/chat/completions");
    expect(payload.model).toBe("test-model");
    expect(payload.messages).toHaveLength(2);
    expect(payload.messages[0].role).toBe("system");
    expect(JSON.parse(payload.messages[0].content)).toEqual(expect.objectContaining({}));
    expect(payload.messages[1]).toEqual(userMessage);
  });

  it("falls back to the general skill and default model when omitted", async () => {
    client.post.mockResolvedValueOnce({
      data: { choices: [{ message: { role: "assistant", content: "Answer" } }] },
    });

    await generateGroqResponse({ messages: [userMessage], skill: "unknown" });

    const [, payload] = client.post.mock.calls[0];
    expect(payload.model).toBe(process.env.VITE_DEFAULT_AI_MODEL ?? "groq/compound");
    expect(payload.messages[0].role).toBe("system");
    expect(payload.messages[1]).toEqual(userMessage);
  });

  it("filters inactive models and maps provider model fields", async () => {
    client.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: "active", owned_by: "owner", created: 123, active: true },
          { id: "inactive", owned_by: "owner", created: 456, active: false },
        ],
      },
    });

    await expect(getGroqModels()).resolves.toEqual([
      { id: "active", ownedBy: "owner", created: 123 },
    ]);
    expect(client.get).toHaveBeenCalledWith("/models");
  });

  it("streams upstream chunks and enables streaming on the provider request", async () => {
    const chunks = [new TextEncoder().encode("one"), new TextEncoder().encode("two")];
    client.post.mockResolvedValueOnce({
      data: {
        async *[Symbol.asyncIterator]() {
          yield* chunks;
        },
      },
    });

    const stream = await streamGroqResponse({ messages: [userMessage] });
    const reader = stream.getReader();
    const first = await reader.read();
    const second = await reader.read();
    const done = await reader.read();

    expect(new TextDecoder().decode(first.value)).toBe("one");
    expect(new TextDecoder().decode(second.value)).toBe("two");
    expect(done.done).toBe(true);
    expect(client.post.mock.calls[0][1].stream).toBe(true);
    expect(client.post.mock.calls[0][2].responseType).toBe("stream");
  });

  it("generates a title with the dedicated model and returns message content", async () => {
    client.post.mockResolvedValueOnce({
      data: { choices: [{ message: { role: "assistant", content: "Chat title" } }] },
    });

    await expect(generateTitle({ message: "A long discussion" })).resolves.toBe("Chat title");

    const [, payload] = client.post.mock.calls[0];
    expect(payload.model).toBe("openai/gpt-oss-20b");
    expect(payload.messages[1]).toEqual({ role: "user", content: "A long discussion" });
  });
});
