"use client";

import { Download } from "lucide-react";
import { useObjectUrl } from "@/components/tools/use-object-url";

export function DownloadLink({ blob, filename, children }: { blob: Blob; filename: string; children: React.ReactNode }) {
  const url = useObjectUrl(blob);
  return <a className="button primary" href={url ?? undefined} download={filename}><Download aria-hidden="true" />{children}</a>;
}
