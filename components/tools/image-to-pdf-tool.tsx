"use client";

import Image from "next/image";
import { FilePlus2, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProcessingButton } from "@/components/tools/processing-button";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { MAX_BATCH_FILES, MAX_BATCH_TOTAL_SIZE } from "@/config/limits";
import { DownloadLink } from "@/components/tools/download-link";
import { createImagePdf, type PdfOrientation, type PdfPageSize } from "@/lib/pdf/create-image-pdf";
import { validateImageFile } from "@/lib/image/validate";

interface PdfItem { id: string; file: File; url: string }

export function ImageToPdfTool() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [pageSize, setPageSize] = useState<PdfPageSize>("a4");
  const [orientation, setOrientation] = useState<PdfOrientation>("portrait");
  const [margin, setMargin] = useState(28);
  const [result, setResult] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urls = useRef(new Set<string>());
  useEffect(() => { const current = urls.current; return () => current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const addFiles = (files: File[]) => {
    if (items.length + files.length > MAX_BATCH_FILES) { setError(`Choose up to ${MAX_BATCH_FILES} images.`); return; }
    const invalid = files.map(validateImageFile).find(Boolean);
    if (invalid) { setError(invalid); return; }
    if ([...items.map((item) => item.file), ...files].reduce((sum, file) => sum + file.size, 0) > MAX_BATCH_TOTAL_SIZE) { setError("The selected images exceed the 150 MB batch limit."); return; }
    const additions = files.map((file) => { const url = URL.createObjectURL(file); urls.current.add(url); return { id: crypto.randomUUID(), file, url }; });
    setItems((current) => [...current, ...additions]);
    setResult(null);
    setError(null);
  };
  const remove = (id: string) => setItems((current) => { const item = current.find((entry) => entry.id === id); if (item) { URL.revokeObjectURL(item.url); urls.current.delete(item.url); } return current.filter((entry) => entry.id !== id); });
  const move = (index: number, direction: -1 | 1) => setItems((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const copy = [...current]; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy; });
  const create = async () => { setBusy(true); setError(null); try { setResult(await createImagePdf(items.map((item) => item.file), { pageSize, orientation, margin, quality: .9 })); } catch (reason) { setError(reason instanceof Error ? reason.message : "The PDF could not be created."); } finally { setBusy(false); } };

  if (!items.length) return <UploadDropzone multiple onFiles={addFiles} error={error} />;
  return <div className="tool-panel"><div className="control-card"><div className="control-heading"><div><span className="kicker">PDF PAGES</span><h2>Arrange your images.</h2></div><strong>{items.length} {items.length === 1 ? "page" : "pages"}</strong></div><div className="pdf-image-grid">{items.map((item, index) => <article key={item.id}><div><Image src={item.url} fill unoptimized alt={`PDF page ${index + 1}: ${item.file.name}`} /></div><span><GripVertical aria-hidden="true" /><strong>{index + 1}</strong><small title={item.file.name}>{item.file.name}</small></span><nav aria-label={`Reorder ${item.file.name}`}><button type="button" disabled={index === 0} onClick={() => move(index, -1)}>←</button><button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)}>→</button><button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => remove(item.id)}><Trash2 /></button></nav></article>)}</div><UploadDropzone multiple compact onFiles={addFiles} error={error} /></div><div className="control-card"><div className="control-heading"><div><span className="kicker">PAGE SETTINGS</span><h2>Choose the document layout.</h2></div></div><div className="field-grid"><label><span>Page size</span><select value={pageSize} onChange={(event) => { setPageSize(event.target.value as PdfPageSize); setResult(null); }}><option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Fit each image</option></select></label><label><span>Orientation</span><select value={orientation} disabled={pageSize === "fit"} onChange={(event) => { setOrientation(event.target.value as PdfOrientation); setResult(null); }}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label><label><span>Margin · {margin} pt</span><input type="range" min="0" max="72" value={margin} disabled={pageSize === "fit"} onChange={(event) => { setMargin(Number(event.target.value)); setResult(null); }} /></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="action-row">{result ? <DownloadLink blob={result} filename="pixpromax-images.pdf">Download PDF</DownloadLink> : <ProcessingButton busy={busy} onClick={create}>Create PDF</ProcessingButton>}<button className="button secondary" type="button" onClick={() => { setItems([]); setResult(null); setError(null); urls.current.forEach((url) => URL.revokeObjectURL(url)); urls.current.clear(); }}><FilePlus2 /> Start over</button></div></div></div>;
}

