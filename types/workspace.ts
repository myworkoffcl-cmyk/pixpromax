import type { ImageMime } from "@/types/image";

export type WorkspaceEngine = "compress" | "resize" | "edit" | "convert";

// ─── per-engine configs ────────────────────────────────────────────────────

export interface CompressConfig {
  enabled: boolean;
  mode: "quality" | "target";
  quality: number; // 0.20–0.95
  targetKb: number;
}

export interface ResizeConfig {
  enabled: boolean;
  mode: "px" | "percent";
  width: number;
  height: number;
  percent: number;
  lockRatio: boolean;
  preset: string | null;
}

export type CropAspect = "free" | "1:1" | "4:3" | "3:2" | "16:9" | "custom";
export type OverlayPosition = "tl" | "tc" | "tr" | "bl" | "bc" | "br" | "center";

export interface CropConfig {
  enabled: boolean;
  aspect: CropAspect;
  /** Crop region as fraction of source (0–1). */
  x: number;
  y: number;
  w: number;
  h: number;
  customAspectW: number;
  customAspectH: number;
}

export interface TextOverlayConfig {
  enabled: boolean;
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: OverlayPosition;
  bold: boolean;
}

export interface ImageOverlayConfig {
  enabled: boolean;
  dataUrl: string | null;
  position: OverlayPosition;
  scale: number; // 0.05–0.5
  opacity: number; // 0–1
}

export interface EditConfig {
  enabled: boolean;
  // Crop
  crop: CropConfig;
  // Rotate & Flip
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  // Adjustments
  brightness: number;   // 1 = no change
  contrast: number;
  saturation: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  // Enhance
  blur: number;          // 0 = none; CSS blur radius in px
  pixelate: number;      // 0 = none; block size in px
  sharpen: boolean;
  // Canvas
  padding: number;
  paddingColor: string;
  border: number;
  borderColor: string;
  borderRadius: number;
  // Overlays
  textOverlay: TextOverlayConfig;
  imageOverlay: ImageOverlayConfig;
}

export type OutputFormat = ImageMime; // jpeg | png | webp | avif

export interface ConvertConfig {
  enabled: boolean;
  format: OutputFormat;
}

export interface WorkspaceOps {
  compress: CompressConfig;
  resize: ResizeConfig;
  edit: EditConfig;
  convert: ConvertConfig;
}

// ─── initial configs (defaults) ────────────────────────────────────────────

export const DEFAULT_COMPRESS: CompressConfig = {
  enabled: false,
  mode: "quality",
  quality: 0.80,
  targetKb: 200,
};

export const DEFAULT_RESIZE: ResizeConfig = {
  enabled: false,
  mode: "px",
  width: 1280,
  height: 720,
  percent: 50,
  lockRatio: true,
  preset: null,
};

export const DEFAULT_CROP: CropConfig = {
  enabled: false,
  aspect: "free",
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  customAspectW: 16,
  customAspectH: 9,
};

export const DEFAULT_TEXT_OVERLAY: TextOverlayConfig = {
  enabled: false,
  text: "",
  fontSize: 36,
  color: "#ffffff",
  opacity: 0.85,
  position: "br",
  bold: false,
};

export const DEFAULT_IMAGE_OVERLAY: ImageOverlayConfig = {
  enabled: false,
  dataUrl: null,
  position: "br",
  scale: 0.2,
  opacity: 0.8,
};

export const DEFAULT_EDIT: EditConfig = {
  enabled: false,
  crop: DEFAULT_CROP,
  rotation: 0,
  flipX: false,
  flipY: false,
  brightness: 1,
  contrast: 1,
  saturation: 1,
  grayscale: false,
  sepia: false,
  invert: false,
  blur: 0,
  pixelate: 0,
  sharpen: false,
  padding: 0,
  paddingColor: "#ffffff",
  border: 0,
  borderColor: "#000000",
  borderRadius: 0,
  textOverlay: DEFAULT_TEXT_OVERLAY,
  imageOverlay: DEFAULT_IMAGE_OVERLAY,
};

export const DEFAULT_CONVERT: ConvertConfig = {
  enabled: false,
  format: "image/webp",
};

// ─── pipeline result ───────────────────────────────────────────────────────

export interface PipelineResult {
  blob: Blob;
  width: number;
  height: number;
  mime: string;
  filename: string;
}

// ─── workspace UI state ────────────────────────────────────────────────────

export interface WorkspaceState {
  source: File | null;
  sourceWidth: number;
  sourceHeight: number;
  ops: WorkspaceOps;
  result: PipelineResult | null;
  status: "idle" | "processing" | "done" | "error";
  error: string | null;
  previewMode: "original" | "final";
}

export const DEFAULT_WORKSPACE_STATE: WorkspaceState = {
  source: null,
  sourceWidth: 0,
  sourceHeight: 0,
  ops: {
    compress: DEFAULT_COMPRESS,
    resize: DEFAULT_RESIZE,
    edit: DEFAULT_EDIT,
    convert: DEFAULT_CONVERT,
  },
  result: null,
  status: "idle",
  error: null,
  previewMode: "final",
};

// ─── initial configuration (from SEO/route entry) ─────────────────────────

export interface WorkspaceInitConfig {
  initialEngine?: WorkspaceEngine;
  compress?: Partial<CompressConfig>;
  resize?: Partial<ResizeConfig>;
  convert?: Partial<ConvertConfig>;
  edit?: Partial<EditConfig>;
}
