import type { Metadata } from "next";
import { PdfCompressTool } from "@/components/tools/pdf-compress-tool";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("pdf-compress")!;
export const metadata: Metadata = toolMetadata(tool);

export default function PdfCompressPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>{tool.name}</h1>
        <p>{tool.longDescription}</p>
      </div>
      <PdfCompressTool />
    </main>
  );
}
