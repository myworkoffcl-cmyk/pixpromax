import { describe, expect, it } from "vitest";
import { calculateCropRect } from "@/lib/image/crop";

describe("crop calculations", () => {
  it("centres a square crop in a landscape image", () => {
    expect(calculateCropRect({ width: 1200, height: 800, aspectRatio: 1, zoom: 1, offsetX: 0, offsetY: 0 }))
      .toEqual({ width: 800, height: 800, x: 200, y: 0 });
  });

  it("applies zoom and bounded percentage offsets", () => {
    expect(calculateCropRect({ width: 1000, height: 800, aspectRatio: null, zoom: 2, offsetX: 100, offsetY: -100 }))
      .toEqual({ width: 500, height: 400, x: 500, y: 0 });
  });
});
