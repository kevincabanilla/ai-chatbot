import {
  ChatValidationError,
  validateChatMessages,
} from "../../../server/validation/chat";
import type { ChatMessage } from "../../../shared/types/chat";

const validMessage: ChatMessage = { role: "user", content: "Hello" };

describe("validateChatMessages", () => {
  it("accepts message lists within the 100-message limit", () => {
    expect(validateChatMessages([validMessage])).toBe(true);
    expect(
      validateChatMessages(Array.from({ length: 100 }, () => validMessage)),
    ).toBe(true);
  });

  it.each([
    [null, "Messages are required"],
    [[], "Messages cannot be empty"],
    [Array.from({ length: 101 }, () => validMessage), "Conversation too long"],
  ])("rejects invalid message lists", (messages, errorMessage) => {
    expect(() => validateChatMessages(messages as ChatMessage[] | null)).toThrow(
      new ChatValidationError(errorMessage as string),
    );
  });

  it("rejects a non-array value", () => {
    expect(() => validateChatMessages({} as ChatMessage[])).toThrow(
      "Messages must be an array",
    );
  });
});
