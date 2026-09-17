import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("merge-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function MergePdfPage() {
  return (
    <main className="workspace-page">
      <div className="workspace-category-header shell">
        <h1>{tool.name}</h1>
        <p>{tool.longDescription}</p>
      </div>
      <PdfTool mode="merge" />
    </main>
  );
}
