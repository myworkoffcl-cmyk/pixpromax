"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/tools/image-preview";
import { ProcessingButton } from "@/components/tools/processing-button";
import { ResultActions } from "@/components/tools/result-actions";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { isImageMime, labelForMime } from "@/lib/image/format";
import { normalizeConvertibleImage, sourceFormatLabel, validateConvertibleImage } from "@/lib/image/convertible-input";
import { imageDimensions, processImage } from "@/lib/image/process";
import type { Dimensions, ImageMime, ProcessedImage } from "@/types/image";

export function ConvertTool() {
  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [sourceLabel, setSourceLabel] = useState("JPG");
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [mime, setMime] = useState<ImageMime>("image/webp");
  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState("#ffffff");
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = async ([next]: File[]) => {
    if (!next) return;
    const validation = validateConvertibleImage(next);
    if (validation) { setError(validation); return; }
    setBusy(true);
    try { const label = sourceFormatLabel(next); const normalized = await normalizeConvertibleImage(next); const size = await imageDimensions(normalized); const source = isImageMime(normalized.type) ? normalized.type : "image/jpeg"; setFile(normalized); setDisplayName(next.name); setSourceLabel(label); setDimensions(size); setMime(label === "HEIC" ? "image/jpeg" : source === "image/webp" ? "image/png" : "image/webp"); setResult(null); setError(null); } catch (reason) { setError(reason instanceof Error ? reason.message : "This image could not be opened. HEIC decoding may take longer on older devices."); } finally { setBusy(false); }
  };
  const process = async () => {
    if (!file || !dimensions) return;
    setBusy(true); setError(null);
    try { setResult(await processImage(file, { ...dimensions, mime, quality: quality / 100, background, suffix: "converted" })); } catch (reason) { setError(reason instanceof Error ? reason.message : "Conversion failed in this browser."); } finally { setBusy(false); }
  };
  const reset = () => { setFile(null); setDisplayName(""); setDimensions(null); setResult(null); setError(null); };
  if (!file) return <UploadDropzone onFiles={select} error={error} accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.heic,.heif" note={busy ? "Preparing your image locally…" : "JPG, PNG, WebP, AVIF, HEIC or HEIF · up to 30 MB"} />;
  const sourceMime = isImageMime(file.type) ? file.type : "image/jpeg";
  const matchingOutputMime = ["JPG", "PNG", "WebP"].includes(sourceLabel) ? sourceMime : null;
  const transparencyWarning = mime === "image/jpeg" && ["PNG", "WebP", "AVIF"].includes(sourceLabel);
  return (
    <div className="tool-panel">
      <div className="preview-grid"><ImagePreview blob={file} label={`${sourceLabel} original`} filename={displayName} dimensions={dimensions} />{result ? <ImagePreview blob={result.blob} label={`${labelForMime(mime)} result`} filename={result.filename} dimensions={result} /> : <div className="preview-card result-placeholder"><span>Your converted image will appear here.</span></div>}</div>
      <div className="control-card">
        <div className="control-heading"><div><span className="kicker">FORMAT</span><h2>Choose what comes next.</h2></div><span className="format-change">{sourceLabel} → {labelForMime(mime)}</span></div>
        <div className="format-options">{(["image/jpeg", "image/png", "image/webp"] as ImageMime[]).filter((option) => option !== matchingOutputMime).map((option) => <button key={option} className={mime === option ? "active" : ""} type="button" onClick={() => { setMime(option); setResult(null); }}>{labelForMime(option)}</button>)}</div>
        {transparencyWarning && <div className="notice warning"><AlertTriangle /> Transparent areas will use your chosen JPEG background color.</div>}
        <div className="field-grid"><label><span>Output quality · {quality}%</span><input type="range" min="30" max="100" value={quality} disabled={mime === "image/png"} onChange={(event) => setQuality(Number(event.target.value))} /></label>{mime === "image/jpeg" && <label><span>JPEG background</span><span className="color-field"><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /><code>{background}</code></span></label>}</div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Convert image</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another image</button></div>}
      </div>
    </div>
  );
}
