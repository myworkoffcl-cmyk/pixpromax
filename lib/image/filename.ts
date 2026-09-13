import { extensionForMime } from "@/lib/image/format";
import type { ImageMime } from "@/types/image";

export function baseFilename(filename: string): string {
  const clean = filename.trim().replace(/\.[^.]+$/, "");
  return clean || "image";
}

export function outputFilename(filename: string, suffix: string, mime: ImageMime): string {
  return `${baseFilename(filename)}-${suffix}.${extensionForMime(mime)}`;
}
