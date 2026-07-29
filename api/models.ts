import { getGroqModels } from "../server/services/groq.js";
import { GroqError } from "../server/handlers/groq.js";
import { errorResponse } from "../server/libs/util.js";
import type { GetModelsResponse } from "../shared/types/model.js";

export async function GET() {
  try {
    const models = await getGroqModels();
    const response: GetModelsResponse = {
      models,
    };
    return Response.json(response);
  } catch (error) {
    if (error instanceof GroqError) {
      return errorResponse(400, error.message);
    }

    console.error(error);

    return errorResponse(500, "Internal server error");
  }
}
