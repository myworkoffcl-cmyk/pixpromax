import { canvasToBlob, createCanvas, getContext } from "@/lib/image/canvas";
import { decodeImage } from "@/lib/image/decode";
import { outputFilename } from "@/lib/image/filename";
import type { PassportPreset } from "@/config/passport";
import type { ProcessedImage } from "@/types/image";

export function presetPixels(preset: PassportPreset): { width: number; height: number } {
  if (preset.unit === "px") return { width: Math.round(preset.width), height: Math.round(preset.height) };
  const scale = preset.unit === "in" ? preset.dpi : preset.dpi / 25.4;
  return { width: Math.round(preset.width * scale), height: Math.round(preset.height * scale) };
}

export async function createPassportPhoto(file: File, preset: PassportPreset, zoom: number, offsetX: number, offsetY: number): Promise<ProcessedImage> {
  const decoded = await decodeImage(file);
  try {
    const size = presetPixels(preset);
    const canvas = createCanvas(size);
    const context = getContext(canvas);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size.width, size.height);
    const cover = Math.max(size.width / decoded.width, size.height / decoded.height) * zoom;
    const drawWidth = decoded.width * cover;
    const drawHeight = decoded.height * cover;
    const availableX = Math.max(0, drawWidth - size.width);
    const availableY = Math.max(0, drawHeight - size.height);
    const x = (size.width - drawWidth) / 2 + (offsetX / 100) * availableX / 2;
    const y = (size.height - drawHeight) / 2 + (offsetY / 100) * availableY / 2;
    context.drawImage(decoded.source, x, y, drawWidth, drawHeight);
    const blob = await canvasToBlob(canvas, "image/jpeg", .94);
    return { blob, ...size, quality: .94, filename: outputFilename(file.name, "passport-photo", "image/jpeg") };
  } finally { decoded.dispose(); }
}
