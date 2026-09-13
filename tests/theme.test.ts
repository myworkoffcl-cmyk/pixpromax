import { describe, expect, it } from "vitest";
import { isThemePreference, nextThemePreference } from "@/utils/theme";

describe("theme preferences", () => {
  it("cycles through system, light, and dark", () => {
    expect(nextThemePreference("system")).toBe("light");
    expect(nextThemePreference("light")).toBe("dark");
    expect(nextThemePreference("dark")).toBe("system");
  });

  it("rejects invalid stored preferences", () => {
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("sepia")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});
