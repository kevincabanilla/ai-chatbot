import type { GenerateTitleRequest } from "../shared/types/chat.js";
import { generateTitle } from "../server/services/groq.js";
import { ChatValidationError } from "../server/validation/chat.js";
import { GroqError } from "../server/handlers/groq.js";
import { errorResponse } from "../server/libs/util.js";

export async function POST(request: Request) {
  let body: GenerateTitleRequest;

  try {
    body = (await request.json()) as GenerateTitleRequest;
  } catch {
    return errorResponse(400, "Invalid JSON body");
  }

  try {
    if (!body.message) throw new ChatValidationError("Message is required.");

    const title = await generateTitle(body);

    return Response.json({
      title,
    });
  } catch (error) {
    if (error instanceof ChatValidationError || error instanceof GroqError) {
      return errorResponse(400, error.message);
    }

    console.error(error);

    return errorResponse(500, "Internal server error");
  }
}
