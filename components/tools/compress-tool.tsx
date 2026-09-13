"use client";

import { useState } from "react";
import { ImagePreview } from "@/components/tools/image-preview";
import { ProcessingButton } from "@/components/tools/processing-button";
import { ResultActions } from "@/components/tools/result-actions";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { compressImage } from "@/lib/image/compress";
import { imageDimensions } from "@/lib/image/process";
import { formatFileSize, formatPercentSaved } from "@/lib/image/format-size";
import { validateImageFile } from "@/lib/image/validate";
import type { Dimensions, ProcessedImage } from "@/types/image";

export function CompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [quality, setQuality] = useState(78);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = async ([next]: File[]) => {
    if (!next) return;
    const validation = validateImageFile(next);
    if (validation) { setError(validation); return; }
    setBusy(true);
    try {
      const size = await imageDimensions(next);
      setDimensions(size);
      setFile(next);
      setResult(null);
      setError(null);
      setResult(await compressImage(next, quality / 100));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "This image could not be compressed."); }
    finally { setBusy(false); }
  };
  const reset = () => { setFile(null); setDimensions(null); setResult(null); setError(null); setQuality(78); };
  const process = async () => {
    if (!file) return;
    setBusy(true); setError(null);
    try { setResult(await compressImage(file, quality / 100)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Compression failed. Try a smaller image."); } finally { setBusy(false); }
  };
  const chooseQuality = (value: number) => { setQuality(value); setResult(null); };

  if (!file) return <UploadDropzone onFiles={select} error={error} />;
  return (
    <div className="tool-panel">
      <div className="preview-grid"><ImagePreview blob={file} label="Original" filename={file.name} dimensions={dimensions} />{result ? <ImagePreview blob={result.blob} label="Compressed" filename={result.filename} dimensions={result} /> : <div className="preview-card result-placeholder"><span>{busy ? "Compressing locally…" : "Your compressed preview will appear here."}</span></div>}</div>
      <div className="control-card">
        <div className="control-heading"><div><span className="kicker">COMPRESSION</span><h2>{result ? "Your image is ready." : "Choose the balance."}</h2></div><strong>{quality}%</strong></div>
        <div className="preset-row compression-presets"><button type="button" className={quality === 58 ? "active" : ""} onClick={() => chooseQuality(58)}>Smaller file</button><button type="button" className={quality === 78 ? "active" : ""} onClick={() => chooseQuality(78)}>Balanced</button><button type="button" className={quality === 90 ? "active" : ""} onClick={() => chooseQuality(90)}>High quality</button></div>
        <label className="range-field"><span>Output quality · {quality}%</span><input type="range" min="20" max="95" value={quality} onChange={(event) => chooseQuality(Number(event.target.value))} /><div><small>Smaller file</small><small>Sharper image</small></div></label>
        {result && <div className="stat-row"><span><small>Original</small><strong>{formatFileSize(file.size)}</strong></span><span><small>Compressed</small><strong>{formatFileSize(result.blob.size)}</strong></span><span className="positive"><small>Saved</small><strong>{formatPercentSaved(file.size, result.blob.size)}</strong></span></div>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Compress image</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another image</button></div>}
      </div>
    </div>
  );
}
