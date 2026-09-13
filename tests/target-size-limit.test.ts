import { beforeEach, describe, expect, it, vi } from "vitest";
import { processImage } from "@/lib/image/process";
import { optimizeToTarget } from "@/lib/image/target-size";

vi.mock("@/lib/image/process", () => ({ processImage: vi.fn() }));
const render = vi.mocked(processImage);
const file = new File(["sample"], "sample.jpg", { type: "image/jpeg" });

describe("strict target-size limit", () => {
  beforeEach(() => { render.mockReset(); });
  it("rejects a close oversized candidate and returns an undersized file", async () => {
    render.mockImplementation(async (_file, options) => ({
      blob: new Blob([new Uint8Array((options.quality ?? 1) > .5 ? 1010 : 980)]),
      width: options.width, height: options.height, quality: options.quality, filename: "result.jpg",
    }));
    expect((await optimizeToTarget(file, 1000, { width: 1000, height: 500 })).blob.size).toBeLessThanOrEqual(1000);
  });
  it("reports failure instead of returning an oversized file", async () => {
    render.mockResolvedValue({ blob: new Blob([new Uint8Array(2000)]), width: 100, height: 50, filename: "result.jpg" });
    await expect(optimizeToTarget(file, 1000, { width: 1000, height: 500 })).rejects.toThrow("could not fit");
  });
});
