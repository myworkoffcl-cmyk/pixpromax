import { MAX_CANVAS_DIMENSION, MAX_CANVAS_PIXELS } from "@/config/limits";
import type { Dimensions } from "@/types/image";

export function fitDimensions(original: Dimensions, requested: Partial<Dimensions>, locked = true): Dimensions {
  const ratio = original.width / original.height;
  let width = Math.round(requested.width ?? original.width);
  let height = Math.round(requested.height ?? original.height);
  if (locked && requested.width !== undefined && requested.height === undefined) height = Math.round(width / ratio);
  if (locked && requested.height !== undefined && requested.width === undefined) width = Math.round(height * ratio);
  return { width, height };
}

export function validateDimensions({ width, height }: Dimensions): string | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return "Width and height must be positive numbers.";
  if (width > MAX_CANVAS_DIMENSION || height > MAX_CANVAS_DIMENSION || width * height > MAX_CANVAS_PIXELS) return "Those dimensions are too large for reliable browser processing.";
  return null;
}
