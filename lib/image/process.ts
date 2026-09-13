import picaFactory from "pica";
import { createCanvas, canvasToBlob, getContext } from "@/lib/image/canvas";
import { decodeImage } from "@/lib/image/decode";
import { outputFilename } from "@/lib/image/filename";
import type { Dimensions, ImageMime, ProcessedImage } from "@/types/image";

interface ProcessOptions extends Dimensions {
  mime: ImageMime;
  quality?: number;
  background?: string;
  suffix?: string;
}

export async function processImage(file: File, options: ProcessOptions): Promise<ProcessedImage> {
  const decoded = await decodeImage(file);
  try {
    const sourceCanvas = createCanvas({ width: decoded.width, height: decoded.height });
    const sourceContext = getContext(sourceCanvas);
    if (options.mime === "image/jpeg") {
      sourceContext.fillStyle = options.background ?? "#ffffff";
      sourceContext.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);
    }
    sourceContext.drawImage(decoded.source, 0, 0);
    const outputCanvas = createCanvas(options);
    const outputContext = getContext(outputCanvas);
    if (options.mime === "image/jpeg") {
      outputContext.fillStyle = options.background ?? "#ffffff";
      outputContext.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
    }
    if (options.width === decoded.width && options.height === decoded.height) {
      outputContext.drawImage(sourceCanvas, 0, 0);
    } else {
      await picaFactory().resize(sourceCanvas, outputCanvas, { quality: 3 });
    }
    const quality = options.mime === "image/png" ? 1 : options.quality ?? 0.9;
    const blob = await canvasToBlob(outputCanvas, options.mime, quality);
    sourceCanvas.width = 1;
    sourceCanvas.height = 1;
    outputCanvas.width = 1;
    outputCanvas.height = 1;
    return { blob, width: options.width, height: options.height, quality, filename: outputFilename(file.name, options.suffix ?? "converted", options.mime) };
  } finally {
    decoded.dispose();
  }
}

export async function imageDimensions(file: Blob): Promise<Dimensions> {
  const decoded = await decodeImage(file);
  try { return { width: decoded.width, height: decoded.height }; } finally { decoded.dispose(); }
}
