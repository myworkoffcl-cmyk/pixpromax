import { describe, expect, it } from "vitest";
import { nextQualityBounds } from "@/lib/image/target-size";

describe("target-size quality search", () => {
  it("lowers the high bound when output is too large", () => expect(nextQualityBounds(120, 100, .6, .2, .95)).toEqual({ low: .2, high: .6 }));
  it("raises the low bound when output is under target", () => expect(nextQualityBounds(80, 100, .6, .2, .95)).toEqual({ low: .6, high: .95 }));
});
