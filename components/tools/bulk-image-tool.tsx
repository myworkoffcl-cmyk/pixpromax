"use client";

import JSZip from "jszip";
import { CheckCircle2, FileImage, FilePlus2, LoaderCircle, Trash2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MAX_BATCH_FILES, MAX_BATCH_TOTAL_SIZE } from "@/config/limits";
import { DownloadLink } from "@/components/tools/download-link";
import { ProcessingButton } from "@/components/tools/processing-button";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { compressImage } from "@/lib/image/compress";
import { formatFileSize, formatPercentSaved } from "@/lib/image/format-size";
import { fitDimensions, validateDimensions } from "@/lib/image/dimensions";
import { imageDimensions, processImage } from "@/lib/image/process";
import { validateImageFile } from "@/lib/image/validate";
import type { BatchItem } from "@/types/image";

type BulkMode = "compress" | "resize";
interface BulkImageToolProps { mode: BulkMode }

const copy: Record<BulkMode, { title: string; action: string }> = {
  compress: { title: "Choose a quality level, then compress every image.", action: "Compress all" },
  resize: { title: "Choose a target width, then resize every image.", action: "Resize all" },
};

function uniqueZipName(used: Set<string>, name: string) {
  if (!used.has(name)) { used.add(name); return name; }
  const dot = name.lastIndexOf(".");
  const stem = dot === -1 ? name : name.slice(0, dot);
  const ext = dot === -1 ? "" : name.slice(dot);
  let index = 2;
  let candidate = `${stem}-${index}${ext}`;
  while (used.has(candidate)) { index += 1; candidate = `${stem}-${index}${ext}`; }
  used.add(candidate);
  return candidate;
}

export function BulkImageTool({ mode }: BulkImageToolProps) {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [quality, setQuality] = useState(75);
  const [width, setWidth] = useState(1920);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zip, setZip] = useState<Blob | null>(null);
  const urls = useRef(new Set<string>());
  useEffect(() => { const current = urls.current; return () => current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    if (items.length + files.length > MAX_BATCH_FILES) { setError(`Choose up to ${MAX_BATCH_FILES} images.`); return; }
    const invalid = files.map(validateImageFile).find(Boolean);
    if (invalid) { setError(invalid); return; }
    if ([...items.map((item) => item.file), ...files].reduce((sum, file) => sum + file.size, 0) > MAX_BATCH_TOTAL_SIZE) { setError(`The selected images exceed the ${MAX_BATCH_TOTAL_SIZE / 1024 / 1024} MB batch limit.`); return; }
    const additions: BatchItem[] = files.map((file) => { const previewUrl = URL.createObjectURL(file); urls.current.add(previewUrl); return { id: crypto.randomUUID(), file, previewUrl, status: "Waiting" }; });
    setItems((current) => [...current, ...additions]);
    setZip(null);
    setError(null);
  };

  const removeItem = (id: string) => setItems((current) => {
    const item = current.find((entry) => entry.id === id);
    if (item) { URL.revokeObjectURL(item.previewUrl); urls.current.delete(item.previewUrl); }
    return current.filter((entry) => entry.id !== id);
  });

  const reset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    urls.current.clear();
    setItems([]); setZip(null); setError(null);
  };

  const processAll = async () => {
    if (!items.length || busy) return;
    setBusy(true); setError(null); setZip(null);
    setItems((current) => current.map((item) => ({ ...item, status: "Waiting", result: undefined, error: undefined })));

    const processed: BatchItem[] = [];
    for (const item of items) {
      setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "Processing" } : entry)));
      try {
        const result = mode === "compress"
          ? await compressImage(item.file, quality / 100)
          : await (async () => {
              const source = await imageDimensions(item.file);
              const target = fitDimensions(source, { width }, true);
              const invalidDimensions = validateDimensions(target);
              if (invalidDimensions) throw new Error(invalidDimensions);
              return processImage(item.file, { ...target, mime: item.file.type === "image/png" ? "image/png" : item.file.type === "image/webp" ? "image/webp" : "image/jpeg", quality: 0.9, suffix: "resized" });
            })();
        setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "Complete", result } : entry)));
        processed.push({ ...item, status: "Complete", result });
      } catch (reason) {
        const message = reason instanceof Error ? reason.message : "This image could not be processed.";
        setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, status: "Error", error: message } : entry)));
        processed.push({ ...item, status: "Error", error: message });
      }
    }

    const succeeded = processed.filter((item) => item.result);
    if (succeeded.length) {
      const zipFile = new JSZip();
      const used = new Set<string>();
      for (const item of succeeded) zipFile.file(uniqueZipName(used, item.result!.filename), item.result!.blob);
      setZip(await zipFile.generateAsync({ type: "blob" }));
    }
    if (!succeeded.length) setError("None of the images could be processed.");
    setBusy(false);
  };

  if (!items.length) return <UploadDropzone multiple note={`JPG, PNG or WebP · up to ${MAX_BATCH_FILES} files`} onFiles={addFiles} error={error} />;

  const doneCount = items.filter((item) => item.status === "Complete").length;
  const errorCount = items.filter((item) => item.status === "Error").length;

  return (
    <div className="tool-panel">
      <div className="control-card">
        <div className="control-heading"><div><span className="kicker">YOUR IMAGES</span><h2>{copy[mode].title}</h2></div><strong>{items.length} files</strong></div>
        {mode === "compress"
          ? <label className="range-field"><span>Quality · {quality}%</span><input type="range" min="35" max="95" value={quality} disabled={busy} onChange={(event) => { setQuality(Number(event.target.value)); setZip(null); }} /><div><small>Smaller files</small><small>Sharper images</small></div></label>
          : <label className="single-field"><span>Target width (px)</span><input type="number" min="1" max="16000" value={width} disabled={busy} onChange={(event) => { setWidth(Number(event.target.value)); setZip(null); }} /><small>Each image is scaled to this width, keeping its own aspect ratio.</small></label>}
        <div className="pdf-file-list">
          {items.map((item) => (
            <article key={item.id}>
              <FileImage aria-hidden="true" />
              <div>
                <strong>{item.file.name}</strong>
                <small>
                  {item.status === "Waiting" && `${formatFileSize(item.file.size)} · Waiting`}
                  {item.status === "Processing" && "Processing…"}
                  {item.status === "Complete" && item.result && `${formatFileSize(item.result.blob.size)} · ${formatPercentSaved(item.file.size, item.result.blob.size)} smaller`}
                  {item.status === "Error" && (item.error ?? "Failed")}
                </small>
              </div>
              <nav aria-label={`${item.file.name} status`}>
                {item.status === "Processing" && <LoaderCircle className="spinner" aria-hidden="true" />}
                {item.status === "Complete" && item.result && <DownloadLink blob={item.result.blob} filename={item.result.filename}>Save</DownloadLink>}
                {item.status === "Error" && <XCircle aria-hidden="true" color="#9e2f35" />}
              </nav>
              <button type="button" className="remove-file" aria-label={`Remove ${item.file.name}`} disabled={busy} onClick={() => removeItem(item.id)}><Trash2 /></button>
            </article>
          ))}
        </div>
        <UploadDropzone multiple compact note={`JPG, PNG or WebP · up to ${MAX_BATCH_FILES} files`} onFiles={addFiles} error={null} />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {(doneCount > 0 || errorCount > 0) && !busy && <p className="notice"><CheckCircle2 aria-hidden="true" /> {doneCount} of {items.length} images processed{errorCount ? `, ${errorCount} failed` : ""}.</p>}
      <div className="action-row">
        {zip ? <DownloadLink blob={zip} filename={`pixpromax-${mode}ed-images.zip`}>Download ZIP ({doneCount} files)</DownloadLink> : <ProcessingButton busy={busy} onClick={processAll}>{copy[mode].action}</ProcessingButton>}
        <button className="button secondary" type="button" onClick={reset}><FilePlus2 /> Start over</button>
      </div>
    </div>
  );
}
