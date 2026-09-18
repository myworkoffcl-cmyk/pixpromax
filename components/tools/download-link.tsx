"use client";

import { Download } from "lucide-react";
import { useMemo } from "react";
import { useObjectUrl } from "@/components/tools/use-object-url";

export function DownloadLink({ blob, filename, children }: { blob: Blob; filename: string; children: React.ReactNode }) {
  // Browsers with a built-in PDF viewer (Chrome, Edge) can intercept an <a download>
  // click on an "application/pdf" blob: URL and try to preview it instead of saving
  // it, which shows up as a download that starts but never finalizes. Re-wrapping
  // the bytes as application/octet-stream forces a plain file save; the `download`
  // attribute still supplies the real filename/extension, so nothing else changes.
  const downloadBlob = useMemo(() => (blob.type === "application/pdf" ? new Blob([blob], { type: "application/octet-stream" }) : blob), [blob]);
  const url = useObjectUrl(downloadBlob);
  return <a className="button primary" href={url ?? undefined} download={filename}><Download aria-hidden="true" />{children}</a>;
}
