import { handleGroqError, GroqError } from "../../../server/handlers/groq";

const axiosError = (status: number, message = "Provider detail") =>
  Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status, data: { error: { message } } },
  });

describe("handleGroqError", () => {
  it("converts network failures into a connection message", () => {
    const error = Object.assign(new Error("offline"), { isAxiosError: true });
    const logSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => handleGroqError(error)).toThrow(
      new GroqError("Network error. Please check your internet connection."),
    );
    logSpy.mockRestore();
  });

  it.each([
    [400, "Provider detail"],
    [401, "Invalid Groq API key."],
    [404, "Requested model was not found."],
    [429, "Rate limit exceeded. Please try again later."],
    [500, "Groq service is temporarily unavailable."],
    [502, "Groq service is temporarily unavailable."],
    [503, "Groq service is temporarily unavailable."],
    [504, "Groq service is temporarily unavailable."],
    [418, "Provider detail"],
  ])("maps provider status %i", (status, expectedMessage) => {
    const logSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => handleGroqError(axiosError(status as number))).toThrow(
      new GroqError(expectedMessage as string),
    );
    logSpy.mockRestore();
  });

  it("rethrows non-Axios errors unchanged", () => {
    const error = new TypeError("programming error");

    expect(() => handleGroqError(error)).toThrow(error);
  });
});
