import { validateDimensions } from "@/lib/image/dimensions";
import type { Dimensions, ImageMime } from "@/types/image";

export function createCanvas({ width, height }: Dimensions): HTMLCanvasElement {
  const error = validateDimensions({ width, height });
  if (error) throw new Error(error);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: ImageMime, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Your browser could not encode the processed image.")), mime, quality));
}

export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Canvas processing is unavailable in this browser.");
  return context;
}
