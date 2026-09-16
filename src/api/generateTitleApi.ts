import axios from "axios";
import type { GenerateTitleRequest } from "@shared/types";

export async function generateTitle(
  request: GenerateTitleRequest,
): Promise<string> {
  try {
    const response = await axios.post<{ title: string }>(
      "/api/generate-title",
      request,
    );

    return response.data.title;
  } catch {
    return request.message;
  }
}
