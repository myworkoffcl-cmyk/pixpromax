"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/tools/image-preview";
import { ProcessingButton } from "@/components/tools/processing-button";
import { ResultActions } from "@/components/tools/result-actions";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { formatFileSize } from "@/lib/image/format-size";
import { imageDimensions } from "@/lib/image/process";
import { optimizeToTarget } from "@/lib/image/target-size";
import { validateImageFile } from "@/lib/image/validate";
import type { Dimensions, ProcessedImage } from "@/types/image";

const targets = [20, 50, 100, 200, 500];

export function TargetSizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [target, setTarget] = useState(100);
  const [custom, setCustom] = useState(false);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const select = async ([next]: File[]) => { if (!next) return; const validation = validateImageFile(next); if (validation) { setError(validation); return; } try { setDimensions(await imageDimensions(next)); setFile(next); setResult(null); setError(null); } catch (reason) { setError(reason instanceof Error ? reason.message : "This image could not be opened."); } };
  const process = async () => { if (!file || !dimensions) return; if (target < 5 || target > 5000) { setError("Choose a target between 5 KB and 5,000 KB."); return; } setBusy(true); setError(null); try { setResult(await optimizeToTarget(file, target * 1024, dimensions)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Target-size optimization failed."); } finally { setBusy(false); } };
  const reset = () => { setFile(null); setDimensions(null); setResult(null); setError(null); };
  if (!file) return <UploadDropzone onFiles={select} error={error} />;
  const difference = result ? (result.blob.size - target * 1024) / 1024 : 0;
  return <div className="tool-panel"><div className="preview-grid"><ImagePreview blob={file} label="Original" filename={file.name} dimensions={dimensions} />{result ? <ImagePreview blob={result.blob} label={`Target: ${target} KB`} filename={result.filename} dimensions={result} /> : <div className="preview-card result-placeholder"><span>Your optimized image will appear here.</span></div>}</div><div className="control-card"><div className="control-heading"><div><span className="kicker">TARGET SIZE</span><h2>How small should it be?</h2></div><strong>{target} KB</strong></div><div className="format-options target-options">{targets.map((value) => <button type="button" className={!custom && target === value ? "active" : ""} key={value} onClick={() => { setTarget(value); setCustom(false); setResult(null); }}>{value} KB</button>)}<button type="button" className={custom ? "active" : ""} onClick={() => setCustom(true)}>Custom</button></div><label className="range-field target-slider"><span>Target size · {target} KB</span><input type="range" min="5" max="1000" step="5" value={Math.min(target, 1000)} onChange={(event) => { setTarget(Number(event.target.value)); setCustom(true); setResult(null); }} /><div><small>5 KB</small><small>1,000 KB</small></div></label>{custom && <label className="single-field"><span>Exact custom target (KB)</span><input type="number" min="5" max="5000" value={target} onChange={(event) => { setTarget(Number(event.target.value)); setResult(null); }} /></label>}<div className="notice"><Info /> The result will stay at or below your chosen limit (1 KB = 1,024 bytes). If it cannot fit, choose a larger limit or crop the image first.</div>{result && <div className="stat-row"><span><small>Original</small><strong>{formatFileSize(file.size)}</strong></span><span><small>Final</small><strong>{formatFileSize(result.blob.size)}</strong></span><span className={Math.abs(difference) <= target * .08 ? "positive" : ""}><small>Difference</small><strong>{difference > 0 ? "+" : ""}{difference.toFixed(1)} KB</strong></span><span><small>Quality</small><strong>{Math.round((result.quality ?? 0) * 100)}%</strong></span></div>}{error && <p className="form-error" role="alert">{error}</p>}{result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Optimize to {target} KB</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another image</button></div>}</div></div>;
}
