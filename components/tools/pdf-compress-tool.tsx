"use client";

import { FilePlus2, FileText, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { MAX_PDF_FILES } from "@/config/limits";
import { DownloadLink } from "@/components/tools/download-link";
import { ProcessingButton } from "@/components/tools/processing-button";
import { UploadDropzone } from "@/components/tools/upload-dropzone";
import { validatePdfFile } from "@/lib/pdf/validate";

interface PdfItem { file: File }

export function PdfCompressTool() {
  const [item, setItem] = useState<PdfItem | null>(null);
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFile = (files: File[]) => {
    if (!files.length) return;
    if (files.length > 1) { setError("Choose one PDF at a time."); return; }
    const invalid = validatePdfFile(files[0]);
    if (invalid) { setError(invalid); return; }
    setItem({ file: files[0] }); setOriginalSize(files[0].size); setResult(null); setError(null);
  };

  const compress = async () => {
    if (!item) return;
    setBusy(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(await item.file.arrayBuffer(), { ignoreEncryption: true });

      const compressed = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(compressed)], { type: "application/pdf" });

      setResult(blob);
      setCompressedSize(blob.size);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The PDF could not be compressed.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setItem(null); setResult(null); setError(null); setOriginalSize(0); setCompressedSize(0); };

  if (!item) return <UploadDropzone accept="application/pdf,.pdf" fileKind="PDF" note="PDF · up to 100 MB" onFiles={addFile} error={error} />;

  const reduction = originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return <div className="tool-panel">
    <div className="control-card">
      <div className="control-heading">
        <div>
          <span className="kicker">YOUR PDF</span>
          <h2>Prepare to compress.</h2>
        </div>
        <strong>{Math.ceil(originalSize / 1024)} KB</strong>
      </div>
      <article className="pdf-file-list" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px" }}>
        <FileText aria-hidden="true" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong>{item.file.name}</strong>
          <small>{Math.ceil(item.file.size / 1024)} KB</small>
        </div>
        <button type="button" className="remove-file" aria-label="Remove file" onClick={() => { setItem(null); setResult(null); }}>
          <Trash2 />
        </button>
      </article>
    </div>
    <div className="control-card">
      <div className="control-heading">
        <div>
          <span className="kicker">COMPRESSION</span>
          <h2>Optimize your PDF.</h2>
        </div>
      </div>
      <div style={{ padding: "12px", color: "var(--muted)", fontSize: "14px" }}>
        Removes metadata and optimizes the PDF structure to reduce file size.
      </div>
    </div>
    {compressedSize > 0 && (
      <div className="control-card" style={{ background: "var(--surface-soft)" }}>
        <div style={{ padding: "12px" }}>
          <span style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong>Original:</strong> <span>{Math.ceil(originalSize / 1024)} KB</span>
          </span>
          <span style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong>Compressed:</strong> <span>{Math.ceil(compressedSize / 1024)} KB</span>
          </span>
          {reduction > 0 && <span style={{ display: "flex", justifyContent: "space-between", color: "var(--brand)", fontWeight: "650" }}>
            <strong>Reduction:</strong> <span>{reduction}%</span>
          </span>}
        </div>
      </div>
    )}
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="action-row">
      {result ? <DownloadLink blob={result} filename={`${item.file.name.replace(/\.pdf$/i, "")}-compressed.pdf`}><Zap style={{ width: "16px" }} /> Download Compressed PDF</DownloadLink> : <ProcessingButton busy={busy} onClick={compress}><Zap /> Compress PDF</ProcessingButton>}
      <button className="button secondary" type="button" onClick={reset}><FilePlus2 /> Start over</button>
    </div>
  </div>;
}
