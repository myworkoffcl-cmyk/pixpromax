"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadLink } from "@/components/tools/download-link";
import type { ProcessedImage } from "@/types/image";

export function ResultActions({ result, onReset }: { result: ProcessedImage; onReset: () => void }) {
  return <div className="result-actions"><DownloadLink blob={result.blob} filename={result.filename}>Download image</DownloadLink><Button variant="secondary" onClick={onReset}><RotateCcw /> Start over</Button></div>;
}
