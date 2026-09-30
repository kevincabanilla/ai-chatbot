import { useState } from "react";
import { act, renderHook } from "@testing-library/react";
import {
  DEFAULT_SETTINGS,
  loadState,
  resetState,
  saveState,
  StoreContext,
  type Store,
  type StoreContextType,
} from "../../../src/contexts/StoreContext";
import { useStateManager } from "../../../src/hooks/useStateManager";
import type { Conversation, MessageItem } from "../../../src/interfaces";

const firstMessage: MessageItem = {
  messageId: "message-1",
  conversationId: "conversation-1",
  role: "user",
  content: "First",
  dateCreated: "2026-01-01T00:00:00.000Z",
};
const secondMessage: MessageItem = {
  ...firstMessage,
  messageId: "message-2",
  role: "assistant",
  content: "Second",
};
const firstConversation: Conversation = {
  id: "conversation-1",
  title: "First chat",
  messages: [firstMessage, secondMessage],
};
const secondConversation: Conversation = {
  id: "conversation-2",
  title: "Second chat",
  messages: [],
};

const initialState: Store = {
  conversationsById: {
    [firstConversation.id]: firstConversation,
    [secondConversation.id]: secondConversation,
  },
  conversationOrder: [firstConversation.id, secondConversation.id],
  settings: { ...DEFAULT_SETTINGS, mode: "CODING", model: "model-1" },
};

function useManager(initial: Store = initialState) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState(initial);
    const value: StoreContextType = {
      state,
      isReady: true,
      loadingConversationId: "",
      setState: (updater) => {
        setState((previous) =>
          typeof updater === "function" ? updater(previous) : { ...previous, ...updater },
        );
      },
      reset: () => {
        setState(initial);
      },
      setLoadingConversationId: jest.fn(),
    };
    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
  };
  const useManagerHook = () => useStateManager();
  return renderHook(useManagerHook, { wrapper: Wrapper });
}

describe("store persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads defaults when there is no saved state", () => {
    expect(loadState()).toEqual({
      conversationsById: {},
      conversationOrder: [],
      settings: DEFAULT_SETTINGS,
    });
  });

  it("merges persisted values over defaults and recovers from malformed JSON", () => {
    localStorage.setItem("app-store", JSON.stringify({ conversationOrder: ["c1"] }));
    expect(loadState()).toMatchObject({ conversationOrder: ["c1"], conversationsById: {} });

    localStorage.setItem("app-store", "{");
    expect(loadState().conversationOrder).toEqual([]);
  });

  it("saves and resets the app state", () => {
    saveState(initialState);
    expect(JSON.parse(localStorage.getItem("app-store") ?? "null")).toEqual(initialState);
    expect(resetState().conversationOrder).toEqual([]);
    expect(localStorage.getItem("app-store")).toBeNull();
  });
});

describe("conversation state manager", () => {
  it("creates conversations, appends messages, and calls append callbacks", () => {
    const { result } = useManager();
    const callback = jest.fn();
    const newMessage = { ...firstMessage, messageId: "message-3", conversationId: "new-chat" };

    act(() => {
      result.current.appendMessage("new-chat", newMessage, callback);
    });
    act(() => {
      result.current.appendMessage("conversation-1", secondMessage);
    });

    expect(result.current.state.conversationOrder[0]).toBe("new-chat");
    expect(result.current.state.conversationsById["new-chat"]).toMatchObject({
      title: "New Conversation",
      mode: "CODING",
      model: "model-1",
    });
    expect(result.current.getConversation("conversation-1")?.messages).toHaveLength(3);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("updates and deletes messages without mutating the prior message", () => {
    const { result } = useManager();

    act(() => {
      result.current.updateMessage("message-1", "conversation-1", (message) => ({
        ...message,
        content: "Updated",
      }));
    });
    act(() => {
      result.current.deleteMessage("message-2", "conversation-1");
    });

    expect(result.current.state.conversationsById["conversation-1"].messages).toEqual([
      { ...firstMessage, content: "Updated" },
    ]);
    expect(firstMessage.content).toBe("First");
  });

  it("moves, deletes, clears, and looks up conversations", () => {
    const { result } = useManager();

    act(() => {
      result.current.moveConversationToTop("conversation-2");
    });
    expect(result.current.state.conversationOrder).toEqual(["conversation-2", "conversation-1"]);
    expect(result.current.isConversationExists("conversation-1")).toBe(true);
    expect(result.current.getConversation("missing")).toBeUndefined();

    act(() => {
      result.current.deleteConversation("conversation-2");
    });
    expect(result.current.state.conversationOrder).toEqual(["conversation-1"]);
    act(() => {
      result.current.clearConversations();
    });
    expect(result.current.state.conversationsById).toEqual({});
  });

  it("branches through the selected message and records the source location", () => {
    const { result } = useManager();
    const branchIdValue = "00000000-0000-0000-0000-000000000001";
    const uuidSpy = jest.spyOn(crypto, "randomUUID").mockReturnValue(branchIdValue);

    let branchId = "";
    act(() => {
      branchId = result.current.branchOutToNewConversation("conversation-1", "message-1");
    });

    const branch = result.current.state.conversationsById[branchId];
    expect(branch.messages).toEqual([firstMessage]);
    expect(branch.title).toBe("Branch · First chat");
    expect(branch.branchedOutFrom).toEqual({ conversationId: "conversation-1", messageId: "message-1" });
    expect(result.current.state.conversationOrder[0]).toBe(branchIdValue);
    uuidSpy.mockRestore();
  });
});
