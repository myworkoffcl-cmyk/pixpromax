"use client";

import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/tools/image-preview";
import { ProcessingButton } from "@/components/tools/processing-button";
import { ResultActions } from "@/components/tools/result-actions";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { signaturePresets } from "@/config/application-presets";
import { formatFileSize } from "@/lib/image/format-size";
import { imageDimensions } from "@/lib/image/process";
import { optimizeToTarget } from "@/lib/image/target-size";
import { validateDimensions } from "@/lib/image/dimensions";
import { validateImageFile } from "@/lib/image/validate";
import type { Dimensions, ProcessedImage } from "@/types/image";

export function SignatureTool() {
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<Dimensions | null>(null);
  const [presetId, setPresetId] = useState(signaturePresets[0].id);
  const preset = signaturePresets.find((item) => item.id === presetId) ?? signaturePresets[0];
  const [width, setWidth] = useState(preset.width);
  const [height, setHeight] = useState(preset.height);
  const [targetKb, setTargetKb] = useState(preset.maxKb);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choosePreset = (id: string) => {
    const next = signaturePresets.find((item) => item.id === id)!;
    setPresetId(id); setWidth(next.width); setHeight(next.height); setTargetKb(next.maxKb); setResult(null);
  };
  const select = async ([next]: File[]) => {
    if (!next) return;
    const validation = validateImageFile(next);
    if (validation) { setError(validation); return; }
    try { setOriginal(await imageDimensions(next)); setFile(next); setResult(null); setError(null); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "This signature image could not be opened."); }
  };
  const process = async () => {
    if (!file) return;
    const issue = validateDimensions({ width, height });
    if (issue) { setError(issue); return; }
    if (targetKb < 5 || targetKb > 1000) { setError("Choose a target between 5 KB and 1,000 KB."); return; }
    setBusy(true); setError(null);
    try { setResult(await optimizeToTarget(file, targetKb * 1024, { width, height }, "image/jpeg")); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The signature could not be prepared."); }
    finally { setBusy(false); }
  };
  const reset = () => { setFile(null); setOriginal(null); setResult(null); setError(null); };

  if (!file) return <UploadDropzone onFiles={select} error={error} />;
  return <div className="tool-panel"><div className="preview-grid signature-preview"><ImagePreview blob={file} label="Original signature" filename={file.name} dimensions={original} />{result ? <ImagePreview blob={result.blob} label="Prepared signature" filename={result.filename} dimensions={result} /> : <div className="preview-card result-placeholder"><span>Your application-ready signature will appear here.</span></div>}</div><div className="control-card"><div className="control-heading"><div><span className="kicker">APPLICATION PRESET</span><h2>Match the portal limit.</h2></div><strong>{targetKb} KB max</strong></div><div className="preset-cards">{signaturePresets.map((option) => <button key={option.id} className={presetId === option.id ? "active" : ""} type="button" onClick={() => choosePreset(option.id)}><strong>{option.name}</strong><small>{option.note}</small></button>)}</div><div className="requirement-card"><div><span>{preset.country}</span><strong>{preset.authority}</strong><small>{preset.cycle}</small></div><div><span>Last checked</span><strong>{preset.lastVerified}</strong>{preset.sourceUrl && <a href={preset.sourceUrl} target="_blank" rel="noreferrer">Official source <ExternalLink /></a>}</div></div><div className="field-grid"><label><span>Width (px)</span><input type="number" min="50" value={width} onChange={(event) => { setWidth(Number(event.target.value)); setResult(null); }} /></label><label><span>Height (px)</span><input type="number" min="20" value={height} onChange={(event) => { setHeight(Number(event.target.value)); setResult(null); }} /></label><label><span>Maximum file size (KB)</span><input type="number" min="5" max="1000" value={targetKb} onChange={(event) => { setTargetKb(Number(event.target.value)); setResult(null); }} /></label></div><div className="notice"><Info /> PixProMax prepares dimensions and file size. It cannot guarantee acceptance; confirm the current notice and inspect the signature before submitting.</div>{result && <div className="stat-row"><span><small>Original</small><strong>{formatFileSize(file.size)}</strong></span><span><small>Final</small><strong>{formatFileSize(result.blob.size)}</strong></span><span><small>Dimensions</small><strong>{result.width} × {result.height}</strong></span><span className={result.blob.size <= targetKb * 1024 ? "positive" : ""}><small>Limit</small><strong>≤ {targetKb} KB</strong></span></div>}{error && <p className="form-error" role="alert">{error}</p>}{result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Prepare signature</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another image</button></div>}</div></div>;
}
