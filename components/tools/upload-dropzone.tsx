"use client";

import { File as FileIcon, FileImage, UploadCloud, Link as LinkIcon } from "lucide-react";
import { useId, useRef, useState } from "react";
import { MAX_BATCH_FILES, MAX_SINGLE_IMAGE_SIZE } from "@/config/limits";
import { useTranslation } from "@/lib/use-translation";

interface UploadDropzoneProps {
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  error?: string | null;
  compact?: boolean;
  accept?: string;
  note?: string;
  fileKind?: "image" | "PDF";
}

export function UploadDropzone({ multiple = false, onFiles, error, compact = false, accept: acceptedTypes = "image/jpeg,image/png,image/webp", note, fileKind = "image" }: UploadDropzoneProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { t } = useTranslation("common");

  const handleFiles = (selected: File[]) => {
    const candidates = multiple ? selected : selected.slice(0, 1);
    onFiles(candidates);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    setUrlLoading(true);
    setUrlError(null);

    try {
      const url = urlInput.trim();
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "";

      // Extract filename from URL
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split("/").pop() || "downloaded-file";

      const file = new File([blob], filename, { type: contentType || blob.type });
      handleFiles([file]);
      setUrlInput("");
      setShowUrlInput(false);
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : "Failed to download file");
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div className={`dropzone ${dragging ? "is-dragging" : ""} ${compact ? "compact" : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(Array.from(event.dataTransfer.files)); }}>
      <input ref={inputRef} id={id} type="file" accept={acceptedTypes} multiple={multiple} onChange={(event) => { handleFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
      <button type="button" className="dropzone-button" onClick={() => inputRef.current?.click()}>
        <span className="upload-orbit"><UploadCloud aria-hidden="true" />{fileKind === "PDF" ? <FileIcon aria-hidden="true" /> : <FileImage aria-hidden="true" />}</span>
        <strong>{fileKind === "PDF"
          ? (multiple ? t("uploadDropzone.dropMultiplePdf", "Drop your PDFs here") : t("uploadDropzone.dropSinglePdf", "Drop your PDF here"))
          : (multiple ? t("uploadDropzone.dropMultiple", "Drop your images here") : t("uploadDropzone.dropSingle", "Drop your image here"))}</strong>
        <span>or <u>{multiple ? t("uploadDropzone.browseMultiple", "browse files") : t("uploadDropzone.browseSingle", "browse a file")}</u> {t("uploadDropzone.fromDevice", "from your device")}</span>
        <small>{note ?? `${fileKind === "PDF" ? t("uploadDropzone.fileTypesPDF", "PDF") : t("uploadDropzone.fileTypesImage", "JPG, PNG or WebP")} · ${multiple ? t("uploadDropzone.filesLimit", `up to ${MAX_BATCH_FILES} files`) : t("uploadDropzone.sizeLimit", `up to ${MAX_SINGLE_IMAGE_SIZE / 1024 / 1024} MB`)}`}</small>
      </button>
      <div style={{ textAlign: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
        <button
          type="button"
          className="button secondary"
          onClick={() => { setShowUrlInput(!showUrlInput); setUrlError(null); }}
          style={{ fontSize: "13px", gap: "6px", display: "inline-flex", alignItems: "center" }}
        >
          <LinkIcon size={16} />
          {t("uploadDropzone.addFromUrl", "Add from URL")}
        </button>
      </div>
      {showUrlInput && (
        <div style={{ marginTop: "12px", padding: "12px", background: "var(--surface-soft)", borderRadius: "6px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder={`Enter ${fileKind === "PDF" ? "PDF" : "image"} URL...`}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              disabled={urlLoading}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                fontSize: "13px",
                color: "var(--ink)",
                backgroundColor: "white",
              }}
            />
            <button
              type="button"
              className="button primary"
              onClick={handleUrlSubmit}
              disabled={urlLoading || !urlInput.trim()}
              style={{ fontSize: "13px" }}
            >
              {urlLoading ? "Loading..." : "Fetch"}
            </button>
          </div>
          {urlError && <p className="form-error" style={{ marginTop: "8px", marginBottom: 0 }}>{urlError}</p>}
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
