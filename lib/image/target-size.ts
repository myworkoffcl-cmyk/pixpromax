import { processImage } from "@/lib/image/process";
import type { ImageMime, ProcessedImage } from "@/types/image";

export const MIN_QUALITY = 0.22;
export const MAX_QUALITY = 0.95;
export const MAX_QUALITY_ITERATIONS = 8;

export function nextQualityBounds(size: number, target: number, quality: number, low: number, high: number) {
  return size > target ? { low, high: quality } : { low: quality, high };
}

export async function optimizeToTarget(file: File, targetBytes: number, original: { width: number; height: number }, mime: ImageMime = "image/jpeg"): Promise<ProcessedImage> {
  let width = original.width;
  let height = original.height;
  if (!Number.isFinite(targetBytes) || targetBytes <= 0) throw new Error("Choose a positive file-size limit.");

  for (let dimensionPass = 0; dimensionPass < 7; dimensionPass += 1) {
    let low = MIN_QUALITY;
    let high = MAX_QUALITY;
    let best: ProcessedImage | null = null;
    for (let index = 0; index < MAX_QUALITY_ITERATIONS; index += 1) {
      const quality = (low + high) / 2;
      const result = await processImage(file, { width, height, mime, quality, background: "#ffffff", suffix: `${Math.round(targetBytes / 1024)}kb` });
      if (result.blob.size <= targetBytes && (!best || quality > (best.quality ?? 0))) best = result;
      const bounds = nextQualityBounds(result.blob.size, targetBytes, quality, low, high);
      low = bounds.low;
      high = bounds.high;
      if (result.blob.size <= targetBytes && (targetBytes - result.blob.size) / targetBytes < 0.035) return result;
    }
    if (best) return best;
    width = Math.max(1, Math.round(width * 0.72));
    height = Math.max(1, Math.round(height * 0.72));
  }
  throw new Error("This image could not fit under the selected limit. Choose a larger limit or crop the image first.");
}
