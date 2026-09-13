"use client";

import { Link2, Link2Off } from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/tools/image-preview";
import { ProcessingButton } from "@/components/tools/processing-button";
import { ResultActions } from "@/components/tools/result-actions";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { imageDimensions, processImage } from "@/lib/image/process";
import { validateDimensions } from "@/lib/image/dimensions";
import { validateImageFile } from "@/lib/image/validate";
import type { Dimensions, ImageMime, ProcessedImage } from "@/types/image";

const presets = [{ label: "Instagram square", width: 1080, height: 1080 }, { label: "Full HD", width: 1920, height: 1080 }, { label: "Web banner", width: 1200, height: 630 }, { label: "Half size", scale: .5 }];

export function ResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<Dimensions | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [quality, setQuality] = useState(90);
  const [mime, setMime] = useState<ImageMime>("image/webp");
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = async ([next]: File[]) => {
    if (!next) return;
    const validation = validateImageFile(next);
    if (validation) { setError(validation); return; }
    try { const size = await imageDimensions(next); setFile(next); setOriginal(size); setWidth(size.width); setHeight(size.height); setResult(null); setError(null); } catch (reason) { setError(reason instanceof Error ? reason.message : "This image could not be opened."); }
  };
  const changeWidth = (value: number) => { setWidth(value); if (locked && original && value > 0) setHeight(Math.max(1, Math.round(value * original.height / original.width))); };
  const changeHeight = (value: number) => { setHeight(value); if (locked && original && value > 0) setWidth(Math.max(1, Math.round(value * original.width / original.height))); };
  const applyPreset = (preset: (typeof presets)[number]) => { if (!original) return; if (preset.scale) { setWidth(Math.round(original.width * preset.scale)); setHeight(Math.round(original.height * preset.scale)); } else { setWidth(preset.width ?? original.width); setHeight(preset.height ?? original.height); } setResult(null); };
  const process = async () => {
    if (!file) return;
    const issue = validateDimensions({ width, height });
    if (issue) { setError(issue); return; }
    setBusy(true); setError(null);
    try { setResult(await processImage(file, { width, height, mime, quality: quality / 100, background: "#ffffff", suffix: "resized" })); } catch (reason) { setError(reason instanceof Error ? reason.message : "Resizing failed. Try smaller dimensions."); } finally { setBusy(false); }
  };
  const reset = () => { setFile(null); setOriginal(null); setResult(null); setError(null); };

  if (!file) return <UploadDropzone onFiles={select} error={error} />;
  return (
    <div className="tool-panel">
      <div className="preview-grid"><ImagePreview blob={file} label="Original" filename={file.name} dimensions={original} />{result ? <ImagePreview blob={result.blob} label="Resized" filename={result.filename} dimensions={result} /> : <div className="preview-card result-placeholder"><span>Set your dimensions to create a resized preview.</span></div>}</div>
      <div className="control-card">
        <div className="control-heading"><div><span className="kicker">DIMENSIONS</span><h2>Shape the output.</h2></div><button className={`lock-button ${locked ? "active" : ""}`} type="button" onClick={() => setLocked(!locked)} aria-pressed={locked}>{locked ? <Link2 /> : <Link2Off />}{locked ? "Ratio locked" : "Ratio free"}</button></div>
        <div className="field-grid"><label><span>Width (px)</span><input type="number" min="1" value={width || ""} onChange={(event) => changeWidth(Number(event.target.value))} /></label><label><span>Height (px)</span><input type="number" min="1" value={height || ""} onChange={(event) => changeHeight(Number(event.target.value))} /></label></div>
        <div className="preset-row">{presets.map((preset) => <button type="button" key={preset.label} onClick={() => applyPreset(preset)}>{preset.label}</button>)}</div>
        <div className="field-grid"><label><span>Output format</span><select value={mime} onChange={(event) => setMime(event.target.value as ImageMime)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label><label><span>Quality · {quality}%</span><input type="range" min="30" max="100" value={quality} disabled={mime === "image/png"} onChange={(event) => setQuality(Number(event.target.value))} /></label></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Resize image</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another image</button></div>}
      </div>
    </div>
  );
}
