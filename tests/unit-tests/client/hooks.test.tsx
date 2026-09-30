import { act, renderHook } from "@testing-library/react";
import { useLocation, useSearchParams } from "react-router";
import { StoreContext, type StoreContextType } from "../../../src/contexts/StoreContext";
import { useDebounceValue } from "../../../src/hooks/useDebounceValue";
import { useGetQueryParam } from "../../../src/hooks/useGetQueryParam";
import {
  useSearchConversations,
  type SearchConversationFilters,
} from "../../../src/hooks/useSearchConversations";
import { useUrlHash } from "../../../src/hooks/useUrlHash";
import type { Conversation } from "../../../src/interfaces";

jest.mock("react-router", () => ({
  useLocation: jest.fn(),
  useSearchParams: jest.fn(),
}));

const conversations: Conversation[] = [
  {
    id: "c1",
    title: "First conversation",
    messages: [
      { messageId: "m1", conversationId: "c1", role: "user", content: "Find this phrase", dateCreated: "2026-01-01" },
      { messageId: "m2", conversationId: "c1", role: "assistant", content: "find again", dateCreated: "invalid" },
      { messageId: "", conversationId: "c1", role: "user", content: "find without id", dateCreated: "2026-01-01" },
    ],
  },
  {
    id: "c2",
    title: "Second conversation",
    messages: [
      { messageId: "m3", conversationId: "c2", role: "assistant", content: "Another find", dateCreated: "2026-02-01" },
    ],
  },
];
const value: StoreContextType = {
  state: {
    conversationsById: Object.fromEntries(conversations.map((conversation) => [conversation.id, conversation])),
    conversationOrder: ["c1", "c2"],
    settings: { initialized: true, mode: "GENERAL", model: null },
  },
  isReady: true,
  loadingConversationId: "",
  setState: jest.fn(),
  reset: jest.fn(),
  setLoadingConversationId: jest.fn(),
};
const StoreWrapper = ({ children }: { children: React.ReactNode }) => (
  <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
);

describe("useDebounceValue", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps the previous value until the delay expires and resets the timer", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounceValue(value, 300), {
      initialProps: { value: "first" },
    });

    rerender({ value: "second" });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("first");
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("second");
  });
});

describe("useSearchConversations", () => {
  it("returns matching messages with previews and parsed dates", () => {
    const { result } = renderHook(() => useSearchConversations("find", {}), { wrapper: StoreWrapper });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].conversation.id).toBe("c1");
    expect(result.current[0].preview.match).toBe("Find");
    expect(result.current[1].date).toBeNull();
  });

  it("restricts results to the selected conversation and returns none for blank input", () => {
    const initialProps: { query: string; filters: SearchConversationFilters } = {
      query: "find",
      filters: { searchIn: "current", currentConversationId: "c2" },
    };
    const { result, rerender } = renderHook(
      ({ query, filters }: typeof initialProps) => useSearchConversations(query, filters),
      { wrapper: StoreWrapper, initialProps },
    );

    expect(result.current.map((item) => item.message.messageId)).toEqual(["m3"]);
    rerender({ query: "", filters: { searchIn: "all" } });
    expect(result.current).toEqual([]);
  });
});

describe("router location hooks", () => {
  it("reads query values and decoded or raw hashes", () => {
    jest.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams("c=conversation%201"),
      jest.fn(),
    ]);
    jest.mocked(useLocation).mockReturnValue({ hash: "#hello%20there" } as ReturnType<typeof useLocation>);

    const query = renderHook(() => useGetQueryParam("c"));
    const decodedHash = renderHook(() => useUrlHash());
    const rawHash = renderHook(() => useUrlHash(true));

    expect(query.result.current).toBe("conversation 1");
    expect(decodedHash.result.current).toBe("hello there");
    expect(rawHash.result.current).toBe("#hello%20there");
  });
});
