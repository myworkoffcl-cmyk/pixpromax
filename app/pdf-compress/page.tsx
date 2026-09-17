import type { Metadata } from "next";
import { PdfCompressTool } from "@/components/tools/pdf-compress-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("pdf-compress")!;
export const metadata: Metadata = toolMetadata(tool);

export default function PdfCompressPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <PdfCompressTool />
      </ToolPageShell>
    </main>
  );
}
