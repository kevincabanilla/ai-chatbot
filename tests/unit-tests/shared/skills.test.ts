import { AI_SKILL } from "../../../shared/ai/skills";

describe("AI skill identifiers", () => {
  it("exposes the supported skill keys and values", () => {
    expect(AI_SKILL).toEqual({ GENERAL: "GENERAL", CODING: "CODING" });
  });
});
