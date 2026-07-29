export const GroqErrorCode = {
  // Authentication
  INVALID_API_KEY: "invalid_api_key", // 401

  // Request validation
  MODEL_NOT_FOUND: "model_not_found", // 404
  CONTEXT_LENGTH_EXCEEDED: "context_length_exceeded",
  INVALID_MODEL: "invalid_model",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",

  // Server errors
  INTERNAL_SERVER_ERROR: "internal_server_error",
  SERVICE_UNAVAILABLE: "service_unavailable",
  API_ERROR: "api_error",

  // Request lifecycle
  REQUEST_TIMEOUT: "request_timeout",

  // Fallback
  UNKNOWN_ERROR: "unknown_error",
} as const;

export type GroqErrorCode = (typeof GroqErrorCode)[keyof typeof GroqErrorCode];
