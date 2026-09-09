import useSWRMutation from "swr/mutation";
import type { ChatRequest } from "@shared/types";
import { streamChat } from "@/api/chatApi";

export function useChatStream() {
  const { trigger, isMutating } = useSWRMutation<
    ReadableStream<Uint8Array>, // Response type
    Error, // Error type
    string, // SWR key type
    ChatRequest // Argument passed to trigger()
  >("chat", (_, { arg }) => streamChat(arg));

  const streamMessage = async (
    request: ChatRequest,
    onUpdateContent: (content: string) => void,
  ) => {
    const stream = await trigger(request);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let doneReading = false;

    const processLine = (line: string) => {
      const data = line.trim();

      if (!data.startsWith("data:")) return;

      const payload = data.slice("data:".length).trim();

      if (payload === "[DONE]") return;

      try {
        const chunk = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const content = chunk.choices?.[0]?.delta?.content;

        if (content) onUpdateContent(content);
      } catch (error) {
        console.error("Invalid stream chunk", error);
      }
    };

    while (!doneReading) {
      const { done, value } = await reader.read();

      doneReading = done;

      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      lines.forEach(processLine);

      if (done) {
        processLine(buffer);
        break;
      }
    }
  };

  return { streamMessage, isLoading: isMutating };
}
