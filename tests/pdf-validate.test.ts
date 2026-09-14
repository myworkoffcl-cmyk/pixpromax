import { describe, expect, it } from "vitest";
import { parsePageList } from "@/lib/pdf/validate";

describe("PDF page selection", () => {
  it("expands valid individual pages and ranges", () => {
    expect(parsePageList("1-3, 5", 5)).toEqual([1, 2, 3, 5]);
  });

  it("rejects pages outside the document", () => {
    expect(parsePageList("1, 6", 5)).toBeNull();
  });

  it("keeps duplicate entries for page reordering", () => {
    expect(parsePageList("3, 1, 3", 3)).toEqual([3, 1, 3]);
  });
});
