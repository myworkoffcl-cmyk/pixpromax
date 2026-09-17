import type { Metadata } from "next";
import { BatchConverterTool } from "@/components/tools/batch-converter-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("batch-converter")!;
export const metadata: Metadata = toolMetadata(tool);

export default function BatchConverterPage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <BatchConverterTool />
      </ToolPageShell>
    </main>
  );
}
