import { describe, expect, it } from "vitest";
import { baseFilename, outputFilename } from "@/lib/image/filename";

describe("filename utilities", () => {
  it("preserves the base name", () => {
    expect(baseFilename("my.photo.jpeg")).toBe("my.photo");
    expect(outputFilename("my.photo.jpeg", "resized", "image/webp")).toBe("my.photo-resized.webp");
  });
  it("falls back for blank names", () => expect(baseFilename(" ")).toBe("image"));
});
