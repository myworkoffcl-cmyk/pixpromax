import type { Metadata } from "next";
import { ResizeTool } from "@/components/tools/resize-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("resize-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ResizeImagePage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <ResizeTool />
      </ToolPageShell>
    </main>
  );
}
