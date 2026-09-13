import { imageDimensions } from "@/lib/image/process";
import { outputFilename } from "@/lib/image/filename";
import type { ImageMime, ProcessedImage } from "@/types/image";

export async function compressImage(file: File, quality: number): Promise<ProcessedImage> {
  const imageCompression = (await import("browser-image-compression")).default;
  const dimensions = await imageDimensions(file);
  const result = await imageCompression(file, {
    maxSizeMB: Math.max(0.05, file.size / 1024 ** 2 * quality),
    maxWidthOrHeight: 16384,
    useWebWorker: true,
    initialQuality: quality,
    fileType: file.type,
  });
  const mime = (file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg") as ImageMime;
  return { blob: result, ...dimensions, quality, filename: outputFilename(file.name, "compressed", mime) };
}
