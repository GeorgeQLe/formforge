import { describe, expect, it } from "vitest";
import { themeColorsSchema, themeNameSchema } from "@/server/themes/validation";

const validColors = {
  bg: "#ffffff",
  text: "#111827",
  primary: "#4f46e5",
  border: "#e5e7eb",
  inputBg: "#ffffff",
  inputBorder: "#d1d5db",
  accent: "#06b6d4",
};

describe("theme validation", () => {
  it("accepts complete 6-digit hex color tokens and normalizes case", () => {
    const parsed = themeColorsSchema.parse({
      ...validColors,
      primary: "#ABCDEF",
    });

    expect(parsed.primary).toBe("#abcdef");
  });

  it("rejects missing, unknown, or invalid color tokens", () => {
    expect(() =>
      themeColorsSchema.parse({ ...validColors, primary: "blue" })
    ).toThrow();
    expect(() =>
      themeColorsSchema.parse({ ...validColors, radius: "#ffffff" })
    ).toThrow();
    expect(() => themeColorsSchema.parse({ ...validColors, accent: undefined })).toThrow();
  });

  it("trims theme names and rejects empty names", () => {
    expect(themeNameSchema.parse("  Launch theme  ")).toBe("Launch theme");
    expect(() => themeNameSchema.parse("   ")).toThrow();
  });
});

