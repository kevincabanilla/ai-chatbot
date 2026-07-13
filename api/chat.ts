import type { ChatRequest, ChatResponse } from "@/shared/types";
import { generateGroqResponse } from "../server/services";
import {
  ChatValidationError,
  validateChatMessages,
} from "../server/validation/chat";

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch (error) {
    console.error(error);
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
    console.error(error);

    if (error instanceof ChatValidationError) {
      return errorResponse(400, error.message);
    }

    return errorResponse(500, "Internal server error");
  }
}

export function errorResponse(status: number, message: string) {
  return Response.json({ error: message, status });
}
