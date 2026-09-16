"use client";

import { File, FileImage, UploadCloud } from "lucide-react";
import { useId, useRef, useState } from "react";
import { MAX_BATCH_FILES, MAX_SINGLE_IMAGE_SIZE } from "@/config/limits";

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

  const handleFiles = (selected: File[]) => {
    const candidates = multiple ? selected : selected.slice(0, 1);
    onFiles(candidates);
  };

  return (
    <div className={`dropzone ${dragging ? "is-dragging" : ""} ${compact ? "compact" : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(Array.from(event.dataTransfer.files)); }}>
      <input ref={inputRef} id={id} type="file" accept={acceptedTypes} multiple={multiple} onChange={(event) => { handleFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
      <button type="button" className="dropzone-button" onClick={() => inputRef.current?.click()}>
        <span className="upload-orbit"><UploadCloud aria-hidden="true" />{fileKind === "PDF" ? <File aria-hidden="true" /> : <FileImage aria-hidden="true" />}</span>
        <strong>{multiple ? `Drop your ${fileKind}s here` : `Drop your ${fileKind} here`}</strong>
        <span>or <u>browse {multiple ? "files" : "a file"}</u> from your device</span>
        <small>{note ?? `${fileKind === "PDF" ? "PDF" : "JPG, PNG or WebP"} · ${multiple ? `up to ${MAX_BATCH_FILES} files` : `up to ${MAX_SINGLE_IMAGE_SIZE / 1024 / 1024} MB`}`}</small>
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
