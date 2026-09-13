import { MAX_SINGLE_IMAGE_SIZE } from "@/config/limits";

const extendedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);

export function isHeicFile(file: File): boolean {
  return file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name);
}

export function validateConvertibleImage(file: File): string | null {
  const supportedExtension = /\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file.name);
  if ((!extendedTypes.has(file.type) && !supportedExtension) || file.size === 0) return "Choose a JPG, PNG, WebP, AVIF, HEIC, or HEIF image.";
  if (file.size > MAX_SINGLE_IMAGE_SIZE) return "This file is larger than the 30 MB browser-friendly limit.";
  return null;
}

export async function normalizeConvertibleImage(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;
  const { heicTo } = await import("heic-to/next");
  const converted = await heicTo({ blob: file, type: "image/jpeg", quality: .96 });
  const name = file.name.replace(/\.(heic|heif)$/i, "") || "image";
  return new File([converted], `${name}.jpg`, { type: "image/jpeg", lastModified: file.lastModified });
}

export function sourceFormatLabel(file: File): string {
  if (isHeicFile(file)) return "HEIC";
  if (file.type === "image/avif" || /\.avif$/i.test(file.name)) return "AVIF";
  if (file.type === "image/png") return "PNG";
  if (file.type === "image/webp") return "WebP";
  return "JPG";
}
