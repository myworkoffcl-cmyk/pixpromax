import type { Metadata } from "next";
import { PdfTool } from "@/components/tools/pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("organize-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function OrganizePdfPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <PdfTool mode="organize" />
      </ToolPageShell>
    </main>
  );
}
