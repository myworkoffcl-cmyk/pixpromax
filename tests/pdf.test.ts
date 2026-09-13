import { describe, expect, it } from "vitest";
import { pageDimensions } from "@/lib/pdf/create-image-pdf";

describe("PDF page dimensions", () => {
  const image = { bytes: new Uint8Array(), width: 1200, height: 800 };

  it("uses the image dimensions for fit-to-image pages", () => {
    expect(pageDimensions(image, { pageSize: "fit", orientation: "portrait", margin: 0, quality: 0.9 }))
      .toEqual({ width: 1200, height: 800 });
  });

  it("rotates A4 dimensions for landscape output", () => {
    expect(pageDimensions(image, { pageSize: "a4", orientation: "landscape", margin: 24, quality: 0.9 }))
      .toEqual({ width: 841.89, height: 595.28 });
  });
});
