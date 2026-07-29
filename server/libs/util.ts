export function errorResponse(status: number, message: string) {
  return Response.json({ error: message, status });
}
