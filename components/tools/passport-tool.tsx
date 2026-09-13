"use client";

import Image from "next/image";
import { useState } from "react";
import { ResultActions } from "@/components/tools/result-actions";
import { ProcessingButton } from "@/components/tools/processing-button";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { useObjectUrl } from "@/components/tools/use-object-url";
import { passportPresets } from "@/config/passport";
import { createPassportPhoto, presetPixels } from "@/lib/image/passport";
import { validateImageFile } from "@/lib/image/validate";
import type { ProcessedImage } from "@/types/image";

export function PassportTool() {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState(passportPresets[0].id);
  const [customWidth, setCustomWidth] = useState(900);
  const [customHeight, setCustomHeight] = useState(900);
  const [zoom, setZoom] = useState(1.15);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceUrl = useObjectUrl(file);
  const resultUrl = useObjectUrl(result?.blob ?? null);
  const basePreset = passportPresets.find((preset) => preset.id === presetId) ?? passportPresets[0];
  const preset = presetId === "custom" ? { ...basePreset, width: customWidth, height: customHeight } : basePreset;
  const pixels = presetPixels(preset);
  const select = ([next]: File[]) => { if (!next) return; const validation = validateImageFile(next); if (validation) { setError(validation); return; } setFile(next); setResult(null); setError(null); };
  const process = async () => { if (!file) return; if (pixels.width < 100 || pixels.height < 100 || pixels.width > 4000 || pixels.height > 4000) { setError("Custom output dimensions must be between 100 and 4,000 pixels."); return; } setBusy(true); setError(null); try { setResult(await createPassportPhoto(file, preset, zoom, offsetX, offsetY)); } catch (reason) { setError(reason instanceof Error ? reason.message : "The photo could not be prepared."); } finally { setBusy(false); } };
  const reset = () => { setFile(null); setResult(null); setError(null); setZoom(1.15); setOffsetX(0); setOffsetY(0); };
  if (!file) return <UploadDropzone onFiles={select} error={error} />;
  return <div className="tool-panel passport-panel"><div className="passport-editor"><div><span className="kicker">ADJUST CROP</span><div className="passport-stage" style={{ aspectRatio: `${pixels.width}/${pixels.height}` }}>{sourceUrl && <Image src={sourceUrl} fill unoptimized draggable={false} alt="Portrait crop preview" style={{ objectFit: "cover", transform: `translate(${offsetX / 4}%, ${offsetY / 4}%) scale(${zoom})` }} />}<div className="face-guide"><span /></div></div><small>Keep the face centered with comfortable space around the head.</small></div><div><span className="kicker">OUTPUT PREVIEW</span><div className="passport-stage result" style={{ aspectRatio: `${pixels.width}/${pixels.height}` }}>{resultUrl ? <Image src={resultUrl} fill unoptimized alt="Finished passport photo preview" /> : <span>{pixels.width} × {pixels.height} px</span>}</div><small>Verify the current official requirements before submitting.</small></div></div><div className="control-card"><div className="control-heading"><div><span className="kicker">PHOTO PRESET</span><h2>Frame the portrait.</h2></div><strong>{preset.name}</strong></div><div className="preset-cards">{passportPresets.map((option) => <button key={option.id} className={presetId === option.id ? "active" : ""} type="button" onClick={() => { setPresetId(option.id); setResult(null); }}><strong>{option.name}</strong><small>{option.description}</small></button>)}</div>{presetId === "custom" && <div className="field-grid"><label><span>Width (px)</span><input type="number" min="100" max="4000" value={customWidth} onChange={(event) => setCustomWidth(Number(event.target.value))} /></label><label><span>Height (px)</span><input type="number" min="100" max="4000" value={customHeight} onChange={(event) => setCustomHeight(Number(event.target.value))} /></label></div>}<div className="requirement-card"><div><span>Authority</span><strong>{preset.authority}</strong><small>{preset.fileSize ? `File size: ${preset.fileSize}` : "Check the selected application channel"}</small></div><div><span>Last checked</span><strong>{preset.lastVerified}</strong>{preset.sourceUrl && <a href={preset.sourceUrl} target="_blank" rel="noreferrer">Official source ↗</a>}</div></div><div className="range-stack"><label><span>Zoom · {zoom.toFixed(2)}×</span><input type="range" min="1" max="2.5" step=".01" value={zoom} onChange={(event) => { setZoom(Number(event.target.value)); setResult(null); }} /></label><label><span>Horizontal position</span><input type="range" min="-100" max="100" value={offsetX} onChange={(event) => { setOffsetX(Number(event.target.value)); setResult(null); }} /></label><label><span>Vertical position</span><input type="range" min="-100" max="100" value={offsetY} onChange={(event) => { setOffsetY(Number(event.target.value)); setResult(null); }} /></label></div><div className="notice">Recommended background: {preset.backgroundRecommendation}. PixProMax prepares the crop and dimensions but cannot guarantee acceptance.</div>{error && <p className="form-error" role="alert">{error}</p>}{result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Create passport photo</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another portrait</button></div>}</div></div>;
}
