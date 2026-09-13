import { describe, expect, it } from "vitest";
import { fitDimensions, validateDimensions } from "@/lib/image/dimensions";

describe("dimension utilities", () => {
  it("preserves aspect ratio from width", () => expect(fitDimensions({ width: 4000, height: 3000 }, { width: 2000 }, true)).toEqual({ width: 2000, height: 1500 }));
  it("rejects invalid and excessive canvases", () => {
    expect(validateDimensions({ width: 0, height: 100 })).toMatch(/positive/);
    expect(validateDimensions({ width: 20000, height: 100 })).toMatch(/too large/);
    expect(validateDimensions({ width: 1000, height: 1000 })).toBeNull();
  });
});
