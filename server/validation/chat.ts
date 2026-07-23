import type { ChatMessage } from "../../shared/types/chat.js";

export class ChatValidationError extends Error {}

export function validateChatMessages(messages: ChatMessage[] | null) {
  if (!messages) {
    throw new ChatValidationError("Messages are required");
  }

  if (!Array.isArray(messages)) {
    throw new ChatValidationError("Messages must be an array");
  }

  if (messages.length === 0) {
    throw new ChatValidationError("Messages cannot be empty");
  }

  if (messages.length > 50) {
    throw new ChatValidationError("Conversation too long");
  }

  return true;
}
