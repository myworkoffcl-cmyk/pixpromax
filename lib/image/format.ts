import type { ImageExtension, ImageMime } from "@/types/image";

export const imageMimes: ImageMime[] = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function isImageMime(value: string): value is ImageMime {
  return imageMimes.includes(value as ImageMime);
}

export function extensionForMime(mime: ImageMime | string): ImageExtension | string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/avif") return "avif";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export function labelForMime(mime: ImageMime | string): string {
  if (mime === "image/jpeg") return "JPG";
  if (mime === "image/png") return "PNG";
  if (mime === "image/avif") return "AVIF";
  return "WebP";
}

export function mimeFromExtension(extension: string): ImageMime | null {
  const normalized = extension.toLowerCase().replace(/^\./, "");
  if (normalized === "jpg" || normalized === "jpeg") return "image/jpeg";
  if (normalized === "png") return "image/png";
  if (normalized === "webp") return "image/webp";
  if (normalized === "avif") return "image/avif";
  return null;
}
