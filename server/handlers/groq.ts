import axios from "axios";
import { type GroqErrorResponse } from "../types/groq.js";

export class GroqError extends Error {}

export function handleGroqError(error: unknown): never {
  if (!axios.isAxiosError(error)) {
    throw error;
  }

  if (!error.response) {
    console.error(`Network error: ${error.message}`);
    throw new GroqError(
      "Network error. Please check your internet connection.",
    );
  }

  const status = error.response.status;
  const { error: groqError } = error.response.data as GroqErrorResponse;

  console.error(error);

  switch (status) {
    case 400:
      throw new GroqError(groqError.message || "Invalid request.");

    case 401:
      throw new GroqError("Invalid Groq API key.");

    case 404:
      throw new GroqError("Requested model was not found.");

    case 429:
      throw new GroqError("Rate limit exceeded. Please try again later.");

    case 500:
    case 502:
    case 503:
    case 504:
      throw new GroqError("Groq service is temporarily unavailable.");

    default:
      throw new GroqError(groqError.message || "Unknown Groq API error.");
  }
}
