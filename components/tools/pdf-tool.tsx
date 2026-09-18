"use client";

import JSZip from "jszip";
import { FilePlus2, FileText, GripVertical, Info, Trash2 } from "lucide-react";
import { useState } from "react";
import { MAX_PDF_FILES } from "@/config/limits";
import { DownloadLink } from "@/components/tools/download-link";
import { ProcessingButton } from "@/components/tools/processing-button";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { PDFPreview } from "@/components/tools/pdf-preview";
import { parsePageList, validatePdfFile } from "@/lib/pdf/validate";

type PdfMode = "merge" | "split" | "organize" | "to-jpg" | "to-png";
interface PdfToolProps { mode: PdfMode }

const labels: Record<PdfMode, { action: string; multiple: boolean; hint: string }> = {
  merge: { action: "Merge & Download", multiple: true, hint: "Choose PDFs in the order you want them combined." },
  split: { action: "Extract pages", multiple: false, hint: "Choose one PDF, then enter the pages to extract." },
  organize: { action: "Organize PDF", multiple: false, hint: "Choose one PDF, then enter the page order you want to keep." },
  "to-jpg": { action: "Convert to JPG", multiple: false, hint: "Choose one PDF and export every page as a JPG image." },
  "to-png": { action: "Convert to PNG", multiple: false, hint: "Choose one PDF and export every page as a PNG image." },
};

function fileStem(name: string) { return name.replace(/\.pdf$/i, ""); }
function bytesBlob(bytes: Uint8Array, type = "application/pdf") { return new Blob([new Uint8Array(bytes)], { type }); }

export function PdfTool({ mode }: PdfToolProps) {
  const config = labels[mode];
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [quality, setQuality] = useState(84);
  const [result, setResult] = useState<Blob | null>(null);
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedPageIds, setDeletedPageIds] = useState<Set<string>>(new Set());

  const inspectPages = async (file: File) => {
    const { PDFDocument } = await import("pdf-lib");
    const document = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    return document.getPageCount();
  };
  const handlePageDelete = (pageId: string) => {
    setDeletedPageIds(prev => new Set([...prev, pageId]));
  };
  const handleAddFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,.pdf';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      addFiles(files);
    };
    input.click();
  };

  const addFiles = async (added: File[]) => {
    if (!added.length) return;
    if ((mode !== "merge" && added.length > 1) || files.length + added.length > MAX_PDF_FILES) { setError(mode === "merge" ? `Choose up to ${MAX_PDF_FILES} PDFs.` : "Choose one PDF at a time."); return; }
    const invalid = added.map(validatePdfFile).find(Boolean);
    if (invalid) { setError(invalid); return; }
    try {
      const next = mode === "merge" ? [...files, ...added] : [added[0]];
      setFiles(next); setResult(null); setError(null);
      if (files.length === 0) setDeletedPageIds(new Set());
      if (mode !== "merge") { const count = await inspectPages(added[0]); setPageCount(count); setPages(mode === "organize" ? Array.from({ length: count }, (_, i) => i + 1).join(", ") : `1-${count}`); }
    } catch { setError("This PDF could not be read. It may be password protected or damaged."); setPageCount(0); }
  };
  const move = (index: number, direction: -1 | 1) => setFiles(current => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    setDeletedPageIds(prev => {
      const updated = new Set<string>();
      prev.forEach(pageId => {
        const [fileIdx, pageNum] = pageId.split('-');
        const fileIndex = parseInt(fileIdx);
        if (fileIndex === index) updated.add(`${target}-${pageNum}`);
        else if (fileIndex === target) updated.add(`${index}-${pageNum}`);
        else updated.add(pageId);
      });
      return updated;
    });
    return next;
  });
  const deleteFile = (index: number) => {
    setFiles(current => current.filter((_, i) => i !== index));
    setDeletedPageIds(prev => {
      const updated = new Set<string>();
      prev.forEach(pageId => {
        const [fileIdx, pageNum] = pageId.split('-');
        const fileIndex = parseInt(fileIdx);
        if (fileIndex > index) updated.add(`${fileIndex - 1}-${pageNum}`);
        else if (fileIndex < index) updated.add(pageId);
      });
      return updated;
    });
  };
  const reset = () => { setFiles([]); setResult(null); setError(null); setPageCount(0); setPages(""); };
  const downloadPDF = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const process = async () => {
    if (!files.length) return;
    setBusy(true); setError(null);
    try {
      if (mode === "merge") {
        const { PDFDocument } = await import("pdf-lib");
        const output = await PDFDocument.create();
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
          const allIndices = source.getPageIndices();
          const indicesToCopy = allIndices.filter(pageIndex => {
            const pageId = `${fileIndex}-${pageIndex + 1}`;
            return !deletedPageIds.has(pageId);
          });
          if (indicesToCopy.length > 0) {
            const copied = await output.copyPages(source, indicesToCopy);
            copied.forEach(page => output.addPage(page));
          }
        }
        const mergedBlob = bytesBlob(await output.save({ useObjectStreams: false }));
        setResult(mergedBlob);
        setFilename("pixpromax-merged.pdf");
        downloadPDF(mergedBlob, "pixpromax-merged.pdf");
      } else if (mode === "split" || mode === "organize") {
        const wanted = parsePageList(pages, pageCount);
        if (!wanted) throw new Error(`Enter page numbers from 1 to ${pageCount}, such as 1-3, 5.`);
        const { PDFDocument } = await import("pdf-lib");
        const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
        const output = await PDFDocument.create();
        const copied = await output.copyPages(source, wanted.map(page => page - 1)); copied.forEach(page => output.addPage(page));
        setResult(bytesBlob(await output.save({ useObjectStreams: false }))); setFilename(`${fileStem(files[0].name)}-${mode === "split" ? "pages" : "organized"}.pdf`);
      } else {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).href;
        const pdfDocument = await pdfjs.getDocument({ data: new Uint8Array(await files[0].arrayBuffer()) }).promise;
        const zip = new JSZip();
        const isJpeg = mode === "to-jpg";
        const imageType = isJpeg ? "image/jpeg" : "image/png";
        const ext = isJpeg ? "jpg" : "png";
        for (let index = 1; index <= pdfDocument.numPages; index += 1) {
          const page = await pdfDocument.getPage(index); const viewport = page.getViewport({ scale: 1.5 });
          const canvas = window.document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext("2d"); if (!context) throw new Error("Your browser cannot render this PDF.");
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          const image = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("A PDF page could not be converted.")), imageType, isJpeg ? quality / 100 : undefined));
          canvas.width = 1; canvas.height = 1;
          zip.file(`${fileStem(files[0].name)}-page-${index}.${ext}`, image);
        }
        setResult(await zip.generateAsync({ type: "blob" })); setFilename(`${fileStem(files[0].name)}-${ext}.zip`);
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The PDF could not be processed."); }
    finally { setBusy(false); }
  };

  if (!files.length) return <UploadDropzone accept="application/pdf,.pdf" multiple={config.multiple} fileKind="PDF" note={`PDF · ${config.multiple ? `up to ${MAX_PDF_FILES} files` : "up to 100 MB"}`} onFiles={addFiles} error={error} />;
  return <><div className="tool-panel"><div className="control-card"><div className="control-heading"><div><span className="kicker">YOUR PDF{config.multiple ? "S" : ""}</span><h2>{config.hint}</h2></div><strong>{mode === "merge" ? `${files.length} ${files.length === 1 ? "file" : "files"}` : `${pageCount} pages`}</strong></div><div className="pdf-file-list merge-enhanced">{files.map((file, index) => <article key={`${file.name}-${index}`} className="pdf-file-item"><div className="file-position">{index + 1}</div><div className="file-icon"><FileText aria-hidden="true" /></div><div className="file-info"><strong>{file.name}</strong><small>{Math.ceil(file.size / 1024)} KB</small></div>{mode === "merge" && <nav className="file-controls" aria-label={`Reorder ${file.name}`}><button type="button" className="reorder-btn" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${file.name} up`} title="Move up"><GripVertical /></button><button type="button" className="reorder-btn" disabled={index === files.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${file.name} down`} title="Move down"><GripVertical style={{transform: 'rotate(180deg)'}} /></button></nav>}<button type="button" className="remove-file" aria-label={`Remove ${file.name}`} onClick={() => { setFiles(current => current.filter((_, itemIndex) => itemIndex !== index)); setResult(null); }}><Trash2 /></button></article>)}</div>{mode === "merge" && <UploadDropzone accept="application/pdf,.pdf" multiple compact onFiles={addFiles} error={error} />}</div>{mode === "merge" && <div className="preview-grid"><PDFPreview files={files} onPageDelete={handlePageDelete} deletedPageIds={deletedPageIds} onAddFiles={handleAddFiles} onMoveFile={move} onDeleteFile={deleteFile} /></div>}{mode !== "merge" && <div className="control-card"><div className="control-heading"><div><span className="kicker">PAGE SETTINGS</span><h2>{mode === "to-jpg" ? "Choose output quality." : "Choose the pages."}</h2></div></div>{mode === "to-jpg" ? <label className="range-field"><span>JPG quality · {quality}%</span><input type="range" min="55" max="95" value={quality} onChange={event => { setQuality(Number(event.target.value)); setResult(null); }} /><div><small>Smaller files</small><small>Sharper images</small></div></label> : <label className="single-field"><span>{mode === "organize" ? "Page order to keep" : "Pages to extract"}</span><input value={pages} onChange={event => { setPages(event.target.value); setResult(null); }} aria-describedby="page-help" /><small id="page-help">Use commas or ranges: 1-3, 5. Repeating a page is allowed when organizing.</small></label>}<div className="notice"><Info /> Processing stays on this device. Password-protected or damaged PDFs may not open.</div></div>}{error && <p className="form-error" role="alert">{error}</p>}{busy && mode === "merge" && files.length > 2 && <p className="notice"><Info /> Merging large PDFs can take a minute — keep this tab open.</p>}{mode !== "merge" && <div className="action-row">{result ? <DownloadLink blob={result} filename={filename}>Download {mode === "to-jpg" ? "JPG ZIP" : "PDF"}</DownloadLink> : <ProcessingButton busy={busy} disabled={mode !== "merge" && pageCount === 0} onClick={process}>{config.action}</ProcessingButton>}<button className="button secondary" type="button" onClick={reset}><FilePlus2 /> Start over</button></div>}</div>{mode === "merge" && <div className="action-row">{result ? <DownloadLink blob={result} filename={filename}>Download PDF</DownloadLink> : <ProcessingButton busy={busy} onClick={process}>{config.action}</ProcessingButton>}<button className="button secondary" type="button" onClick={reset}><FilePlus2 /> Start over</button></div>}</>
}
