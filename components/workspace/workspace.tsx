"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  ArrowDownToLine,
  ChevronDown,
  ChevronRight,
  Crop,
  FlipHorizontal,
  FlipVertical,
  Frame,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { runPipeline } from "@/lib/image/pipeline";
import { imageDimensions } from "@/lib/image/process";
import { validateImageFile } from "@/lib/image/validate";
import { formatFileSize } from "@/lib/image/format-size";
import type {
  CropAspect,
  OutputFormat,
  WorkspaceInitConfig,
  WorkspaceOps,
  WorkspaceState,
} from "@/types/workspace";
import {
  DEFAULT_COMPRESS,
  DEFAULT_CONVERT,
  DEFAULT_CROP,
  DEFAULT_EDIT,
  DEFAULT_IMAGE_OVERLAY,
  DEFAULT_RESIZE,
  DEFAULT_TEXT_OVERLAY,
  DEFAULT_WORKSPACE_STATE,
} from "@/types/workspace";

// ─── state helpers ─────────────────────────────────────────────────────────

type Action =
  | { type: "SET_SOURCE"; file: File; w: number; h: number }
  | { type: "RESET" }
  | { type: "SET_OPS"; ops: Partial<WorkspaceOps> }
  | { type: "SET_RESULT"; result: WorkspaceState["result"] }
  | { type: "SET_STATUS"; status: WorkspaceState["status"]; error?: string }
  | { type: "SET_PREVIEW"; mode: "original" | "final" };

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case "SET_SOURCE":
      return {
        ...DEFAULT_WORKSPACE_STATE,
        source: action.file,
        sourceWidth: action.w,
        sourceHeight: action.h,
        ops: state.ops,
      };
    case "RESET":
      return DEFAULT_WORKSPACE_STATE;
    case "SET_OPS":
      return {
        ...state,
        ops: { ...state.ops, ...action.ops },
        result: null,
        status: "idle",
      };
    case "SET_RESULT":
      return { ...state, result: action.result, status: "done", error: null };
    case "SET_STATUS":
      return { ...state, status: action.status, error: action.error ?? null };
    case "SET_PREVIEW":
      return { ...state, previewMode: action.mode };
    default:
      return state;
  }
}

// ─── URL preview hook ──────────────────────────────────────────────────────

function usePreviewUrl(blob: Blob | File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) { setUrl(null); return; }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

// ─── AVIF detection hook ───────────────────────────────────────────────────

function useAvifSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    canvas.toBlob((b) => setSupported(!!b && b.size > 0), "image/avif");
  }, []);
  return supported;
}

// ─── Crop helpers ──────────────────────────────────────────────────────────

function computeCropRect(
  aspect: CropAspect,
  customW: number,
  customH: number,
  srcW: number,
  srcH: number
): { x: number; y: number; w: number; h: number } {
  if (aspect === "free") return { x: 0, y: 0, w: 1, h: 1 };

  const ratioMap: Record<string, number> = {
    "1:1": 1,
    "4:3": 4 / 3,
    "3:2": 3 / 2,
    "16:9": 16 / 9,
    custom: customW / Math.max(1, customH),
  };
  const targetRatio = ratioMap[aspect] ?? 1;
  const srcRatio = srcW / srcH;

  let w: number, h: number;
  if (targetRatio > srcRatio) {
    w = 1;
    h = srcRatio / targetRatio;
  } else {
    h = 1;
    w = (targetRatio / srcRatio);
  }

  const x = (1 - w) / 2;
  const y = (1 - h) / 2;
  return { x, y, w, h };
}

// ─── Engine section (top-level collapsible) ────────────────────────────────

function EngineSection({
  label,
  icon: Icon,
  enabled,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>;
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`ws-engine${enabled ? " ws-engine--on" : ""}`}>
      <button
        type="button"
        className="ws-engine-header"
        onClick={onToggle}
        aria-expanded={enabled}
      >
        <span className="ws-engine-check" aria-hidden="true">
          {enabled ? "✓" : "○"}
        </span>
        <Icon className="ws-engine-icon" aria-hidden="true" />
        <span className="ws-engine-label">{label}</span>
        {enabled ? (
          <ChevronDown className="ws-engine-arrow" aria-hidden="true" />
        ) : (
          <ChevronRight className="ws-engine-arrow" aria-hidden="true" />
        )}
      </button>
      {enabled && <div className="ws-engine-body">{children}</div>}
    </div>
  );
}

// ─── Sub-section (within engine body) ─────────────────────────────────────

function SubSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="ws-subsection" open={defaultOpen}>
      <summary className="ws-subsection-header">
        {Icon && <Icon className="ws-subsection-icon" aria-hidden="true" />}
        <span>{title}</span>
      </summary>
      <div className="ws-subsection-body">{children}</div>
    </details>
  );
}

// ─── Controls ──────────────────────────────────────────────────────────────

function CompressControls({
  cfg,
  onChange,
}: {
  cfg: WorkspaceOps["compress"];
  onChange: (p: Partial<WorkspaceOps["compress"]>) => void;
}) {
  const presets = [50, 100, 200, 500];
  return (
    <div className="ws-controls">
      <div className="ws-field ws-field--row">
        <button
          type="button"
          className={`ws-pill${cfg.mode === "quality" ? " active" : ""}`}
          onClick={() => onChange({ mode: "quality" })}
        >
          Quality
        </button>
        <button
          type="button"
          className={`ws-pill${cfg.mode === "target" ? " active" : ""}`}
          onClick={() => onChange({ mode: "target" })}
        >
          Target size
        </button>
      </div>

      {cfg.mode === "quality" ? (
        <div className="ws-field">
          <label className="ws-label">
            Quality · {Math.round(cfg.quality * 100)}%
          </label>
          <input
            type="range"
            min="20"
            max="95"
            value={Math.round(cfg.quality * 100)}
            onChange={(e) => onChange({ quality: Number(e.target.value) / 100 })}
          />
          <div className="ws-range-hints">
            <small>Smaller</small>
            <small>Sharper</small>
          </div>
        </div>
      ) : (
        <div className="ws-field">
          <label className="ws-label">Target size</label>
          <div className="ws-presets">
            {presets.map((kb) => (
              <button
                key={kb}
                type="button"
                className={`ws-pill${cfg.targetKb === kb ? " active" : ""}`}
                onClick={() => onChange({ targetKb: kb })}
              >
                {kb} KB
              </button>
            ))}
          </div>
          <div className="ws-field ws-field--row ws-field--mt">
            <input
              type="number"
              min="10"
              max="10000"
              value={cfg.targetKb}
              onChange={(e) => onChange({ targetKb: Number(e.target.value) })}
              className="ws-input ws-input--sm"
            />
            <span className="ws-unit">KB</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ResizeControls({
  cfg,
  sourceW,
  sourceH,
  onChange,
}: {
  cfg: WorkspaceOps["resize"];
  sourceW: number;
  sourceH: number;
  onChange: (p: Partial<WorkspaceOps["resize"]>) => void;
}) {
  const socialPresets = [
    { label: "Instagram Post", w: 1080, h: 1080 },
    { label: "Instagram Story", w: 1080, h: 1920 },
    { label: "YouTube Thumbnail", w: 1280, h: 720 },
    { label: "LinkedIn Cover", w: 1584, h: 396 },
    { label: "Facebook Cover", w: 820, h: 312 },
    { label: "Twitter/X Header", w: 1500, h: 500 },
  ];
  const docPresets = [
    { label: "Passport (2×2 in)", w: 600, h: 600 },
    { label: "Visa (35×45 mm)", w: 413, h: 531 },
    { label: "ID Photo", w: 413, h: 531 },
    { label: "Signature (150×60)", w: 150, h: 60 },
  ];

  function updateW(val: number) {
    if (cfg.lockRatio && sourceH > 0) {
      const ratio = sourceW / sourceH;
      onChange({ width: val, height: Math.round(val / ratio) });
    } else {
      onChange({ width: val });
    }
  }
  function updateH(val: number) {
    if (cfg.lockRatio && sourceW > 0) {
      const ratio = sourceH / sourceW;
      onChange({ height: val, width: Math.round(val / ratio) });
    } else {
      onChange({ height: val });
    }
  }

  return (
    <div className="ws-controls">
      <div className="ws-field ws-field--row">
        <button
          type="button"
          className={`ws-pill${cfg.mode === "px" ? " active" : ""}`}
          onClick={() => onChange({ mode: "px" })}
        >
          Pixels
        </button>
        <button
          type="button"
          className={`ws-pill${cfg.mode === "percent" ? " active" : ""}`}
          onClick={() => onChange({ mode: "percent" })}
        >
          Percent
        </button>
      </div>

      {cfg.mode === "px" ? (
        <>
          <div className="ws-field ws-field--row">
            <div className="ws-dim-group">
              <label className="ws-label">W</label>
              <input
                type="number"
                min="1"
                max="16000"
                value={cfg.width}
                onChange={(e) => updateW(Number(e.target.value))}
                className="ws-input ws-input--sm"
              />
            </div>
            <span className="ws-unit">×</span>
            <div className="ws-dim-group">
              <label className="ws-label">H</label>
              <input
                type="number"
                min="1"
                max="16000"
                value={cfg.height}
                onChange={(e) => updateH(Number(e.target.value))}
                className="ws-input ws-input--sm"
              />
            </div>
          </div>
          <label className="ws-checkbox">
            <input
              type="checkbox"
              checked={cfg.lockRatio}
              onChange={(e) => onChange({ lockRatio: e.target.checked })}
            />
            Lock aspect ratio
          </label>
        </>
      ) : (
        <div className="ws-field">
          <label className="ws-label">Scale · {cfg.percent}%</label>
          <input
            type="range"
            min="1"
            max="200"
            value={cfg.percent}
            onChange={(e) => onChange({ percent: Number(e.target.value) })}
          />
          <div className="ws-range-hints">
            <small>1%</small>
            <small>200%</small>
          </div>
        </div>
      )}

      <details className="ws-presets-group">
        <summary>Social media presets</summary>
        <div className="ws-presets">
          {socialPresets.map((p) => (
            <button
              key={p.label}
              type="button"
              className="ws-pill"
              onClick={() => onChange({ mode: "px", width: p.w, height: p.h, lockRatio: false })}
            >
              {p.label}
            </button>
          ))}
        </div>
      </details>

      <details className="ws-presets-group">
        <summary>Document &amp; ID presets</summary>
        <div className="ws-presets">
          {docPresets.map((p) => (
            <button
              key={p.label}
              type="button"
              className="ws-pill"
              onClick={() => onChange({ mode: "px", width: p.w, height: p.h, lockRatio: false })}
            >
              {p.label}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

// ─── Edit engine sub-sections ──────────────────────────────────────────────

const ASPECT_OPTIONS: Array<{ value: CropAspect; label: string }> = [
  { value: "free", label: "Free" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:2", label: "3:2" },
  { value: "16:9", label: "16:9" },
  { value: "custom", label: "Custom" },
];

const OVERLAY_POSITIONS = [
  { value: "tl", label: "↖" },
  { value: "tc", label: "↑" },
  { value: "tr", label: "↗" },
  { value: "bl", label: "↙" },
  { value: "bc", label: "↓" },
  { value: "br", label: "↘" },
  { value: "center", label: "⊙" },
];

function EditControls({
  cfg,
  onChange,
  sourceW,
  sourceH,
}: {
  cfg: WorkspaceOps["edit"];
  onChange: (p: Partial<WorkspaceOps["edit"]>) => void;
  sourceW: number;
  sourceH: number;
}) {
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const rotations: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];

  function selectAspect(aspect: CropAspect) {
    const rect = computeCropRect(aspect, cfg.crop.customAspectW, cfg.crop.customAspectH, sourceW, sourceH);
    onChange({
      crop: { ...cfg.crop, aspect, enabled: aspect !== "free", ...rect },
    });
  }

  function handleOverlayFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        imageOverlay: {
          ...cfg.imageOverlay,
          enabled: true,
          dataUrl: reader.result as string,
        },
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="ws-controls ws-controls--sections">

      {/* ── Crop ─────────────────────────────────────────────────────── */}
      <SubSection title="Crop" icon={Scissors} defaultOpen>
        <div className="ws-field">
          <span className="ws-label">Aspect ratio</span>
          <div className="ws-crop-aspects">
            {ASPECT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`ws-pill ws-pill--aspect${cfg.crop.aspect === value && cfg.crop.enabled ? " active" : value === "free" && !cfg.crop.enabled ? " active" : ""}`}
                onClick={() => selectAspect(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {cfg.crop.aspect === "custom" && cfg.crop.enabled && (
          <div className="ws-field ws-field--row">
            <input
              type="number"
              min="1"
              max="100"
              value={cfg.crop.customAspectW}
              className="ws-input ws-input--sm"
              onChange={(e) => {
                const customAspectW = Number(e.target.value);
                const rect = computeCropRect("custom", customAspectW, cfg.crop.customAspectH, sourceW, sourceH);
                onChange({ crop: { ...cfg.crop, customAspectW, ...rect } });
              }}
            />
            <span className="ws-unit">:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={cfg.crop.customAspectH}
              className="ws-input ws-input--sm"
              onChange={(e) => {
                const customAspectH = Number(e.target.value);
                const rect = computeCropRect("custom", cfg.crop.customAspectW, customAspectH, sourceW, sourceH);
                onChange({ crop: { ...cfg.crop, customAspectH, ...rect } });
              }}
            />
          </div>
        )}

        {cfg.crop.enabled && cfg.crop.aspect !== "free" && (
          <>
            <div className="ws-field">
              <label className="ws-label">
                X offset · {Math.round(cfg.crop.x * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max={Math.round((1 - cfg.crop.w) * 100)}
                value={Math.round(cfg.crop.x * 100)}
                onChange={(e) =>
                  onChange({ crop: { ...cfg.crop, x: Number(e.target.value) / 100 } })
                }
              />
            </div>
            <div className="ws-field">
              <label className="ws-label">
                Y offset · {Math.round(cfg.crop.y * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max={Math.round((1 - cfg.crop.h) * 100)}
                value={Math.round(cfg.crop.y * 100)}
                onChange={(e) =>
                  onChange({ crop: { ...cfg.crop, y: Number(e.target.value) / 100 } })
                }
              />
            </div>
          </>
        )}
        {cfg.crop.enabled && (
          <button
            type="button"
            className="ws-pill ws-pill--ghost"
            onClick={() => onChange({ crop: { ...DEFAULT_CROP } })}
          >
            Reset crop
          </button>
        )}
      </SubSection>

      {/* ── Rotate & Flip ─────────────────────────────────────────────── */}
      <SubSection title="Rotate & Flip" icon={RotateCcw}>
        <div className="ws-field">
          <span className="ws-label">Rotate</span>
          <div className="ws-field ws-field--row">
            {rotations.map((r) => (
              <button
                key={r}
                type="button"
                className={`ws-pill${cfg.rotation === r ? " active" : ""}`}
                onClick={() => onChange({ rotation: r })}
              >
                {r}°
              </button>
            ))}
          </div>
        </div>
        <div className="ws-field ws-field--row">
          <button
            type="button"
            className={`ws-pill${cfg.flipX ? " active" : ""}`}
            onClick={() => onChange({ flipX: !cfg.flipX })}
          >
            <FlipHorizontal aria-hidden="true" /> Flip H
          </button>
          <button
            type="button"
            className={`ws-pill${cfg.flipY ? " active" : ""}`}
            onClick={() => onChange({ flipY: !cfg.flipY })}
          >
            <FlipVertical aria-hidden="true" /> Flip V
          </button>
        </div>
      </SubSection>

      {/* ── Adjustments ───────────────────────────────────────────────── */}
      <SubSection title="Adjustments" icon={SlidersHorizontal}>
        {(
          [
            ["brightness", "Brightness"],
            ["contrast", "Contrast"],
            ["saturation", "Saturation"],
          ] as const
        ).map(([key, label]) => (
          <div className="ws-field" key={key}>
            <label className="ws-label">
              {label} · {Math.round((cfg[key] as number) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={Math.round((cfg[key] as number) * 100)}
              onChange={(e) =>
                onChange({
                  [key]: Number(e.target.value) / 100,
                } as Partial<WorkspaceOps["edit"]>)
              }
            />
          </div>
        ))}
        <div className="ws-field ws-field--row ws-field--wrap">
          {(["grayscale", "sepia", "invert"] as const).map((key) => (
            <label key={key} className="ws-checkbox">
              <input
                type="checkbox"
                checked={cfg[key]}
                onChange={(e) => onChange({ [key]: e.target.checked })}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
      </SubSection>

      {/* ── Enhance ───────────────────────────────────────────────────── */}
      <SubSection title="Enhance" icon={Sparkles}>
        <div className="ws-field">
          <label className="ws-label">
            Blur · {cfg.blur === 0 ? "off" : `${cfg.blur}px`}
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={cfg.blur}
            onChange={(e) => onChange({ blur: Number(e.target.value) })}
          />
          <div className="ws-range-hints">
            <small>Off</small>
            <small>20px</small>
          </div>
        </div>
        <div className="ws-field">
          <label className="ws-label">
            Pixelate / Censor · {cfg.pixelate <= 1 ? "off" : `${cfg.pixelate}px`}
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={cfg.pixelate}
            onChange={(e) => onChange({ pixelate: Number(e.target.value) })}
          />
          <div className="ws-range-hints">
            <small>Off</small>
            <small>Heavy</small>
          </div>
        </div>
        <label className="ws-checkbox">
          <input
            type="checkbox"
            checked={cfg.sharpen}
            disabled={cfg.blur > 0 || cfg.pixelate > 1}
            onChange={(e) => onChange({ sharpen: e.target.checked })}
          />
          Sharpen
          {(cfg.blur > 0 || cfg.pixelate > 1) && (
            <span className="ws-hint-inline"> (disabled while blur/pixelate active)</span>
          )}
        </label>
      </SubSection>

      {/* ── Canvas ────────────────────────────────────────────────────── */}
      <SubSection title="Canvas" icon={Frame}>
        <div className="ws-field ws-field--row ws-field--align">
          <label className="ws-label ws-label--nowrap">Padding</label>
          <input
            type="number"
            min="0"
            max="500"
            value={cfg.padding}
            className="ws-input ws-input--sm"
            onChange={(e) => onChange({ padding: Number(e.target.value) })}
          />
          <span className="ws-unit">px</span>
          <input
            type="color"
            value={cfg.paddingColor}
            className="ws-color"
            title="Padding / background colour"
            onChange={(e) => onChange({ paddingColor: e.target.value })}
          />
        </div>
        <div className="ws-field ws-field--row ws-field--align">
          <label className="ws-label ws-label--nowrap">Border</label>
          <input
            type="number"
            min="0"
            max="100"
            value={cfg.border}
            className="ws-input ws-input--sm"
            onChange={(e) => onChange({ border: Number(e.target.value) })}
          />
          <span className="ws-unit">px</span>
          <input
            type="color"
            value={cfg.borderColor}
            className="ws-color"
            title="Border colour"
            onChange={(e) => onChange({ borderColor: e.target.value })}
          />
        </div>
        <div className="ws-field">
          <label className="ws-label">
            Rounded corners · {cfg.borderRadius === 0 ? "off" : `${cfg.borderRadius}px`}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            value={cfg.borderRadius}
            onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          />
          <div className="ws-range-hints">
            <small>Square</small>
            <small>Pill</small>
          </div>
        </div>
      </SubSection>

      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <SubSection title="Overlay" icon={Layers}>
        {/* Text watermark */}
        <div className="ws-overlay-block">
          <label className="ws-checkbox ws-checkbox--header">
            <input
              type="checkbox"
              checked={cfg.textOverlay.enabled}
              onChange={(e) =>
                onChange({ textOverlay: { ...cfg.textOverlay, enabled: e.target.checked } })
              }
            />
            <Type className="ws-subsection-icon" aria-hidden="true" />
            <strong>Text watermark</strong>
          </label>

          {cfg.textOverlay.enabled && (
            <div className="ws-overlay-fields">
              <input
                type="text"
                className="ws-input ws-input--full"
                placeholder="Watermark text…"
                value={cfg.textOverlay.text}
                onChange={(e) =>
                  onChange({ textOverlay: { ...cfg.textOverlay, text: e.target.value } })
                }
              />
              <div className="ws-field ws-field--row ws-field--align">
                <label className="ws-label ws-label--nowrap">Size</label>
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={cfg.textOverlay.fontSize}
                  className="ws-input ws-input--sm"
                  onChange={(e) =>
                    onChange({ textOverlay: { ...cfg.textOverlay, fontSize: Number(e.target.value) } })
                  }
                />
                <span className="ws-unit">px</span>
                <input
                  type="color"
                  value={cfg.textOverlay.color}
                  className="ws-color"
                  onChange={(e) =>
                    onChange({ textOverlay: { ...cfg.textOverlay, color: e.target.value } })
                  }
                />
                <label className="ws-checkbox ws-checkbox--inline">
                  <input
                    type="checkbox"
                    checked={cfg.textOverlay.bold}
                    onChange={(e) =>
                      onChange({ textOverlay: { ...cfg.textOverlay, bold: e.target.checked } })
                    }
                  />
                  Bold
                </label>
              </div>
              <div className="ws-field">
                <label className="ws-label">
                  Opacity · {Math.round(cfg.textOverlay.opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(cfg.textOverlay.opacity * 100)}
                  onChange={(e) =>
                    onChange({ textOverlay: { ...cfg.textOverlay, opacity: Number(e.target.value) / 100 } })
                  }
                />
              </div>
              <div className="ws-field">
                <span className="ws-label">Position</span>
                <div className="ws-position-grid">
                  {OVERLAY_POSITIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`ws-pos-btn${cfg.textOverlay.position === value ? " active" : ""}`}
                      onClick={() =>
                        onChange({ textOverlay: { ...cfg.textOverlay, position: value as any } })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ws-overlay-divider" />

        {/* Image / logo watermark */}
        <div className="ws-overlay-block">
          <label className="ws-checkbox ws-checkbox--header">
            <input
              type="checkbox"
              checked={cfg.imageOverlay.enabled}
              onChange={(e) =>
                onChange({ imageOverlay: { ...cfg.imageOverlay, enabled: e.target.checked } })
              }
            />
            <ImagePlus className="ws-subsection-icon" aria-hidden="true" />
            <strong>Logo / image watermark</strong>
          </label>

          {cfg.imageOverlay.enabled && (
            <div className="ws-overlay-fields">
              <button
                type="button"
                className="ws-pill ws-pill--upload"
                onClick={() => overlayInputRef.current?.click()}
              >
                {cfg.imageOverlay.dataUrl ? "Change logo image" : "Upload logo image"}
              </button>
              <input
                ref={overlayInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleOverlayFile}
                aria-label="Upload watermark image"
              />
              {cfg.imageOverlay.dataUrl && (
                <>
                  <div className="ws-field">
                    <label className="ws-label">
                      Size · {Math.round(cfg.imageOverlay.scale * 100)}% of width
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={Math.round(cfg.imageOverlay.scale * 100)}
                      onChange={(e) =>
                        onChange({ imageOverlay: { ...cfg.imageOverlay, scale: Number(e.target.value) / 100 } })
                      }
                    />
                  </div>
                  <div className="ws-field">
                    <label className="ws-label">
                      Opacity · {Math.round(cfg.imageOverlay.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={Math.round(cfg.imageOverlay.opacity * 100)}
                      onChange={(e) =>
                        onChange({ imageOverlay: { ...cfg.imageOverlay, opacity: Number(e.target.value) / 100 } })
                      }
                    />
                  </div>
                  <div className="ws-field">
                    <span className="ws-label">Position</span>
                    <div className="ws-position-grid">
                      {OVERLAY_POSITIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          className={`ws-pos-btn${cfg.imageOverlay.position === value ? " active" : ""}`}
                          onClick={() =>
                            onChange({ imageOverlay: { ...cfg.imageOverlay, position: value as any } })
                          }
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ws-pill ws-pill--ghost"
                    onClick={() =>
                      onChange({ imageOverlay: { ...DEFAULT_IMAGE_OVERLAY } })
                    }
                  >
                    Remove logo
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </SubSection>
    </div>
  );
}

function ConvertControls({
  cfg,
  onChange,
}: {
  cfg: WorkspaceOps["convert"];
  onChange: (p: Partial<WorkspaceOps["convert"]>) => void;
}) {
  const avifSupported = useAvifSupport();

  const formats: Array<{
    value: OutputFormat;
    label: string;
    hint: string;
    available: boolean;
  }> = [
    {
      value: "image/jpeg",
      label: "JPEG",
      hint: "Best for photos. Smallest file size. No transparency.",
      available: true,
    },
    {
      value: "image/png",
      label: "PNG",
      hint: "Lossless. Preserves transparency. Larger files.",
      available: true,
    },
    {
      value: "image/webp",
      label: "WebP",
      hint: "Modern format. Great quality-to-size balance. Broad support.",
      available: true,
    },
    {
      value: "image/avif",
      label: avifSupported === null ? "AVIF (detecting…)" : avifSupported ? "AVIF" : "AVIF (unavailable)",
      hint: "Best compression of modern formats. Chrome 94+ / Firefox 113+.",
      available: avifSupported !== false,
    },
  ];

  const selected = formats.find((f) => f.value === cfg.format);

  // If current selection became unavailable, fall back to webp
  if (selected && !selected.available) {
    onChange({ format: "image/webp" });
  }

  return (
    <div className="ws-controls">
      <div className="ws-field">
        <label className="ws-label" htmlFor="ws-convert-format">
          Output format
        </label>
        <select
          id="ws-convert-format"
          className="ws-select"
          value={cfg.format}
          onChange={(e) => onChange({ format: e.target.value as OutputFormat })}
        >
          {formats.map((f) => (
            <option key={f.value} value={f.value} disabled={!f.available}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      {selected && (
        <p className="ws-hint">{selected.hint}</p>
      )}
      {avifSupported === false && cfg.format !== "image/avif" && (
        <p className="ws-hint ws-hint--warn">
          AVIF is not supported in this browser — WebP gives the next-best compression.
        </p>
      )}
    </div>
  );
}

// ─── Workflow stack ────────────────────────────────────────────────────────

function WorkflowStack({ ops }: { ops: WorkspaceOps }) {
  const active = [
    ops.edit.enabled && "Edit",
    ops.resize.enabled && "Resize",
    ops.convert.enabled && "Convert",
    ops.compress.enabled && "Compress",
  ].filter(Boolean) as string[];
  if (!active.length) return null;
  return (
    <div className="ws-stack" aria-label="Active workflow">
      <span className="ws-stack-label">Workflow:</span>
      {active.map((name, i) => (
        <span key={name} className="ws-stack-step">
          {i > 0 && <span aria-hidden="true"> → </span>}
          {name}
        </span>
      ))}
    </div>
  );
}

// ─── Output info ───────────────────────────────────────────────────────────

function OutputInfo({
  source,
  sourceW,
  sourceH,
  result,
}: {
  source: File;
  sourceW: number;
  sourceH: number;
  result: WorkspaceState["result"];
}) {
  const reduction = result
    ? Math.max(0, Math.round((1 - result.blob.size / source.size) * 100))
    : null;
  return (
    <div className="ws-output-info">
      <div className="ws-output-col">
        <span className="ws-output-label">Original</span>
        <strong>{sourceW} × {sourceH}</strong>
        <span>{formatFileSize(source.size)}</span>
      </div>
      {result && (
        <div className="ws-output-col ws-output-col--final">
          <span className="ws-output-label">Final</span>
          <strong>{result.width} × {result.height}</strong>
          <span>{formatFileSize(result.blob.size)}</span>
          {result.mime !== source.type && (
            <span className="ws-output-format">
              {result.mime.split("/")[1].toUpperCase()}
            </span>
          )}
          {reduction !== null && reduction > 0 && (
            <span className="ws-output-saved">−{reduction}%</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared engine panel ───────────────────────────────────────────────────

function EnginePanel({
  ops,
  state,
  toggleEngine,
  setOp,
}: {
  ops: WorkspaceOps;
  state: WorkspaceState;
  toggleEngine: (key: keyof WorkspaceOps) => void;
  setOp: <K extends keyof WorkspaceOps>(key: K, partial: Partial<WorkspaceOps[K]>) => void;
}) {
  return (
    <>
      <EngineSection
        label="Edit"
        icon={Crop}
        enabled={ops.edit.enabled}
        onToggle={() => toggleEngine("edit")}
      >
        <EditControls
          cfg={ops.edit}
          onChange={(p) => setOp("edit", p)}
          sourceW={state.sourceWidth}
          sourceH={state.sourceHeight}
        />
      </EngineSection>

      <EngineSection
        label="Resize"
        icon={Maximize2}
        enabled={ops.resize.enabled}
        onToggle={() => toggleEngine("resize")}
      >
        <ResizeControls
          cfg={ops.resize}
          sourceW={state.sourceWidth}
          sourceH={state.sourceHeight}
          onChange={(p) => setOp("resize", p)}
        />
      </EngineSection>

      <EngineSection
        label="Convert"
        icon={RefreshCw}
        enabled={ops.convert.enabled}
        onToggle={() => toggleEngine("convert")}
      >
        <ConvertControls cfg={ops.convert} onChange={(p) => setOp("convert", p)} />
      </EngineSection>

      <EngineSection
        label="Compress"
        icon={SlidersHorizontal}
        enabled={ops.compress.enabled}
        onToggle={() => toggleEngine("compress")}
      >
        <CompressControls cfg={ops.compress} onChange={(p) => setOp("compress", p)} />
      </EngineSection>
    </>
  );
}

// ─── Main workspace ────────────────────────────────────────────────────────

export function UniversalWorkspace({ init }: { init?: WorkspaceInitConfig }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_WORKSPACE_STATE);
  const runRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply init config once on mount
  useEffect(() => {
    if (!init) return;
    const ops: Partial<WorkspaceOps> = {};
    if (init.compress) ops.compress = { ...DEFAULT_COMPRESS, enabled: true, ...init.compress };
    if (init.resize) ops.resize = { ...DEFAULT_RESIZE, enabled: true, ...init.resize };
    if (init.edit) ops.edit = { ...DEFAULT_EDIT, enabled: true, ...init.edit };
    if (init.convert) ops.convert = { ...DEFAULT_CONVERT, enabled: true, ...init.convert };
    if (Object.keys(ops).length) {
      dispatch({ type: "SET_OPS", ops });
    } else if (init.initialEngine) {
      const key = init.initialEngine as keyof WorkspaceOps;
      dispatch({
        type: "SET_OPS",
        ops: { [key]: { ...DEFAULT_WORKSPACE_STATE.ops[key], enabled: true } } as Partial<WorkspaceOps>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load pending image from IndexedDB if available (e.g., from homepage upload)
  useEffect(() => {
    const loadPending = async () => {
      const { loadPendingImage, clearPendingImage } = await import("@/lib/workspace/store");
      const file = await loadPendingImage();
      if (file && !state.source) {
        try {
          const error = validateImageFile(file);
          if (!error) {
            const { width, height } = await imageDimensions(file);
            dispatch({ type: "SET_SOURCE", file, w: width, h: height });
            await clearPendingImage();
          }
        } catch {
          // Fall back to upload UI if loading fails
        }
      }
    };
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Run pipeline when source or ops change
  useEffect(() => {
    if (!state.source) return;
    const anyEnabled =
      state.ops.compress.enabled ||
      state.ops.resize.enabled ||
      state.ops.edit.enabled ||
      state.ops.convert.enabled;
    if (!anyEnabled) {
      dispatch({ type: "SET_RESULT", result: null });
      return;
    }

    const id = ++runRef.current;
    dispatch({ type: "SET_STATUS", status: "processing" });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await runPipeline(state.source!, state.ops);
        if (runRef.current !== id) return;
        dispatch({ type: "SET_RESULT", result });
        dispatch({ type: "SET_PREVIEW", mode: "final" });
      } catch (err) {
        if (runRef.current !== id) return;
        dispatch({
          type: "SET_STATUS",
          status: "error",
          error: err instanceof Error ? err.message : "Processing failed.",
        });
      }
    }, 400);
  }, [state.source, state.ops]);

  const handleFiles = useCallback(
    async ([file]: File[]) => {
      if (!file) return;
      const error = validateImageFile(file);
      if (error) {
        dispatch({ type: "SET_STATUS", status: "error", error });
        return;
      }
      try {
        const { width, height } = await imageDimensions(file);
        dispatch({ type: "SET_SOURCE", file, w: width, h: height });
        dispatch({
          type: "SET_OPS",
          ops: { resize: { ...state.ops.resize, width, height } },
        });
      } catch {
        dispatch({ type: "SET_STATUS", status: "error", error: "Could not read this image." });
      }
    },
    [state.ops.resize]
  );

  const setOp = useCallback(
    <K extends keyof WorkspaceOps>(key: K, partial: Partial<WorkspaceOps[K]>) => {
      dispatch({
        type: "SET_OPS",
        ops: { [key]: { ...state.ops[key], ...partial } } as Partial<WorkspaceOps>,
      });
    },
    [state.ops]
  );

  const toggleEngine = useCallback(
    (key: keyof WorkspaceOps) => {
      dispatch({
        type: "SET_OPS",
        ops: { [key]: { ...state.ops[key], enabled: !state.ops[key].enabled } } as Partial<WorkspaceOps>,
      });
    },
    [state.ops]
  );

  // Preview URLs
  const sourceUrl = usePreviewUrl(state.source);
  const resultUrl = usePreviewUrl(state.result?.blob ?? null);
  const displayUrl =
    state.previewMode === "original" ? sourceUrl : resultUrl ?? sourceUrl;

  // Download
  const handleDownload = useCallback(() => {
    if (!state.result) return;
    const url = URL.createObjectURL(state.result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.result.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [state.result]);

  // ── Before upload: full-width upload zone only ──────────────────────────
  if (!state.source) {
    return (
      <div className="ws-root shell">
        <div className="ws-layout ws-layout--upload-only">
          <section className="ws-preview-area">
            <div className="ws-preview-frame ws-preview-frame--upload">
              <UploadDropzone
                onFiles={handleFiles}
                error={state.status === "error" ? state.error ?? undefined : undefined}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ── After upload: two-column workspace ───────────────────────────────────
  return (
    <div className="ws-root shell">
      <div className="ws-layout">
        {/* Left: control panel */}
        <aside className="ws-panel" aria-label="Image controls">
          <div className="ws-panel-top">
            <button
              type="button"
              className="ws-new-btn"
              onClick={() => dispatch({ type: "RESET" })}
              title="Start with a new image"
            >
              <X aria-hidden="true" /> New image
            </button>
          </div>

          <WorkflowStack ops={state.ops} />

          <EnginePanel
            ops={state.ops}
            state={state}
            toggleEngine={toggleEngine}
            setOp={setOp}
          />
        </aside>

        {/* Right: preview */}
        <section className="ws-preview-area" aria-label="Image preview">
          <div className="ws-preview-frame">
            {displayUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayUrl}
                alt={
                  state.previewMode === "original"
                    ? "Original image"
                    : "Processed preview"
                }
                className="ws-preview-img"
              />
            ) : (
              <div className="ws-preview-placeholder">
                <ImageIcon aria-hidden="true" />
                <span>Preview will appear after processing</span>
              </div>
            )}

            {state.status === "processing" && (
              <div className="ws-processing-overlay" aria-live="polite">
                Processing…
              </div>
            )}

            {/* Original / Final segmented control */}
            <div className="ws-preview-toggle" role="group" aria-label="Preview mode">
              <button
                type="button"
                className={`ws-toggle-btn${state.previewMode === "original" ? " active" : ""}`}
                onClick={() => dispatch({ type: "SET_PREVIEW", mode: "original" })}
              >
                Original
              </button>
              <button
                type="button"
                className={`ws-toggle-btn${state.previewMode === "final" ? " active" : ""}`}
                onClick={() => dispatch({ type: "SET_PREVIEW", mode: "final" })}
                disabled={!state.result}
              >
                Final
              </button>
            </div>
          </div>

          {/* Output meta */}
          <OutputInfo
            source={state.source}
            sourceW={state.sourceWidth}
            sourceH={state.sourceHeight}
            result={state.result}
          />

          {state.status === "error" && state.error && (
            <p className="ws-error" role="alert">
              {state.error}
            </p>
          )}
        </section>
      </div>

      {/* Download — full-width below both columns */}
      <div className="ws-footer">
        <button
          type="button"
          className="ws-download-btn"
          onClick={handleDownload}
          disabled={!state.result || state.status === "processing"}
          aria-disabled={!state.result || state.status === "processing"}
        >
          <ArrowDownToLine aria-hidden="true" />
          Download Final Image
        </button>
      </div>
    </div>
  );
}
