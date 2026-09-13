"use client";

import Image from "next/image";
import { FlipHorizontal2, FlipVertical2, RotateCw } from "lucide-react";
import { useState } from "react";
import { ImagePreview } from "@/components/tools/image-preview";
import { ProcessingButton } from "@/components/tools/processing-button";
import { ResultActions } from "@/components/tools/result-actions";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { useObjectUrl } from "@/components/tools/use-object-url";
import { cropImage } from "@/lib/image/crop";
import { isImageMime } from "@/lib/image/format";
import { imageDimensions } from "@/lib/image/process";
import { validateImageFile } from "@/lib/image/validate";
import type { Dimensions, ImageMime, ProcessedImage } from "@/types/image";

const aspects = [
  { label: "Free", value: null },
  { label: "Square", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
];

export function CropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [aspect, setAspect] = useState<number | null>(1);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [mime, setMime] = useState<ImageMime>("image/webp");
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceUrl = useObjectUrl(file);

  const select = async ([next]: File[]) => {
    if (!next) return;
    const validation = validateImageFile(next);
    if (validation) { setError(validation); return; }
    try {
      setDimensions(await imageDimensions(next));
      setMime(isImageMime(next.type) ? next.type : "image/webp");
      setFile(next);
      setResult(null);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This image could not be opened.");
    }
  };
  const changed = () => setResult(null);
  const process = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try { setResult(await cropImage(file, { aspectRatio: aspect, zoom, offsetX, offsetY, rotation, flipX, flipY, mime, quality: .92 })); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The image could not be cropped."); }
    finally { setBusy(false); }
  };
  const reset = () => { setFile(null); setDimensions(null); setResult(null); setError(null); setZoom(1); setOffsetX(0); setOffsetY(0); setRotation(0); setFlipX(false); setFlipY(false); };

  if (!file) return <UploadDropzone onFiles={select} error={error} />;
  return <div className="tool-panel"><div className="crop-editor"><div><span className="kicker">CROP PREVIEW</span><div className="crop-stage" style={{ aspectRatio: aspect ? String(aspect) : dimensions ? `${dimensions.width}/${dimensions.height}` : "1" }}>{sourceUrl && <Image src={sourceUrl} fill unoptimized draggable={false} alt="Crop preview" style={{ objectFit: "cover", transform: `translate(${offsetX / 5}%, ${offsetY / 5}%) scale(${zoom}) rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})` }} />}<span className="crop-grid" /></div><small>The grid previews framing; the export uses the original pixels.</small></div>{result ? <ImagePreview blob={result.blob} label="Cropped result" filename={result.filename} dimensions={result} /> : <div className="preview-card result-placeholder"><span>Your cropped result will appear here.</span></div>}</div><div className="control-card"><div className="control-heading"><div><span className="kicker">FRAME</span><h2>Choose the crop.</h2></div><strong>{dimensions?.width} × {dimensions?.height}</strong></div><div className="preset-row">{aspects.map((option) => <button type="button" className={aspect === option.value ? "active" : ""} key={option.label} onClick={() => { setAspect(option.value); changed(); }}>{option.label}</button>)}</div><div className="range-stack"><label><span>Zoom · {zoom.toFixed(2)}×</span><input type="range" min="1" max="3" step=".01" value={zoom} onChange={(event) => { setZoom(Number(event.target.value)); changed(); }} /></label><label><span>Horizontal position</span><input type="range" min="-100" max="100" value={offsetX} onChange={(event) => { setOffsetX(Number(event.target.value)); changed(); }} /></label><label><span>Vertical position</span><input type="range" min="-100" max="100" value={offsetY} onChange={(event) => { setOffsetY(Number(event.target.value)); changed(); }} /></label></div><div className="edit-button-row"><button type="button" onClick={() => { setRotation(((rotation + 90) % 360) as 0 | 90 | 180 | 270); changed(); }}><RotateCw /> Rotate 90°</button><button type="button" className={flipX ? "active" : ""} onClick={() => { setFlipX(!flipX); changed(); }}><FlipHorizontal2 /> Flip horizontal</button><button type="button" className={flipY ? "active" : ""} onClick={() => { setFlipY(!flipY); changed(); }}><FlipVertical2 /> Flip vertical</button></div><label className="single-field"><span>Output format</span><select value={mime} onChange={(event) => { setMime(event.target.value as ImageMime); changed(); }}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>{error && <p className="form-error" role="alert">{error}</p>}{result ? <ResultActions result={result} onReset={reset} /> : <div className="action-row"><ProcessingButton busy={busy} onClick={process}>Crop image</ProcessingButton><button className="text-button" type="button" onClick={reset}>Choose another image</button></div>}</div></div>;
}
