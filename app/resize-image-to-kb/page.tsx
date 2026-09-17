import type { Metadata } from "next";
import { TargetSizeTool } from "@/components/tools/target-size-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("resize-image-to-kb")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ResizeToKbPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <TargetSizeTool />
      </ToolPageShell>
    </main>
  );
}
