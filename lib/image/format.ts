import type { ImageExtension, ImageMime } from "@/types/image";

export const imageMimes: ImageMime[] = ["image/jpeg", "image/png", "image/webp"];

export function isImageMime(value: string): value is ImageMime {
  return imageMimes.includes(value as ImageMime);
}

export function extensionForMime(mime: ImageMime): ImageExtension {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  return "webp";
}

export function labelForMime(mime: ImageMime): string {
  return mime === "image/jpeg" ? "JPG" : mime === "image/png" ? "PNG" : "WebP";
}

export function mimeFromExtension(extension: string): ImageMime | null {
  const normalized = extension.toLowerCase().replace(/^\./, "");
  if (normalized === "jpg" || normalized === "jpeg") return "image/jpeg";
  if (normalized === "png") return "image/png";
  if (normalized === "webp") return "image/webp";
  return null;
}
