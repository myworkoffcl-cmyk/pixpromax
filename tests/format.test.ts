import { describe, expect, it } from "vitest";
import { extensionForMime, mimeFromExtension } from "@/lib/image/format";
import { formatFileSize, formatPercentSaved } from "@/lib/image/format-size";

describe("image format utilities", () => {
  it("maps MIME types and extensions", () => {
    expect(extensionForMime("image/jpeg")).toBe("jpg");
    expect(mimeFromExtension(".JPEG")).toBe("image/jpeg");
    expect(mimeFromExtension("gif")).toBeNull();
  });
  it("formats file sizes and savings", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatPercentSaved(1000, 250)).toBe("75%");
  });
});
