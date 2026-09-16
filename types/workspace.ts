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

export interface EditConfig {
  enabled: boolean;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
  brightness: number;   // 1 = no change
  contrast: number;
  saturation: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
}

export interface ConvertConfig {
  enabled: boolean;
  format: ImageMime;
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

export const DEFAULT_EDIT: EditConfig = {
  enabled: false,
  rotation: 0,
  flipX: false,
  flipY: false,
  brightness: 1,
  contrast: 1,
  saturation: 1,
  grayscale: false,
  sepia: false,
  invert: false,
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
  mime: ImageMime;
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
