import { describe, it, expect } from "vitest";
import { formatSeconds } from "@/lib/utils";

describe("smoke test", () => {
  it("formatSeconds utility loads and works", () => {
    expect(formatSeconds(30)).toBe("30s");
    expect(formatSeconds(90)).toBe("1m 30s");
    expect(formatSeconds(0)).toBe("0s");
  });
});
