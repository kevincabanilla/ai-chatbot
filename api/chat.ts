import type { ChatRequest, ChatResponse } from "../shared/types/chat.js";
import { generateGroqResponse } from "../server/services/groq.js";
import {
  ChatValidationError,
  validateChatMessages,
} from "../server/validation/chat.js";
import { GroqError } from "../server/handlers/groq.js";
import { errorResponse } from "../server/libs/util.js";

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return errorResponse(400, "Invalid JSON body");
  }

  try {
    validateChatMessages(body.messages);

    const reply = await generateGroqResponse(body.messages);

    const response: ChatResponse = {
      message: reply,
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof ChatValidationError || error instanceof GroqError) {
      return errorResponse(400, error.message);
    }

    console.error(error);

    return errorResponse(500, "Internal server error");
  }
}
