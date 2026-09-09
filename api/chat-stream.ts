import type { ChatRequest } from "../shared/types/chat.js";
import { streamGroqResponse } from "../server/services/groq.js";
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

    const stream = await streamGroqResponse(body);

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof ChatValidationError || error instanceof GroqError) {
      return errorResponse(400, error.message);
    }

    console.error(error);

    return errorResponse(500, "Internal server error");
  }
}
