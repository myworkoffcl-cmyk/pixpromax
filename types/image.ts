export type ImageMime = "image/jpeg" | "image/png" | "image/webp";
export type ImageExtension = "jpg" | "png" | "webp";
export type ProcessingState = "idle" | "loading" | "processing" | "success" | "error";

export interface Dimensions {
  width: number;
  height: number;
}

export interface DecodedImage extends Dimensions {
  source: CanvasImageSource;
  dispose: () => void;
}

export interface ProcessedImage extends Dimensions {
  blob: Blob;
  filename: string;
  quality?: number;
}

export type BatchStatus = "Waiting" | "Processing" | "Complete" | "Error";

export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  status: BatchStatus;
  result?: ProcessedImage;
  error?: string;
}
