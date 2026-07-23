export function GET() {
  if (!process.env.GROQ_API_KEY) {
    console.log("Health check: failed - GROQ_API_KEY env variable is missing.");
    return Response.json("Failed - Missing Groq API Key.");
  }

  console.log("Health check: success");
  return Response.json("Chat API is running.");
}
