import type { Metadata } from "next";
import { ImageToPdfTool } from "@/components/tools/image-to-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("jpg-to-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function JpgToPdfPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <ImageToPdfTool />
      </ToolPageShell>
    </main>
  );
}
