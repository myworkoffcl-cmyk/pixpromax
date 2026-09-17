import type { Metadata } from "next";
import { CompressTool } from "@/components/tools/compress-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { getTool } from "@/config/tools";
import { toolMetadata } from "@/lib/seo";

const tool = getTool("compress-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function CompressImagePage() {
  return (
    <main className="workspace-page">
      <ToolPageShell tool={tool}>
        <CompressTool />
      </ToolPageShell>
    </main>
  );
}
