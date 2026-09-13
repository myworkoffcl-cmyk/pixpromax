import { canvasToBlob, createCanvas, getContext } from "@/lib/image/canvas";
import { decodeImage } from "@/lib/image/decode";
import { outputFilename } from "@/lib/image/filename";
import type { ImageMime, ProcessedImage } from "@/types/image";

export interface CropOptions {
  aspectRatio: number | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  mime: ImageMime;
  quality: number;
}

interface CropRectInput {
  width: number;
  height: number;
  aspectRatio: number | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export function calculateCropRect(input: CropRectInput) {
  let baseWidth = input.width;
  let baseHeight = input.height;
  if (input.aspectRatio) {
    if (input.width / input.height > input.aspectRatio) baseWidth = input.height * input.aspectRatio;
    else baseHeight = input.width / input.aspectRatio;
  }
  const width = Math.max(1, Math.round(baseWidth / input.zoom));
  const height = Math.max(1, Math.round(baseHeight / input.zoom));
  const roomX = Math.max(0, input.width - width);
  const roomY = Math.max(0, input.height - height);
  return {
    width,
    height,
    x: Math.round(roomX / 2 + (input.offsetX / 100) * roomX / 2),
    y: Math.round(roomY / 2 + (input.offsetY / 100) * roomY / 2),
  };
}

export async function cropImage(file: File, options: CropOptions): Promise<ProcessedImage> {
  const decoded = await decodeImage(file);
  try {
    const rect = calculateCropRect({ width: decoded.width, height: decoded.height, ...options });
    const { width: cropWidth, height: cropHeight, x: sourceX, y: sourceY } = rect;

    const cropCanvas = createCanvas({ width: cropWidth, height: cropHeight });
    getContext(cropCanvas).drawImage(decoded.source, sourceX, sourceY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const sideways = options.rotation === 90 || options.rotation === 270;
    const width = sideways ? cropHeight : cropWidth;
    const height = sideways ? cropWidth : cropHeight;
    const output = createCanvas({ width, height });
    const context = getContext(output);
    if (options.mime === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.translate(width / 2, height / 2);
    context.rotate(options.rotation * Math.PI / 180);
    context.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
    context.drawImage(cropCanvas, -cropWidth / 2, -cropHeight / 2);
    const quality = options.mime === "image/png" ? 1 : options.quality;
    const blob = await canvasToBlob(output, options.mime, quality);
    cropCanvas.width = 1;
    cropCanvas.height = 1;
    output.width = 1;
    output.height = 1;
    return { blob, width, height, quality, filename: outputFilename(file.name, "cropped", options.mime) };
  } finally {
    decoded.dispose();
  }
}
