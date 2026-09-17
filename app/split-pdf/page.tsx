import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("split-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function SplitPdfPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <PdfTool mode="split" />
      </ToolPageShell>
    </main>
  );
}
