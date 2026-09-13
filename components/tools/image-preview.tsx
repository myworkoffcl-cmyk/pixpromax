"use client";

import Image from "next/image";
import { formatFileSize } from "@/lib/image/format-size";
import { useObjectUrl } from "@/components/tools/use-object-url";

interface ImagePreviewProps {
  blob: Blob;
  label: string;
  filename?: string;
  size?: number;
  dimensions?: { width: number; height: number } | null;
}

export function ImagePreview({ blob, label, filename, size = blob.size, dimensions }: ImagePreviewProps) {
  const url = useObjectUrl(blob);
  return (
    <article className="preview-card">
      <div className="preview-label"><span>{label}</span>{dimensions && <small>{dimensions.width} × {dimensions.height}</small>}</div>
      <div className="preview-frame">{url && <Image src={url} alt={`${label} preview${filename ? ` of ${filename}` : ""}`} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" />}</div>
      <div className="preview-meta"><span title={filename}>{filename ?? "image"}</span><strong>{formatFileSize(size)}</strong></div>
    </article>
  );
}
