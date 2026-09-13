import { ACCEPTED_IMAGE_TYPES, MAX_SINGLE_IMAGE_SIZE } from "@/config/limits";
import { isImageMime } from "@/lib/image/format";

export function validateImageFile(file: File): string | null {
  if (!isImageMime(file.type) || !ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Choose a JPG, PNG, or WebP image.";
  if (file.size > MAX_SINGLE_IMAGE_SIZE) return "This file is larger than the 30 MB browser-friendly limit.";
  if (file.size === 0) return "This file is empty.";
  return null;
}
