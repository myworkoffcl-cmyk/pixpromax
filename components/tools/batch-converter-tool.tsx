"use client";

import JSZip from "jszip";
import { Download, RotateCcw, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { MAX_BATCH_FILES, MAX_BATCH_TOTAL_SIZE } from "@/config/limits";
import { downloadBlob } from "@/lib/image/download";
import { labelForMime } from "@/lib/image/format";
import { formatFileSize } from "@/lib/image/format-size";
import { imageDimensions, processImage } from "@/lib/image/process";
import { validateImageFile } from "@/lib/image/validate";
import type { BatchItem, ImageMime } from "@/types/image";

export function BatchConverterTool() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [mime, setMime] = useState<ImageMime>("image/webp");
  const [quality, setQuality] = useState(88);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addFiles = (files: File[]) => {
    const room = MAX_BATCH_FILES - items.length;
    if (room <= 0) { setError(`A batch can contain up to ${MAX_BATCH_FILES} files.`); return; }
    if (files.length > room) { setError(`Only ${room} more ${room === 1 ? "file" : "files"} can be added to this batch.`); return; }
    const incoming = files;
    const invalid = incoming.map(validateImageFile).find(Boolean);
    if (invalid) { setError(invalid); return; }
    if ([...items.map((item) => item.file), ...incoming].reduce((sum, file) => sum + file.size, 0) > MAX_BATCH_TOTAL_SIZE) { setError("The batch total is over the 150 MB limit."); return; }
    const additions = incoming.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      objectUrls.current.add(previewUrl);
      return { id: crypto.randomUUID(), file, previewUrl, status: "Waiting" as const };
    });
    setItems((current) => [...current, ...additions]);
    setError(null);
  };
  const update = (id: string, change: Partial<BatchItem>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...change } : item));
  const convertOne = async (item: BatchItem) => {
    update(item.id, { status: "Processing", error: undefined });
    try { const size = await imageDimensions(item.file); const result = await processImage(item.file, { ...size, mime, quality: quality / 100, background: "#ffffff", suffix: "converted" }); update(item.id, { status: "Complete", result }); } catch (reason) { update(item.id, { status: "Error", error: reason instanceof Error ? reason.message : "Conversion failed." }); }
  };
  const convertAll = async () => { setRunning(true); setError(null); for (const item of items.filter((entry) => entry.status !== "Complete")) await convertOne(item); setRunning(false); };
  const remove = (id: string) => setItems((current) => { const found = current.find((item) => item.id === id); if (found) { URL.revokeObjectURL(found.previewUrl); objectUrls.current.delete(found.previewUrl); } return current.filter((item) => item.id !== id); });
  const clear = () => { items.forEach((item) => { URL.revokeObjectURL(item.previewUrl); objectUrls.current.delete(item.previewUrl); }); setItems([]); setError(null); };
  const downloadZip = async () => {
    try { const zip = new JSZip(); items.forEach((item) => { if (item.result) zip.file(item.result.filename, item.result.blob); }); downloadBlob(await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } }), "pixpromax-converted-images.zip"); } catch { setError("The ZIP file could not be created. Download images individually instead."); }
  };
  const complete = items.filter((item) => item.status === "Complete").length;

  if (!items.length) return <UploadDropzone multiple onFiles={addFiles} error={error} />;
  return (
    <div className="tool-panel batch-panel">
      <div className="control-card batch-controls"><div className="control-heading"><div><span className="kicker">BATCH SETTINGS</span><h2>{complete} / {items.length} images complete</h2></div><button className="text-button danger" type="button" onClick={clear}><Trash2 /> Clear all</button></div><div className="field-grid"><label><span>Output format</span><select value={mime} onChange={(event) => setMime(event.target.value as ImageMime)} disabled={running}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label><label><span>Quality · {quality}%</span><input type="range" min="30" max="100" value={quality} disabled={running || mime === "image/png"} onChange={(event) => setQuality(Number(event.target.value))} /></label></div><UploadDropzone multiple compact onFiles={addFiles} error={error} /></div>
      <div className="batch-list" aria-live="polite">{items.map((item) => <article className="batch-row" key={item.id}><div className="batch-thumb"><Image src={item.previewUrl} fill unoptimized alt="" /></div><div className="batch-file"><strong title={item.file.name}>{item.file.name}</strong><small>{formatFileSize(item.file.size)} · {item.file.type.replace("image/", "").toUpperCase()}</small></div><span className={`batch-status status-${item.status.toLowerCase()}`}>{item.status}</span>{item.result && <strong className="batch-size">{formatFileSize(item.result.blob.size)}</strong>}<div className="batch-actions">{item.status === "Error" && <button type="button" aria-label={`Retry ${item.file.name}`} onClick={() => convertOne(item)}><RotateCcw /></button>}{item.result && <button type="button" aria-label={`Download ${item.file.name}`} onClick={() => downloadBlob(item.result!.blob, item.result!.filename)}><Download /></button>}<button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => remove(item.id)}><X /></button></div></article>)}</div>
      <div className="batch-footer"><p>Output: <strong>{labelForMime(mime)}</strong>{running && " · Processing sequentially to keep your browser responsive"}</p><div>{complete > 0 && <button className="button secondary" type="button" onClick={downloadZip}><Download /> Download all as ZIP</button>}<button className="button primary" type="button" onClick={convertAll} disabled={running}>{running ? `Processing ${complete + 1} of ${items.length}…` : "Convert all"}</button></div></div>
    </div>
  );
}
