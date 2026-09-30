import { cn, getDateLabel, getMatchPreview, getMessageDate } from "../../../src/libs/utils";
import type { MessageItem } from "../../../src/interfaces";

describe("client utility functions", () => {
  it("merges conditional Tailwind classes with later conflicts winning", () => {
    expect(cn("p-2", "p-4", ["text-sm"])).toBe("p-4 text-sm");
  });

  it("formats today, yesterday, and invalid message dates", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    expect(getDateLabel(today)).toBe("Today");
    expect(getDateLabel(yesterday)).toBe("Yesterday");
    expect(getMessageDate({ dateCreated: "not-a-date" } as MessageItem)).toBeNull();
  });

  it("uses timestamp when the date field is empty", () => {
    const message = {
      dateCreated: "",
      timestamp: new Date("2024-01-02T03:04:05Z").getTime(),
    } as MessageItem;

    expect(getMessageDate(message)?.toISOString()).toBe("2024-01-02T03:04:05.000Z");
  });

  it("returns a case-insensitive match preview and null for no match", () => {
    expect(getMatchPreview("A concise HELLO from the assistant", "hello")).toEqual({
      before: "A concise ",
      match: "HELLO",
      after: " from the assistant",
    });
    expect(getMatchPreview("Nothing here", "missing")).toBeNull();
  });

  it("clips long match previews while preserving the matching text", () => {
    const content = `${"a".repeat(60)}needle${"b".repeat(100)}`;
    const preview = getMatchPreview(content, "needle");

    expect(preview?.before.startsWith("...")).toBe(true);
    expect(preview?.match).toBe("needle");
    expect(preview?.after.endsWith("...")).toBe(true);
  });
});
