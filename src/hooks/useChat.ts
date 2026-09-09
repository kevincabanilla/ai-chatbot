import useSWRMutation from "swr/mutation";
import type { ChatMessage, ChatRequest } from "@shared/types";
import { sendChat } from "@/api/chatApi";

export function useChat() {
  const { trigger, isMutating } = useSWRMutation(
    "chat",
    (_, { arg }: { arg: ChatRequest }) => sendChat(arg),
  );

  const sendChatMessage = async (
    request: ChatRequest,
    onUpdateContent: (content: ChatMessage) => void,
  ) => {
    const response = await trigger(request);

    const content = response?.message;

    if (content) onUpdateContent(content);
  };

  return { sendChatMessage, isMutating };
}
